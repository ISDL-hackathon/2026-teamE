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
    <div className="p-6 space-y-6">
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
    </div>
  );
}
