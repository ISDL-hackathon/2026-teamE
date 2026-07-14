// ============================================================
// 担当: メンバー2（個人マッチング）
// 責務: スワイプ候補の取得・いいね/保留の送信・週3回制限の管理。
// 前提: requireAuth 通過済み → req.user = { id, role } が使える
// ルール:
//   - B4 ⇔ {M1, M2, FACULTY} の縦方向のみマッチング対象
//   - いいね(LIKE)は週3人まで（月曜0:00〜日曜23:59 JST）。保留(HOLD)はカウント外
//   - 相互LIKEが揃ったら matches にINSERTし、両者に MATCH 通知を作る
// ============================================================
import { supabase } from "../lib/supabase.js";

const LIKE_LIMIT = 3;
const JST_OFFSET_MS = 9 * 60 * 60 * 1000;
const SENIOR_ROLES = ["M1", "M2", "FACULTY"];

/** 現在の土曜 00:00:00 JST を基準にした week_key を返す */
export function currentWeekKey(date = new Date()) {
  const weekStart = getSaturdayStartJst(date);
  const jst = new Date(weekStart.getTime() + JST_OFFSET_MS);
  const d = new Date(
    Date.UTC(jst.getUTCFullYear(), jst.getUTCMonth(), jst.getUTCDate())
  );

  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));

  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const week = Math.ceil(((d - yearStart) / 86400000 + 1) / 7);

  return `${d.getUTCFullYear()}-W${String(week).padStart(2, "0")}`;
}

/** 直近の土曜 00:00:00 JST を Date で返す */
function getSaturdayStartJst(now = new Date()) {
  const jst = new Date(now.getTime() + JST_OFFSET_MS);
  const daysFromSaturday = (jst.getUTCDay() + 1) % 7;

  const saturdayJstMs = Date.UTC(
    jst.getUTCFullYear(),
    jst.getUTCMonth(),
    jst.getUTCDate() - daysFromSaturday,
    0,
    0,
    0,
    0
  );

  return new Date(saturdayJstMs - JST_OFFSET_MS);
}

/** 指定ユーザーの今週の LIKE 件数を返す */
async function countWeeklyLikes(userId, weekStart) {
  const { count, error } = await supabase
    .from("likes")
    .select("*", { count: "exact", head: true })
    .eq("from_user_id", userId)
    .eq("action", "LIKE")
    .gte("created_at", weekStart.toISOString());

  if (error) throw error;
  return count ?? 0;
}

/** B4 と M1/M2/FACULTY の組み合わせか判定する */
function isVerticalPair(roleA, roleB) {
  return (
    (roleA === "B4" && SENIOR_ROLES.includes(roleB)) ||
    (roleB === "B4" && SENIOR_ROLES.includes(roleA))
  );
}

/**
 * GET /api/v1/matching/candidates — スワイプ候補一覧
 * 入力: なし
 * 出力: 200 { candidates: [{ id, name, role, bio, avatar_url }] }
 * 手順: ①req.user.role が B4 なら M1/M2/FACULTY を、そうでなければ B4 を対象に
 *       ②自分が action=LIKE 済みの相手は除外（HOLD は再表示するので含める）
 *       ③HOLD 済みの相手は配列の末尾に回す
 */
export async function getCandidates(req, res) {
  try {
    const targetRoles =
      req.user.role === "B4" ? SENIOR_ROLES : ["B4"];

    const { data: users, error: usersError } = await supabase
      .from("users")
      .select("id, name, role, bio, avatar_url")
      .in("role", targetRoles)
      .neq("id", req.user.id);

    if (usersError) {
      return res.status(500).json({ error: usersError.message });
    }

    const { data: myLikes, error: likesError } = await supabase
      .from("likes")
      .select("to_user_id, action")
      .eq("from_user_id", req.user.id);

    if (likesError) {
      return res.status(500).json({ error: likesError.message });
    }

    const { data: incomingLikes, error: incomingLikesError } =
      await supabase
        .from("likes")
        .select("from_user_id, created_at")
        .eq("to_user_id", req.user.id)
        .eq("action", "LIKE");

    if (incomingLikesError) {
      return res.status(500).json({
        error: incomingLikesError.message,
      });
    }

    const likedIds = new Set(
      (myLikes ?? [])
        .filter((like) => like.action === "LIKE")
        .map((like) => like.to_user_id)
    );

    const heldIds = new Set(
      (myLikes ?? [])
        .filter((like) => like.action === "HOLD")
        .map((like) => like.to_user_id)
    );

    const incomingLikeAtByUserId = new Map(
      (incomingLikes ?? []).map((like) => [
        like.from_user_id,
        like.created_at,
      ])
    );

    const candidates = (users ?? [])
      .filter((user) => !likedIds.has(user.id))
      .sort((a, b) => {
        const aIncomingAt = incomingLikeAtByUserId.get(a.id);
        const bIncomingAt = incomingLikeAtByUserId.get(b.id);

        if (aIncomingAt && bIncomingAt) {
          return bIncomingAt.localeCompare(aIncomingAt);
        }

        if (aIncomingAt) return -1;
        if (bIncomingAt) return 1;

        return Number(heldIds.has(a.id)) - Number(heldIds.has(b.id));
      });

    return res.status(200).json({ candidates });
  } catch (error) {
    console.error("getCandidates error:", error);
    return res.status(500).json({
      error: "候補の取得に失敗しました",
    });
  }
}

