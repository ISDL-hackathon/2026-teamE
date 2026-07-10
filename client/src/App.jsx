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
//   /notifications  履歴・通知（メンバー3）
//   /chats          チャット一覧（メンバー4）
//   /chats/:matchId トークルーム（メンバー4）
// ============================================================
import { Routes, Route, Navigate, Link, useLocation } from "react-router-dom";
import { getSessionUser } from "./lib/api.js";

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

/** トップ: role で分岐（完成済み） */
function Top() {
  const user = getSessionUser();
  if (user?.role === "B4") return <Navigate to="/swipe" replace />;
  return <TopSenior />;
}

/** 画面下部の共通ナビゲーション（完成済み） */
function BottomNav() {
  const { pathname } = useLocation();
  const user = getSessionUser();
  if (!user || pathname === "/login" || pathname === "/signup") return null;
  const item = "flex-1 py-3 text-center text-sm";
  const active = "text-primary font-bold";
  return (
    <nav className="fixed bottom-0 inset-x-0 bg-white border-t flex">
      <Link to="/" className={`${item} ${pathname === "/" || pathname === "/swipe" ? active : ""}`}>ホーム</Link>
      <Link to="/chats" className={`${item} ${pathname.startsWith("/chats") ? active : ""}`}>チャット</Link>
      <Link to="/notifications" className={`${item} ${pathname === "/notifications" ? active : ""}`}>通知</Link>
      <Link to="/profile" className={`${item} ${pathname === "/profile" ? active : ""}`}>プロフィール</Link>
    </nav>
  );
}

export default function App() {
  return (
    <div className="max-w-md mx-auto min-h-screen pb-16">
      <Routes>
        {/* 認証（トークン不要） */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* 以降は要ログイン */}
        <Route path="/" element={<RequireLogin><Top /></RequireLogin>} />
        <Route path="/swipe" element={<RequireLogin><SwipeScreen /></RequireLogin>} />
        <Route path="/random" element={<RequireLogin><RandomIntro /></RequireLogin>} />
        <Route path="/random/result" element={<RequireLogin><RandomResult /></RequireLogin>} />
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
