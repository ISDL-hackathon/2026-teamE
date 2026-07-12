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
  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", req.user.id)
    .order("created_at", { ascending: false });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

}

/**
 * PUT /api/v1/notifications/:id/read — 既読化
 * 入力: req.params.id = 通知ID
 * 出力: 200 { notification: 更新後の通知 }
 * エラー: 404 自分宛でない or 存在しない通知
 */
export async function markNotificationRead(req, res) {
  // TODO: 実装する
  const { id } = req.params;

  // 通知を取得
  const { data: notification, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("id", id)
    .eq("user_id", req.user.id)
    .maybeSingle();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  if (!notification) {
    return res.status(404).json({ error: "Notification not found" });
  }

  // 既読に更新
  const { data, error: updateError } = await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("id", id)
    .select()
    .single();

  if (updateError) {
    return res.status(500).json({ error: updateError.message });
  }
  
}
