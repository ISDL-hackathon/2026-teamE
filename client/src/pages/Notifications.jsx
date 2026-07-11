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
import { api } from "../lib/api";

export default function Notifications() {
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
    try {
      await api("PUT", `/notifications/${id}/read`);

      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === id
            ? { ...notification, is_read: true }
            : notification
        )
      );
    } catch (err) {
      console.error(err);
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
      default:
        return "📄";
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-primary mb-6">
        履歴・通知
      </h1>

      {notifications.length === 0 ? (
        <p>通知はありません。</p>
      ) : (
        <div className="space-y-3">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              onClick={() => {
                if (!notification.is_read) {
                  markRead(notification.id);
                }
              }}
              className={`border rounded-lg p-4 cursor-pointer ${
                notification.is_read
                  ? "bg-white"
                  : "bg-yellow-100 font-bold"
              }`}
            >
              <div className="flex justify-between">
                <span>
                  {getIcon(notification.type)} {notification.type}
                </span>

                {!notification.is_read && (
                  <span className="text-red-500">未読</span>
                )}
              </div>

              <p className="mt-2">
                {notification.message}
              </p>

              <p className="text-sm text-gray-500 mt-2">
                {new Date(notification.created_at).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
