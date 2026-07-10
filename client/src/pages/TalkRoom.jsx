// ============================================================
// 担当: メンバー4（チャット）
// 責務: 個別トークルーム。メッセージの表示と送信。
// 実装内容:
//   - const { matchId } = useParams() でマッチIDを取得
//   - 表示時: await api("GET", `/matches/${matchId}/messages`)
//       → { messages: [{ id, sender_id, body, sent_at }] }（古い順）
//   - 自分のメッセージは右、相手は左に吹き出し表示
//     （自分の id は getSessionUser().id で取れる）
//   - 送信フォーム: api("POST", `/matches/${matchId}/messages`, { body })
//       → 成功したら一覧に追加して入力欄をクリア
//   - リアルタイム反映（余裕があれば）:
//       supabase.channel(...) で messages テーブルの INSERT を購読し、
//       match_id が一致する新着を一覧に追加する
// 使うもの: api, getSessionUser (../lib/api.js), useParams
//           supabase クライアント（Realtime を使う場合のみ、
//           @supabase/supabase-js を VITE_SUPABASE_URL/ANON_KEY で初期化）
// ============================================================

export default function TalkRoom() {
  // TODO: 実装する
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-primary mb-4">トークルーム</h1>
      <p className="text-gray-400">TODO: メンバー4が実装する</p>
    </div>
  );
}
