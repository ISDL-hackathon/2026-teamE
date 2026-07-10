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

export default function RandomIntro() {
  // TODO: 実装する
  return (
    <div className="p-6 text-center">
      <h1 className="text-2xl font-bold text-primary mb-8">ランダムマッチング</h1>
      <p className="text-lg mb-8">その週に話しかける対象の学部4年生は・・・</p>
      <p className="text-gray-400">TODO: メンバー3が実装する（結果を見るボタン）</p>
    </div>
  );
}