/**
 * POST /api/v1/matching/likes — いいね／保留を送信
 * 入力: req.body = { to_user_id: string, action: "LIKE" | "HOLD" }
 * 出力: 200 { matched: boolean, match?: { id, user_a_id, user_b_id },
 *             likes_remaining: number }
 * エラー: 400 縦方向でない相手 / 429 週3回の上限超過（LIKEのみ）
 * 手順: ①相手のroleを確認し縦方向かチェック
 *       ②action=LIKE の場合、今週(currentWeekKey基準)のLIKE件数を数え
 *         3件到達済みなら 429 を返す
 *       ③likes にUPSERT ④相手→自分のLIKEが存在すれば matches を作成し
 *         両者に MATCH 通知をINSERT ⑤matched と残数を返す
 */
export async function sendLike(req, res) {
  try {
    const { to_user_id, action } = req.body ?? {};

    if (!to_user_id || !["LIKE", "HOLD"].includes(action)) {
      return res.status(400).json({
        error: "送信先またはアクションが正しくありません",
      });
    }

    if (to_user_id === req.user.id) {
      return res.status(400).json({
        error: "自分自身には送信できません",
      });
    }

    const { data: targetUser, error: targetError } = await supabase
      .from("users")
      .select("id, name, role")
      .eq("id", to_user_id)
      .maybeSingle();

    if (targetError) {
      return res.status(500).json({ error: targetError.message });
    }

    if (!targetUser) {
      return res.status(404).json({
        error: "相手ユーザーが見つかりません",
      });
    }

    if (!isVerticalPair(req.user.role, targetUser.role)) {
      return res.status(400).json({
        error: "B4と院生・教員の組み合わせでのみ送信できます",
      });
    }

    const weekStart = getSaturdayStartJst();

    if (action === "LIKE") {
      const used = await countWeeklyLikes(req.user.id, weekStart);

      if (used >= LIKE_LIMIT) {
        return res.status(429).json({
          error: "今週のいいねは上限（3人）です",
        });
      }
    }

    const { data: previousLike, error: previousLikeError } = await supabase
  .from("likes")
  .select("action")
  .eq("from_user_id", req.user.id)
  .eq("to_user_id", to_user_id)
  .maybeSingle();

if (previousLikeError) {
  return res.status(500).json({ error: previousLikeError.message });
}

    const { error: upsertError } = await supabase
      .from("likes")
      .upsert(
        {
          from_user_id: req.user.id,
          to_user_id,
          action,
          created_at: new Date().toISOString(),
        },
        {
          onConflict: "from_user_id,to_user_id",
        }
      );

    if (upsertError) {
      return res.status(500).json({ error: upsertError.message });
    }

    if (action === "LIKE" && previousLike?.action !== "LIKE") {
  const { error: likeNotificationError } = await supabase
    .from("notifications")
    .insert({
      user_id: targetUser.id,
      actor_user_id: req.user.id,
      type: "LIKE",
      message: "新しい「いいね」が届きました！",
    });

  if (likeNotificationError) {
    return res.status(500).json({
      error: likeNotificationError.message,
    });
  }
}

    let match = null;

    if (action === "LIKE") {
      const { data: reciprocalLike, error: reciprocalError } = await supabase
        .from("likes")
        .select("id")
        .eq("from_user_id", to_user_id)
        .eq("to_user_id", req.user.id)
        .eq("action", "LIKE")
        .maybeSingle();

      if (reciprocalError) {
        return res.status(500).json({ error: reciprocalError.message });
      }

      if (reciprocalLike) {
        // ID順を固定し、同じペアを逆順で二重作成しない
        const [userAId, userBId] = [req.user.id, to_user_id].sort();

        const { data: existingMatch, error: existingMatchError } =
          await supabase
            .from("matches")
            .select("id, user_a_id, user_b_id, matched_at")
            .eq("user_a_id", userAId)
            .eq("user_b_id", userBId)
            .maybeSingle();

        if (existingMatchError) {
          return res.status(500).json({
            error: existingMatchError.message,
          });
        }

        if (existingMatch) {
          match = existingMatch;
        } else {
          const { data: createdMatch, error: matchError } = await supabase
            .from("matches")
            .insert({
              user_a_id: userAId,
              user_b_id: userBId,
            })
            .select("id, user_a_id, user_b_id, matched_at")
            .single();

          if (matchError) {
            return res.status(500).json({ error: matchError.message });
          }

          match = createdMatch;

const { error: notificationError } = await supabase
  .from("notifications")
  .insert([
    {
      user_id: req.user.id,
      actor_user_id: targetUser.id,
      match_id: match.id,
      type: "MATCH",
      message: `${targetUser.name} さんとマッチしました！`,
    },
    {
      user_id: targetUser.id,
      actor_user_id: req.user.id,
      match_id: match.id,
      type: "MATCH",
      message: "新しいマッチが成立しました！",
    },
  ]);

if (notificationError) {
  return res.status(500).json({
    error: notificationError.message,
  });
}

        }
      }
    }


    const used = await countWeeklyLikes(req.user.id, weekStart);

    return res.status(200).json({
      matched: Boolean(match),
      ...(match ? { match } : {}),
      likes_remaining: Math.max(0, LIKE_LIMIT - used),
    });
  } catch (error) {
    console.error("sendLike error:", error);
    return res.status(500).json({
      error: "いいね・保留の送信に失敗しました",
    });
  }
}

/**
 * GET /api/v1/matching/quota — 今週のいいね残数
 * 入力: なし
 * 出力: 200 { limit: 3, used: number, remaining: number, week_key: string }
 */
export async function getQuota(req, res) {
  try {
    const used = await countWeeklyLikes(
      req.user.id,
      getSaturdayStartJst()
    );

    return res.status(200).json({
      limit: LIKE_LIMIT,
      used,
      remaining: Math.max(0, LIKE_LIMIT - used),
      week_key: currentWeekKey(),
    });
  } catch (error) {
    console.error("getQuota error:", error);
    return res.status(500).json({
      error: "いいね残数の取得に失敗しました",
    });
  }
}

