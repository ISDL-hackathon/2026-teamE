// ============================================================
// 担当: 共通部（完成済み・編集禁止）
// 責務: ローカル開発用の起動エントリポイント。
//        Express アプリ本体（ルーティング定義）は app.js を参照。
//        Vercel 上では api/index.js がこの app.js を読み込んで動く。
// ============================================================
import app from "./app.js";

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`ISDLove server listening on http://localhost:${PORT}`);
});
