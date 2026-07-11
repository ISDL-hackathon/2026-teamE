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
  try {
    const { data: user, error } = await supabase
      .from("users")
      .select("id, name, email, role, bio, avatar_url, created_at")
      .eq("id", req.user.id)
      .maybeSingle();

    if (error) {
      return res.status(500).json({
        error: error.message,
      });
    }

    if (!user) {
      return res.status(404).json({
        error: "ユーザーが見つかりません",
      });
    }

    return res.status(200).json({
      user,
    });
  } catch (error) {
    console.error("getMe error:", error);

    return res.status(500).json({
      error: "ユーザー情報の取得に失敗しました",
    });
  }
}

/**
 * PUT /api/v1/me/profile — プロフィール更新（保存ボタンで呼ばれる）
 * 入力: req.body = { name?: string, bio?: string, avatar_url?: string }
 *       ※ role / email は変更不可。渡されても無視する
 * 出力: 200 { user: 更新後のユーザー }
 * エラー: 400 入力不備
 */
export async function updateProfile(req, res) {
  try {
    const { name, bio, avatar_url } = req.body;

    // 更新対象だけを入れる
    const updates = {};

    if (name !== undefined) {
      const trimmedName = name.trim();

      if (!trimmedName) {
        return res.status(400).json({
          error: "名前を空にはできません",
        });
      }

      updates.name = trimmedName;
    }

    if (bio !== undefined) {
      updates.bio = bio;
    }

    if (avatar_url !== undefined) {
      updates.avatar_url = avatar_url;
    }

    // name / bio / avatar_url が1つも送られていない場合
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        error: "更新する項目がありません",
      });
    }

    const { data: user, error } = await supabase
      .from("users")
      .update(updates)
      .eq("id", req.user.id)
      .select("id, name, email, role, bio, avatar_url, created_at")
      .maybeSingle();

    if (error) {
      return res.status(500).json({
        error: error.message,
      });
    }

    if (!user) {
      return res.status(404).json({
        error: "ユーザーが見つかりません",
      });
    }

    return res.status(200).json({
      user,
    });
  } catch (error) {
    console.error("updateProfile error:", error);

    return res.status(500).json({
      error: "プロフィールの更新に失敗しました",
    });
  }
}