// ============================================================
// 担当: メンバー4（チャット）
// 責務: チャット一覧画面（マッチした相手のみ表示）。
// 実装内容:
//   - 表示時: await api("GET", "/matches")
//       → { matches: [{ id, partner: { name, role, avatar_url },
//                        matched_at, last_message? }] }
//   - 各行に相手の名前と最新メッセージを表示
//   - 行をタップ → navigate(`/chats/${match.id}`) でトークルームへ
//   - マッチが0件なら「まだマッチした相手がいません」を表示
// 使うもの: api (../lib/api.js), useNavigate
// ============================================================

export default function ChatList() {
  // TODO: 実装する
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-primary mb-4">チャット</h1>
      <p className="text-gray-400">TODO: メンバー4が実装する</p>
    </div>
  );
}
