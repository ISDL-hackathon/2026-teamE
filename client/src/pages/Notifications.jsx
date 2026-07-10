// ============================================================
// 担当: メンバー3（ランダムマッチング・通知）
// 責務: 履歴・通知画面。
// 実装内容:
//   - 表示時: await api("GET", "/notifications") → { notifications: [...] }
//   - type ごとにアイコン/色を変えて一覧表示（MATCH / RANDOM / SYSTEM）
//   - 未読 (is_read: false) は強調表示し、タップで
//     api("PUT", `/notifications/${id}/read`) を呼んで既読化
// 使うもの: api (../lib/api.js)
// ============================================================

export default function Notifications() {
  // TODO: 実装する
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-primary mb-4">履歴・通知</h1>
      <p className="text-gray-400">TODO: メンバー3が実装する</p>
    </div>
  );
}
