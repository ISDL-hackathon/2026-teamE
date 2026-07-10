// ============================================================
// 担当: メンバー2（個人マッチング）
// 責務: 個人マッチングのスワイプ画面（B4のトップページを兼ねる）。
// 実装内容:
//   - 初期表示:
//       await api("GET", "/matching/candidates") → 候補配列
//       await api("GET", "/matching/quota")      → { limit, used, remaining }
//   - 候補を1枚ずつ SwipeCard で表示
//       右スワイプ → api("POST", "/matching/likes", { to_user_id, action: "LIKE" })
//       左スワイプ → api("POST", "/matching/likes", { to_user_id, action: "HOLD" })
//   - レスポンスの likes_remaining で残数表示を更新
//   - matched: true が返ったら「マッチしました！」の演出を出す
//   - 429 が返ったら「今週のいいねは上限（3人）です」を表示しスワイプ無効化
// 使うもの: api (../lib/api.js), SwipeCard (../components/SwipeCard.jsx)
// ============================================================
import SwipeCard from "../components/SwipeCard.jsx";

export default function SwipeScreen() {
  // TODO: 実装する
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-primary mb-4">個人マッチング</h1>
      <p className="text-gray-400">TODO: メンバー2が実装する</p>
      {/* <SwipeCard user={...} onSwipeRight={...} onSwipeLeft={...} /> */}
    </div>
  );
}
