// ============================================================
// 担当: メンバー3（ランダムマッチング・通知）
// 責務: 週次ランダム割り当ての取得・完了報告・生成トリガー。
// 前提: requireAuth 通過済み → req.user = { id, role } が使える
// ルール:
//   - 割り当ては (senior_id, week_key) でユニーク
//   - 割り当て「される側」はB4、「取得する側」は M1/M2/FACULTY
// ============================================================
import { supabase } from "../lib/supabase.js";
import { runWeeklyAssignment } from "../jobs/weeklyAssignment.js";
import { currentWeekKey } from "./matching.js"; // week_key ユーティリティを共用

/**
 * GET /api/v1/random/current — 今週の自分の割り当て取得
 * 入力: なし（req.user.id / req.user.role を使う）
 * 出力: 200 { b4: { id, name, bio, avatar_url }, week_key: string,
 *             status: "ASSIGNED" | "DONE" }
 * エラー: 403 B4ユーザーが叩いた場合 / 404 今週の割り当てが未生成
 * 手順: ①role が B4 なら 403 ②currentWeekKey() で今週を求め
 *       ③random_assignments から (senior_id=自分, week_key) を検索
 *       ④b4のユーザー情報をJOINして返す
 */
export async function getCurrentAssignment(req, res) {
  // TODO: 実装する
if (req.user.role === "B4") {
    return res.status(403).json({ error: "B4 users cannot view assignments" });
  }

  const week_key = currentWeekKey();

  // 今週の割り当てを取得
  const { data: assignment, error } = await supabase
    .from("random_assignments")
    .select("*")
    .eq("senior_id", req.user.id)
    .eq("week_key", week_key)
    .maybeSingle();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  if (!assignment) {
    return res.status(404).json({ error: "今週の割り当てはありません" });
  }

  // B4の情報を取得
  const { data: b4, error: userError } = await supabase
    .from("users")
    .select("id, name, bio, avatar_url")
    .eq("id", assignment.b4_id)
    .single();

  if (userError) {
    return res.status(500).json({ error: userError.message });
  }

  res.json({
    b4,
    week_key: assignment.week_key,
    status: assignment.status,
  });
}


/**
 * POST /api/v1/random/current/done — 「話しました」完了報告
 * 入力: なし
 * 出力: 200 { status: "DONE" }
 * エラー: 404 今週の割り当てがない
 * 手順: 今週の自分の割り当ての status を DONE に更新する
 */
export async function markAssignmentDone(req, res) {
  // TODO: 実装する
   const week_key = currentWeekKey();

  const { data, error } = await supabase
    .from("random_assignments")
    .update({ status: "DONE" })
    .eq("senior_id", req.user.id)
    .eq("week_key", week_key)
    .select()
    .maybeSingle();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  if (!data) {
    return res.status(404).json({ error: "今週の割り当てがありません" });
  }

  res.json({ status: "DONE" });
}

/**
 * POST /api/v1/random/generate — 週次割り当ての生成（cron / 手動トリガー用）
 * 入力: req.body = { week_key?: string }  // 省略時は今週
 * 出力: 200 { assignments: [{ senior_id, b4_id, week_key }] }
 * 手順: jobs/weeklyAssignment.js の runWeeklyAssignment(week_key) を呼ぶだけ。
 *       生成ロジック本体は weeklyAssignment.js に書く。
 */
export async function generateAssignments(req, res) {
  try {
    const week_key = req.body.week_key ?? currentWeekKey();

    const assignments = await runWeeklyAssignment(week_key);

    res.json({ assignments });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

