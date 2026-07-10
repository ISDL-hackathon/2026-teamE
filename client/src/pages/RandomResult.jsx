// ============================================================
// 担当: メンバー3（ランダムマッチング・通知）
// 責務: ランダムマッチング結果画面。今週話しかけるB4の名前を表示する。
// 実装内容:
//   - 表示時: await api("GET", "/random/current")
//       → { b4: { id, name, bio, avatar_url }, week_key, status }
//   - b4.name を大きく表示（bio やアバターも出すと良い）
//   - status が "ASSIGNED" のとき「話しました」ボタンを表示
//       → api("POST", "/random/current/done") → 表示を DONE に切り替え
//   - 404 のとき「今週の割り当てはまだありません」を表示
// 使うもの: api (../lib/api.js)
// ============================================================

export default function RandomResult() {
  // TODO: 実装する
  return (
    <div className="p-6 text-center">
      <h1 className="text-2xl font-bold text-primary mb-8">今週の相手</h1>
      <p className="text-gray-400">TODO: メンバー3が実装する（B4の名前を表示）</p>
    </div>
  );
}
