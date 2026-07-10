// ============================================================
// 担当: メンバー1（認証・ユーザー）
// 責務: 新規登録・ログイン。
//        パスワードは bcryptjs でハッシュ化して users に保存し、
//        成功時は signToken() で JWT を発行して返す。
// 使うもの: supabase（DB）, signToken（JWT発行）, bcryptjs
// ============================================================
import { supabase } from "../lib/supabase.js";
import { signToken } from "../middleware/auth.js";
// import bcrypt from "bcryptjs";  // 実装時にコメントを外す

/**
 * POST /api/v1/auth/signup — 新規登録
 * 入力: req.body = { name: string, email: string, password: string,
 *                    role: "B4" | "M1" | "M2" | "FACULTY" }
 * 出力: 201 { token: string, user: { id, name, email, role, bio, avatar_url } }
 * エラー: 400 入力不備 / 409 メール重複
 * 手順: ①入力検証 ②メール重複チェック ③bcryptでハッシュ化 ④users にINSERT
 *       ⑤signToken({id, role}) でトークン発行して返す
 */
export async function signup(req, res) {
  // TODO: 実装する
  res.status(501).json({ error: "Not implemented" });
}

/**
 * POST /api/v1/auth/login — ログイン
 * 入力: req.body = { email: string, password: string }
 * 出力: 200 { token: string, user: { id, name, email, role, bio, avatar_url } }
 * エラー: 401 メールまたはパスワードが違う
 * 手順: ①email で users を検索 ②bcrypt.compare でパスワード照合
 *       ③signToken でトークン発行して返す
 */
export async function login(req, res) {
  // TODO: 実装する
  res.status(501).json({ error: "Not implemented" });
}
