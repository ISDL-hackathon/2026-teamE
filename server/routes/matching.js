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

/** 今週の week_key（ISO週, 例 "2026-W28"）を返すユーティリティ（完成済み） */
export function currentWeekKey(date = new Date()) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const week = Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
  return `${d.getUTCFullYear()}-W${String(week).padStart(2, "0")}`;
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
  // TODO: 実装する
  res.status(501).json({ error: "Not implemented" });
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
  // TODO: 実装する
  res.status(501).json({ error: "Not implemented" });
}

/**
 * GET /api/v1/matching/quota — 今週のいいね残数
 * 入力: なし
 * 出力: 200 { limit: 3, used: number, remaining: number, week_key: string }
 */
export async function getQuota(req, res) {
  // TODO: 実装する
  res.status(501).json({ error: "Not implemented" });
}
