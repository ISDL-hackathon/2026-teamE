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

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api, getSessionUser } from "../lib/api.js";

export default function TalkRoom() {
  const { matchId } = useParams();
  const currentUser = getSessionUser();

  const [messages, setMessages] = useState([]);
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadMessages() {
      try {
        const data = await api(
          "GET",
          `/matches/${matchId}/messages`
        );

        if (!cancelled) {
          setMessages(data.messages ?? []);
        }
      } catch (error) {
        if (!cancelled) {
          setErrorMessage(
            error.message || "メッセージの取得に失敗しました"
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadMessages();

    return () => {
      cancelled = true;
    };
  }, [matchId]);

  async function handleSubmit(event) {
    event.preventDefault();

    const trimmedBody = body.trim();
    if (!trimmedBody || isSending) return;

    setIsSending(true);
    setErrorMessage("");

    try {
      const data = await api(
        "POST",
        `/matches/${matchId}/messages`,
        { body: trimmedBody }
      );

      setMessages((previous) => [...previous, data.message]);
      setBody("");
    } catch (error) {
      setErrorMessage(
        error.message || "メッセージの送信に失敗しました"
      );
    } finally {
      setIsSending(false);
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col p-6">
      <h1 className="mb-4 text-2xl font-bold text-primary">
        トークルーム
      </h1>

      {errorMessage && (
        <p className="mb-4 rounded-xl bg-red-500/20 px-4 py-3 text-sm text-red-200">
          {errorMessage}
        </p>
      )}

      <div className="flex-1 space-y-3">
        {loading ? (
          <p className="text-slate-300">読み込んでいます...</p>
        ) : messages.length === 0 ? (
          <p className="text-slate-300">
            まだメッセージはありません。最初のメッセージを送ってみましょう。
          </p>
        ) : (
          messages.map((message) => {
            const isMine = message.sender_id === currentUser?.id;

            return (
              <div
                key={message.id}
                className={`flex ${
                  isMine ? "justify-end" : "justify-start"
                }`}
              >
               <div
                  className={`max-w-[75%] rounded-2xl px-4 py-3 whitespace-pre-wrap ${
                    isMine
                      ? "bg-primary text-white"
                      : "bg-white text-slate-800"
                  }`}
                >
                  {message.body}
                </div>
              </div>
            );
          })
        )}
      </div>

      <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
        <input
          value={body}
          onChange={(event) => setBody(event.target.value)}
          placeholder="メッセージを入力"
          disabled={isSending}
          className="min-w-0 flex-1 rounded-xl border border-slate-500 bg-white px-4 py-3 text-slate-800 outline-none"
        />
        <button
          type="submit"
          disabled={isSending || !body.trim()}
          className="rounded-xl bg-primary px-5 py-3 font-bold text-white disabled:opacity-50"
        >
          送信
        </button>
      </form>
    </div>
  );
}
