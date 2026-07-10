// ============================================================
// 担当: メンバー4（チャット）
// 責務: マッチ一覧・トークルームのメッセージ取得・送信。
// 前提: requireAuth 通過済み → req.user = { id, role } が使える
// ルール: 自分が参加している match のメッセージしか読めない／送れない
// ============================================================
import { supabase } from "../lib/supabase.js";

/**
 * GET /api/v1/matches — 成立したマッチ一覧（チャット一覧画面用）
 * 入力: なし
 * 出力: 200 { matches: [{ id, partner: { id, name, role, avatar_url },
 *             matched_at, last_message?: { body, sent_at } }] }
 * 手順: matches から user_a_id または user_b_id が自分の行を取得し、
 *       相手側のユーザー情報と最新メッセージを付けて返す
 */
export async function getMatches(req, res) {
  // TODO: 実装する
  res.status(501).json({ error: "Not implemented" });
}

/**
 * GET /api/v1/matches/:id/messages — トークルームの履歴取得
 * 入力: req.params.id = マッチID
 * 出力: 200 { messages: [{ id, sender_id, body, sent_at }] }  // 古い順
 * エラー: 403 自分が参加していないマッチ / 404 マッチが存在しない
 */
export async function getMessages(req, res) {
  // TODO: 実装する
  res.status(501).json({ error: "Not implemented" });
}

/**
 * POST /api/v1/matches/:id/messages — メッセージ送信
 * 入力: req.params.id = マッチID, req.body = { body: string }
 * 出力: 201 { message: { id, match_id, sender_id, body, sent_at } }
 * エラー: 400 本文が空 / 403 自分が参加していないマッチ
 * 補足: INSERT すれば Supabase Realtime がクライアント側に配信する
 */
export async function sendMessage(req, res) {
  // TODO: 実装する
  res.status(501).json({ error: "Not implemented" });
}
