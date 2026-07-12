// ============================================================
// 担当: メンバー4（チャット）
// 責務: マッチ一覧・トークルームのメッセージ取得・送信。
// 前提: requireAuth 通過済み → req.user = { id, role } が使える
// ルール: 自分が参加している match のメッセージしか読めない／送れない
// ============================================================
import { supabase } from "../lib/supabase.js";

async function getMatchById(matchId) {
  return supabase
    .from("matches")
    .select("id, user_a_id, user_b_id, matched_at")
    .eq("id", matchId)
    .maybeSingle();
}

function isMatchParticipant(match, userId) {
  return match.user_a_id === userId || match.user_b_id === userId;
}

/**
 * GET /api/v1/matches — 成立したマッチ一覧（チャット一覧画面用）
 * 入力: なし
 * 出力: 200 { matches: [{ id, partner: { id, name, role, avatar_url },
 *             matched_at, last_message?: { body, sent_at } }] }
 * 手順: matches から user_a_id または user_b_id が自分の行を取得し、
 *       相手側のユーザー情報と最新メッセージを付けて返す
 */
export async function getMatches(req, res) {
  try {
    const { data: matchRows, error: matchesError } = await supabase
      .from("matches")
      .select("id, user_a_id, user_b_id, matched_at")
      .or(`user_a_id.eq.${req.user.id},user_b_id.eq.${req.user.id}`)
      .order("matched_at", { ascending: false });

    if (matchesError) {
      return res.status(500).json({ error: matchesError.message });
    }

    if (!matchRows || matchRows.length === 0) {
      return res.status(200).json({ matches: [] });
    }

    const partnerIds = [
      ...new Set(
        matchRows.map((match) =>
          match.user_a_id === req.user.id
            ? match.user_b_id
            : match.user_a_id
        )
      ),
    ];

    const { data: partners, error: partnersError } = await supabase
      .from("users")
      .select("id, name, role, avatar_url")
      .in("id", partnerIds);

    if (partnersError) {
      return res.status(500).json({ error: partnersError.message });
    }

    const { data: messageRows, error: messagesError } = await supabase
      .from("messages")
      .select("match_id, body, sent_at")
      .in(
        "match_id",
        matchRows.map((match) => match.id)
      )
      .order("sent_at", { ascending: false });

    if (messagesError) {
      return res.status(500).json({ error: messagesError.message });
    }

    const partnerById = new Map(
      (partners ?? []).map((partner) => [partner.id, partner])
    );

    const lastMessageByMatchId = new Map();
    for (const message of messageRows ?? []) {
      if (!lastMessageByMatchId.has(message.match_id)) {
        lastMessageByMatchId.set(message.match_id, message);
      }
    }

    const matches = matchRows.map((match) => {
      const partnerId =
        match.user_a_id === req.user.id
          ? match.user_b_id
          : match.user_a_id;

      const lastMessage = lastMessageByMatchId.get(match.id);

      const item = {
        id: match.id,
        partner: partnerById.get(partnerId) ?? null,
        matched_at: match.matched_at,
      };

      if (lastMessage) {
        item.last_message = {
          body: lastMessage.body,
          sent_at: lastMessage.sent_at,
        };
      }

      return item;
    });

    return res.status(200).json({ matches });
  } catch (error) {
    console.error("getMatches error:", error);
    return res.status(500).json({
      error: "マッチ一覧の取得に失敗しました",
    });
  }
}

/**
 * GET /api/v1/matches/:id/messages — トークルームの履歴取得
 * 入力: req.params.id = マッチID
 * 出力: 200 { messages: [{ id, sender_id, body, sent_at }] }  // 古い順
 * エラー: 403 自分が参加していないマッチ / 404 マッチが存在しない
 */
export async function getMessages(req, res) {
  try {
    const { data: match, error: matchError } = await getMatchById(
      req.params.id
    );

    if (matchError) {
      return res.status(500).json({ error: matchError.message });
    }

    if (!match) {
      return res.status(404).json({
        error: "マッチが見つかりません",
      });
    }

    if (!isMatchParticipant(match, req.user.id)) {
      return res.status(403).json({
        error: "このマッチのメッセージを閲覧できません",
      });
    }

    const { data: messages, error: messagesError } = await supabase
      .from("messages")
      .select("id, sender_id, body, sent_at")
      .eq("match_id", match.id)
      .order("sent_at", { ascending: true });

    if (messagesError) {
      return res.status(500).json({ error: messagesError.message });
    }

    return res.status(200).json({
      messages: messages ?? [],
    });
  } catch (error) {
    console.error("getMessages error:", error);
    return res.status(500).json({
      error: "メッセージの取得に失敗しました",
    });
  }
}

/**
 * POST /api/v1/matches/:id/messages — メッセージ送信
 * 入力: req.params.id = マッチID, req.body = { body: string }
 * 出力: 201 { message: { id, match_id, sender_id, body, sent_at } }
 * エラー: 400 本文が空 / 403 自分が参加していないマッチ
 * 補足: INSERT すれば Supabase Realtime がクライアント側に配信する
 */
export async function sendMessage(req, res) {
  try {
    const body = req.body?.body;

    if (typeof body !== "string" || !body.trim()) {
      return res.status(400).json({
        error: "本文を入力してください",
      });
    }

    const { data: match, error: matchError } = await getMatchById(
      req.params.id
    );

    if (matchError) {
      return res.status(500).json({ error: matchError.message });
    }

    if (!match) {
      return res.status(404).json({
        error: "マッチが見つかりません",
      });
    }

    if (!isMatchParticipant(match, req.user.id)) {
      return res.status(403).json({
        error: "このマッチにメッセージを送信できません",
      });
    }

    const { data: message, error: insertError } = await supabase
      .from("messages")
      .insert({
        match_id: match.id,
        sender_id: req.user.id,
        body: body.trim(),
      })
      .select("id, match_id, sender_id, body, sent_at")
      .single();

    if (insertError) {
      return res.status(500).json({ error: insertError.message });
    }

    return res.status(201).json({ message });
  } catch (error) {
    console.error("sendMessage error:", error);
    return res.status(500).json({
      error: "メッセージの送信に失敗しました",
    });
  }
}
