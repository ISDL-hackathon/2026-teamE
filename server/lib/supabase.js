// ============================================================
// 担当: 共通部（完成済み・編集禁止）
// 責務: Supabase クライアントの初期化。
//        各ルートファイルは `import { supabase } from "../lib/supabase.js"`
//        でこのクライアントを使う。
// ============================================================
import { createClient } from "@supabase/supabase-js";

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_KEY;

if (!url || !key) {
  console.warn(
    "[warn] SUPABASE_URL / SUPABASE_SERVICE_KEY が未設定です。.env を確認してください。"
  );
}

export const supabase = createClient(url ?? "http://localhost", key ?? "dummy", {
  auth: { persistSession: false },
});
