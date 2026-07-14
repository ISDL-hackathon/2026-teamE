// ============================================================
// 担当: 共通部（完成済み・編集禁止）
// 責務: 院生・先生用トップページ。
//        「個人マッチング」→ /swipe、「ランダムマッチング」→ /random
// ============================================================
import { Link } from "react-router-dom";
import { getSessionUser } from "../lib/api.js";

export default function TopSenior() {
  const user = getSessionUser();
  return (
    <div className="min-h-[calc(100vh-4rem)] space-y-6 px-6 pb-24 pt-6">
      <h1 className="text-2xl font-bold text-primary">ISDLove</h1>
      <p className="text-gray-600">こんにちは、{user?.name} さん</p>

      <Link
        to="/swipe"
        className="block w-full py-4 rounded-xl bg-primary text-white text-center text-lg font-bold"
      >
        個人マッチング
      </Link>

      <Link
        to="/random"
        className="block w-full py-4 rounded-xl border-2 border-primary text-primary text-center text-lg font-bold"
      >
        ランダムマッチング
      </Link>
      <Link
  to="/chats"
  className="fixed bottom-20 left-1/2 z-10 w-[calc(100%-3rem)] max-w-sm -translate-x-1/2 rounded-xl bg-gray-500 px-4 py-3 text-center font-bold text-white shadow-lg"
>
  チャット一覧へ
</Link>
    </div>
  );
}
