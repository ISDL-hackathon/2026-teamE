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
import { Send } from "../components/Icons.jsx";
import { useParams } from "react-router-dom";
import { api, getSessionUser } from "../lib/api.js";

function formatSentAt(sentAt) {
  const date = new Date(sentAt);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat("ja-JP", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

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

  async function markMessageNotificationsAsRead() {
    try {
      const data = await api("GET", "/notifications");

      const unreadMessageNotifications = (data.notifications ?? []).filter(
        (notification) =>
          notification.type === "MESSAGE" &&
          notification.match_id === matchId &&
          !notification.is_read
      );

      if (unreadMessageNotifications.length === 0) return;

      await Promise.all(
        unreadMessageNotifications.map((notification) =>
          api("PUT", `/notifications/${notification.id}/read`)
        )
      );

      if (!cancelled) {
        window.dispatchEvent(new Event("notifications:changed"));
      }
    } catch (error) {
      console.error("メッセージ通知の既読化に失敗しました", error);
    }
  }

  async function loadMessages() {
    try {
      const data = await api("GET", `/matches/${matchId}/messages`);

      if (cancelled) return;

      setMessages(data.messages ?? []);
      await markMessageNotificationsAsRead();
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

  void loadMessages();

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
      <h1 className="mb-4 bg-gradient-to-r from-blue-400 via-indigo-400 to-fuchsia-400 bg-clip-text text-2xl font-bold text-transparent">
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
  className={`flex items-end gap-2 ${
    isMine ? "justify-end" : "justify-start"
  }`}
>
  {isMine && (
    <time
      dateTime={message.sent_at}
      className="shrink-0 text-xs text-slate-400"
    >
      {formatSentAt(message.sent_at)}
    </time>
  )}

  <div className="max-w-[75%] whitespace-pre-wrap rounded-2xl border border-slate-700 bg-slate-900/80 px-4 py-3 text-white">
  <p>{message.body}</p>
</div>

  {!isMine && (
    <time
      dateTime={message.sent_at}
      className="shrink-0 text-xs text-slate-400"
    >
      {formatSentAt(message.sent_at)}
    </time>
  )}
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
          className="min-w-0 flex-1 rounded-full border border-slate-700 bg-slate-900/80 px-4 py-3 text-white placeholder:text-slate-400 outline-none focus:border-sky-400"
        />
        <button
  type="submit"
  disabled={isSending || !body.trim()}
  aria-label="送信"
  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-sky-400 via-indigo-500 to-violet-500 text-white shadow-lg shadow-indigo-950/60 transition hover:scale-105 disabled:opacity-50"
>
  <Send size={23} strokeWidth={2.4} aria-hidden="true" />
  <span className="sr-only">送信</span>
</button>
      </form>
    </div>
  );
}
