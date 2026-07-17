import { randomUUID } from "node:crypto";
import multer from "multer";
import { supabase } from "../lib/supabase.js";

const MAX_AVATAR_BYTES = 5 * 1024 * 1024;
const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: MAX_AVATAR_BYTES,
  },
});

export function parseAvatarUpload(req, res, next) {
  upload.single("avatar")(req, res, (error) => {
    if (error instanceof multer.MulterError) {
      if (error.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({
          error: "画像ファイルは5MB以下にしてください",
        });
      }

      return res.status(400).json({
        error: "画像ファイルを受け取れませんでした",
      });
    }

    if (error) {
      return res.status(400).json({
        error: "画像ファイルを受け取れませんでした",
      });
    }

    next();
  });
}

export async function uploadAvatar(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: "画像ファイルを選択してください",
      });
    }

    if (!ALLOWED_MIME_TYPES.has(req.file.mimetype)) {
      return res.status(400).json({
        error: "JPEG、PNG、WebP形式の画像を選択してください",
      });
    }

    // ユーザーごとに同じ場所へ上書きし、画像を増やし続けない。
    const objectPath = `${req.user.id}/avatar`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(objectPath, req.file.buffer, {
        contentType: req.file.mimetype,
        cacheControl: "3600",
        upsert: true,
      });

    if (uploadError) {
      console.error("uploadAvatar storage error:", uploadError);

      return res.status(500).json({
        error: "画像のアップロードに失敗しました",
      });
    }

    const { data: publicUrlData } = supabase.storage
      .from("avatars")
      .getPublicUrl(objectPath);

    // 同じファイル名を上書きしても、ブラウザが古い画像をキャッシュしないようにする。
    const avatarUrl = `${publicUrlData.publicUrl}?v=${Date.now()}`;

    const { data: user, error: updateError } = await supabase
      .from("users")
      .update({ avatar_url: avatarUrl })
      .eq("id", req.user.id)
      .select("id, name, email, role, bio, avatar_url, created_at")
      .maybeSingle();

    if (updateError) {
      console.error("uploadAvatar user update error:", updateError);

      return res.status(500).json({
        error: "プロフィール画像の保存に失敗しました",
      });
    }

    if (!user) {
      return res.status(404).json({
        error: "ユーザーが見つかりません",
      });
    }

    return res.status(200).json({ user });
  } catch (error) {
    console.error("uploadAvatar error:", error);

    return res.status(500).json({
      error: "プロフィール画像のアップロードに失敗しました",
    });
  }
}