// ============================================================
// 担当: メンバー1（認証・ユーザー）
// 責務: ログイン中ユーザーの情報取得・プロフィール更新。
// 前提: requireAuth 通過済み → req.user = { id, role } が使える
// ============================================================
import { supabase } from "../lib/supabase.js";

/**
 * GET /api/v1/me — 自分の情報取得
 * 入力: なし（req.user.id を使う）
 * 出力: 200 { user: { id, name, email, role, bio, avatar_url, created_at } }
 * エラー: 404 ユーザーが存在しない
 */
export async function getMe(req, res) {
  // TODO: 実装する
  res.status(501).json({ error: "Not implemented" });
}

/**
 * PUT /api/v1/me/profile — プロフィール更新（保存ボタンで呼ばれる）
 * 入力: req.body = { name?: string, bio?: string, avatar_url?: string }
 *       ※ role / email は変更不可。渡されても無視する
 * 出力: 200 { user: 更新後のユーザー }
 * エラー: 400 入力不備
 */
export async function updateProfile(req, res) {
  // TODO: 実装する
  res.status(501).json({ error: "Not implemented" });
}
