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
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/api.js";

export default function Notifications() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    loadNotifications();
  }, []);

  async function loadNotifications() {
    try {
      const data = await api("GET", "/notifications");
      setNotifications(data.notifications);
    } catch (err) {
      console.error(err);
    }
  }

  async function markRead(id) {
  const data = await api("PUT", `/notifications/${id}/read`);

  setNotifications((prev) =>
    prev.map((notification) =>
      notification.id === id
        ? { ...notification, is_read: true }
        : notification
    )
  );

  window.dispatchEvent(new Event("notifications:changed"));

  return data.notification;
}

async function handleNotificationClick(notification) {
  try {
    if (!notification.is_read) {
      await markRead(notification.id);
    }
  } catch (error) {
    console.error(error);
  }

  if (notification.type === "LIKE") {
    const path = notification.actor_user_id
      ? `/swipe?from=${encodeURIComponent(notification.actor_user_id)}`
      : "/swipe";

    navigate(path);
    return;
  }

  if (
    (notification.type === "MATCH" ||
      notification.type === "MESSAGE") &&
    notification.match_id
  ) {
    navigate(`/chats/${notification.match_id}`);
  }
}

  function getIcon(type) {
    switch (type) {
      case "MATCH":
        return "💖";
      case "RANDOM":
        return "🎲";
      case "SYSTEM":
        return "📢";
      case "LIKE":
        return "👍";
      case "MESSAGE":
        return "💬";
      default:
        return "📄";
    }
  }

  return (
    <div className="min-h-[calc(100dvh-4rem)] px-6 py-10">
      <div className="mx-auto max-w-3xl">

        <h1 className="mb-10 bg-gradient-to-r from-blue-400 via-indigo-400 to-fuchsia-400 bg-clip-text text-center text-5xl font-extrabold text-transparent">
  通知・履歴
</h1>

        {notifications.length === 0 ? (
          <div className="rounded-3xl border border-slate-700 bg-slate-900/40 p-8 text-center text-slate-400">
            通知はありません。
          </div>
        ) : (
          <div className="space-y-5">
            {notifications.map((notification) => (
  <button
    key={notification.id}
    type="button"
    onClick={() => handleNotificationClick(notification)}
    className={`w-full cursor-pointer rounded-2xl border p-5 text-left transition ${
      notification.is_read
        ? "border-slate-700 bg-slate-900/40"
        : "border-indigo-400 bg-indigo-950/40 shadow-lg"
    }`}
  >
    <div className="flex items-center justify-between">
      <span className="text-lg font-bold text-white">
        {getIcon(notification.type)} {notification.type}
      </span>

      {!notification.is_read && (
        <span className="font-bold text-pink-400">
          未読
        </span>
      )}
    </div>

    <p className="mt-3 text-slate-200">
      {notification.message}
    </p>

    <p className="mt-3 text-sm text-slate-400">
      {new Date(notification.created_at).toLocaleString()}
    </p>
  </button>
))}
          </div>
        )}

      </div>
    </div>
  );
}