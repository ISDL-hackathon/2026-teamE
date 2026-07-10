// ============================================================
// 担当: メンバー3（ランダムマッチング・通知）
// 責務: 履歴・通知の一覧取得と既読化。
// 前提: requireAuth 通過済み → req.user = { id, role } が使える
// ============================================================
import { supabase } from "../lib/supabase.js";

/**
 * GET /api/v1/notifications — 履歴・通知一覧
 * 入力: なし
 * 出力: 200 { notifications: [{ id, type: "MATCH"|"RANDOM"|"SYSTEM",
 *             message, is_read, created_at }] }  // 新しい順
 */
export async function getNotifications(req, res) {
  // TODO: 実装する
  res.status(501).json({ error: "Not implemented" });
}

/**
 * PUT /api/v1/notifications/:id/read — 既読化
 * 入力: req.params.id = 通知ID
 * 出力: 200 { notification: 更新後の通知 }
 * エラー: 404 自分宛でない or 存在しない通知
 */
export async function markNotificationRead(req, res) {
  // TODO: 実装する
  res.status(501).json({ error: "Not implemented" });
}
