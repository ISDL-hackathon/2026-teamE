// ============================================================
// 担当: メンバー3（ランダムマッチング・通知）
// 責務: ランダムマッチング導入画面。
//        「その週に話しかける対象の学部4年生は・・・」という文言と
//        「結果を見る」ボタンを表示する。
// 実装内容:
//   - 「結果を見る」ボタン → navigate("/random/result")
//   - （任意）表示時に api("GET", "/random/current") を先に叩いて
//     404 なら「今週の割り当てはまだありません」を表示してもよい
// 使うもの: useNavigate (react-router-dom)
// ============================================================
import { useNavigate } from "react-router-dom";
export default function RandomIntro() {
  // TODO: 実装する
  const navigate = useNavigate();

  return (
<div className="min-h-[calc(100dvh-4rem)] px-6 py-10">
  <div className="mx-auto max-w-3xl">
    <h1 className="mb-12 bg-gradient-to-r from-blue-400 via-indigo-400 to-fuchsia-400 bg-clip-text text-center text-5xl font-extrabold text-transparent">
      ランダムマッチング
    </h1>

    <div className="rounded-3xl border border-slate-700 bg-slate-900/40 p-10 text-center shadow-xl">
      <p className="mb-10 text-2xl text-slate-200">
        今週話しかける学部4年生は・・・
      </p>

      <button
        onClick={() => navigate("/random/result")}
        className="rounded-2xl bg-gradient-to-r from-blue-500 via-indigo-500 to-fuchsia-500 px-10 py-4 text-xl font-bold text-white"
      >
        結果を見る
      </button>
    </div>
  </div>
</div>
  );
}
