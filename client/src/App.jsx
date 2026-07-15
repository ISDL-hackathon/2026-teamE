// ============================================================
// 担当: 共通部（完成済み・編集禁止）
// 責務: アプリ全体の画面遷移（ルーティング）。
//        ここを読めば全画面と担当ページの対応が分かる。
//
// 画面遷移:
//   /login          ログイン（メンバー1）
//   /signup         新規登録（メンバー1）
//   /               トップ: role で分岐
//                     B4        → /swipe へ（B4トップ=スワイプ画面）
//                     M1/M2/FACULTY → TopSenior（共通部・完成済み）
//   /swipe          個人マッチング スワイプ画面（メンバー2）
//   /random         ランダム: 導入画面（メンバー3）
//   /random/result  ランダム: 結果画面（メンバー3）
//   /profile        プロフィール（メンバー1）
//   /notifications  通知・履歴（メンバー3）
//   /chats          チャット一覧（メンバー4）
//   /chats/:matchId トークルーム（メンバー4）
// ============================================================
import { useEffect, useState } from "react";
import { Routes, Route, Navigate, Link, useLocation, useNavigate } from "react-router-dom";
import { api, getSessionUser } from "./lib/api.js";
import { ArrowLeft, Bell, House } from "./components/Icons.jsx";

import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import TopSenior from "./pages/TopSenior.jsx";
import SwipeScreen from "./pages/SwipeScreen.jsx";
import RandomIntro from "./pages/RandomIntro.jsx";
import RandomResult from "./pages/RandomResult.jsx";
import Profile from "./pages/Profile.jsx";
import Notifications from "./pages/Notifications.jsx";
import ChatList from "./pages/ChatList.jsx";
import TalkRoom from "./pages/TalkRoom.jsx";

/** 未ログインなら /login へ飛ばすガード（完成済み） */
function RequireLogin({ children }) {
  const user = getSessionUser();
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

/** B4 はランダムマッチングを利用しない */
function RequireRandomAccess({ children }) {
  const user = getSessionUser();

  if (user?.role === "B4") {
    return <Navigate to="/swipe" replace />;
  }

  return children;
}

/** トップ: role で分岐（完成済み） */
function Top() {
  const user = getSessionUser();
  if (user?.role === "B4") return <Navigate to="/swipe" replace />;
  return <TopSenior />;
}

/** 画面下部の共通ナビゲーション（完成済み） */
function BottomNav() {
  const { pathname } = useLocation();
const navigate = useNavigate();
const user = getSessionUser();
const userId = user?.id;
const [unreadCount, setUnreadCount] = useState(0);

useEffect(() => {
  if (!userId) {
    setUnreadCount(0);
    return;
  }

  let cancelled = false;

  async function loadUnreadCount() {
    try {
      const data = await api("GET", "/notifications");
      const count = (data.notifications ?? []).filter(
        (notification) => !notification.is_read
      ).length;

      if (!cancelled) {
        setUnreadCount(count);
      }
    } catch (error) {
      if (!cancelled) {
        console.error("未読通知数の取得に失敗しました", error);
      }
    }
  }

  function refreshUnreadCount() {
    void loadUnreadCount();
  }

  void loadUnreadCount();
  window.addEventListener("notifications:changed", refreshUnreadCount);
  window.addEventListener("focus", refreshUnreadCount);

  const intervalId = window.setInterval(refreshUnreadCount, 30_000);

  return () => {
    cancelled = true;
    window.removeEventListener("notifications:changed", refreshUnreadCount);
    window.removeEventListener("focus", refreshUnreadCount);
    window.clearInterval(intervalId);
  };
}, [userId]);

  if (!user || pathname === "/login" || pathname === "/signup") return null;

  const homeIsActive =
  pathname === "/" || (pathname === "/swipe" && user?.role === "B4");

const item =
  "flex flex-1 flex-col items-center justify-center gap-1 py-2 text-xs font-semibold transition-colors";
const active = "text-sky-400";
const inactive = "text-slate-300 hover:text-white";

return (
  <nav className="fixed bottom-0 left-1/2 z-30 flex min-h-[72px] w-full max-w-lg -translate-x-1/2 border-t border-slate-700 bg-slate-950/95 shadow-[0_-8px_24px_rgba(2,6,23,0.45)] backdrop-blur">
    <button
      type="button"
      onClick={() => navigate(-1)}
      className={`${item} ${inactive}`}
    >
      <ArrowLeft size={27} strokeWidth={2.25} aria-hidden="true" />
      <span>戻る</span>
    </button>

    <Link
      to="/"
      aria-current={homeIsActive ? "page" : undefined}
      className={`${item} ${homeIsActive ? active : inactive}`}
    >
      <House size={27} strokeWidth={2.25} aria-hidden="true" />
      <span>ホーム</span>
    </Link>

    <Link
      to="/notifications"
      aria-current={pathname === "/notifications" ? "page" : undefined}
      className={`${item} ${
        pathname === "/notifications" ? active : inactive
      }`}
    >
      <span className="relative inline-flex">
        <Bell size={27} strokeWidth={2.25} aria-hidden="true" />
        {unreadCount > 0 && (
          <span
            aria-label={`未読 ${unreadCount} 件`}
            className="absolute -right-3 -top-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] leading-5 text-white"
          >
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </span>
      <span>通知</span>
    </Link>
  </nav>
  );
}

export default function App() {
  return (
    <div className="max-w-md mx-auto min-h-[100dvh] pb-[72px]">
      <Routes>
        {/* 認証（トークン不要） */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* 以降は要ログイン */}
        <Route path="/" element={<RequireLogin><Top /></RequireLogin>} />
        <Route path="/swipe" element={<RequireLogin><SwipeScreen /></RequireLogin>} />
        <Route
  path="/random"
  element={
    <RequireLogin>
      <RequireRandomAccess>
        <RandomIntro />
      </RequireRandomAccess>
    </RequireLogin>
  }
/>

<Route
  path="/random/result"
  element={
    <RequireLogin>
      <RequireRandomAccess>
        <RandomResult />
      </RequireRandomAccess>
    </RequireLogin>
  }
/>
        <Route path="/profile" element={<RequireLogin><Profile /></RequireLogin>} />
        <Route path="/notifications" element={<RequireLogin><Notifications /></RequireLogin>} />
        <Route path="/chats" element={<RequireLogin><ChatList /></RequireLogin>} />
        <Route path="/chats/:matchId" element={<RequireLogin><TalkRoom /></RequireLogin>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <BottomNav />
    </div>
  );
}
