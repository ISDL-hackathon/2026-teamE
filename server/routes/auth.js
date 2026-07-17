// ============================================================
// 担当: メンバー1（認証・ユーザー）
// 責務: 新規登録・ログイン。
//        パスワードは bcryptjs でハッシュ化して users に保存し、
//        成功時は signToken() で JWT を発行して返す。
// 使うもの: supabase（DB）, signToken（JWT発行）, bcryptjs
// ============================================================
import crypto from "node:crypto";
import { supabase } from "../lib/supabase.js";
import { signToken } from "../middleware/auth.js";
import bcrypt from "bcryptjs";

/**
 * POST /api/v1/auth/signup — 新規登録
 * 入力: req.body = { name: string, password: string,
 *                    role: "B4" | "M1" | "M2" | "FACULTY" }
 * 出力: 201 { token: string, user: { id, name, role, bio, avatar_url } }
 * エラー: 400 入力不備 / 409 名前重複
 * 備考: DBの email 列は NOT NULL UNIQUE のままのため、
 *       ユーザーには見せない内部用の値を自動生成して保存する。
 */
export async function signup(req, res) {
  try {
    const { name, password, role } = req.body;

    // ① 入力チェック
    if (!name || !password || !role) {
      return res.status(400).json({
        error: "名前・パスワード・役職を入力してください",
      });
    }

    const allowedRoles = ["B4", "M1", "M2", "FACULTY"];

    if (!allowedRoles.includes(role)) {
      return res.status(400).json({
        error: "役職の値が正しくありません",
      });
    }

    // ② 名前の重複確認
    const { data: existingUser, error: searchError } = await supabase
      .from("users")
      .select("id")
      .eq("name", name)
      .maybeSingle();

    if (searchError) {
      return res.status(500).json({
        error: searchError.message,
      });
    }

    if (existingUser) {
      return res.status(409).json({
        error: "この名前はすでに登録されています",
      });
    }

    // ③ パスワードをハッシュ化
    const passwordHash = await bcrypt.hash(password, 10);

    // ④ usersテーブルに登録（emailはDB制約を満たすための内部用ダミー値）
    const internalEmail = `${crypto.randomUUID()}@isdlove.internal`;

    const { data: user, error: insertError } = await supabase
      .from("users")
      .insert({
        name,
        email: internalEmail,
        password_hash: passwordHash,
        role,
      })
      .select("id, name, role, bio, avatar_url")
      .single();

    if (insertError) {
      return res.status(500).json({
        error: insertError.message,
      });
    }

    // ⑤ JWTを発行
    const token = signToken({
      id: user.id,
      role: user.role,
    });

    return res.status(201).json({
      token,
      user,
    });
  } catch (error) {
    console.error("signup error:", error);

    return res.status(500).json({
      error: "新規登録に失敗しました",
    });
  }
}

/**
 * POST /api/v1/auth/login — ログイン
 * 入力: req.body = { name: string, password: string }
 * 出力: 200 { token: string, user: { id, name, role, bio, avatar_url } }
 * エラー: 401 名前またはパスワードが違う
 */
export async function login(req, res) {
  try {
    const { name, password } = req.body;

    // ① 入力チェック
    if (!name || !password) {
      return res.status(400).json({
        error: "名前とパスワードを入力してください",
      });
    }

    // ② 名前でユーザー検索
    const { data: user, error: searchError } = await supabase
      .from("users")
      .select("id, name, role, bio, avatar_url, password_hash")
      .eq("name", name)
      .maybeSingle();

    if (searchError) {
      return res.status(500).json({
        error: searchError.message,
      });
    }

    if (!user) {
      return res.status(401).json({
        error: "名前またはパスワードが違います",
      });
    }

    // ③ パスワード照合
    const passwordMatches = await bcrypt.compare(
      password,
      user.password_hash
    );

    if (!passwordMatches) {
      return res.status(401).json({
        error: "名前またはパスワードが違います",
      });
    }

    // ④ JWTを発行
    const token = signToken({
      id: user.id,
      role: user.role,
    });

    // password_hashは画面側に返さない
    const {
      password_hash: _passwordHash,
      ...safeUser
    } = user;

    return res.status(200).json({
      token,
      user: safeUser,
    });
  } catch (error) {
    console.error("login error:", error);

    return res.status(500).json({
      error: "ログインに失敗しました",
    });
  }
}
