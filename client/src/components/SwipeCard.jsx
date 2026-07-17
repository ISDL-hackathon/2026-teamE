// ============================================================
// 担当: メンバー2（個人マッチング）
// 責務: スワイプ可能なプロフィールカード1枚分のコンポーネント。
// props（この形は変更しない）:
//   - user: { id, name, role, bio, avatar_url }  表示する相手
//   - onSwipeRight: () => void   右スワイプ（いいね）時に呼ぶ
//   - onSwipeLeft:  () => void   左スワイプ（保留）時に呼ぶ
// ============================================================

import { useRef, useState } from "react";

const SWIPE_THRESHOLD = 80;

export default function SwipeCard({ user, onSwipeRight, onSwipeLeft }) {
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [failedAvatarUrl, setFailedAvatarUrl] = useState(null);
  const startX = useRef(null);
  const hasAvatar =
    Boolean(user.avatar_url) && failedAvatarUrl !== user.avatar_url;

  function resetDrag() {
    startX.current = null;
    setIsDragging(false);
    setDragX(0);
  }

  function handlePointerDown(event) {
    if (event.pointerType === "mouse" && event.button !== 0) return;

    startX.current = event.clientX;
    setIsDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function handlePointerMove(event) {
    if (startX.current === null) return;

    setDragX(event.clientX - startX.current);
  }

  function handlePointerUp(event) {
    if (startX.current === null) return;

    const movedX = event.clientX - startX.current;
    startX.current = null;
    setIsDragging(false);

    if (movedX >= SWIPE_THRESHOLD) {
      setDragX(0);
      onSwipeRight();
      return;
    }

    if (movedX <= -SWIPE_THRESHOLD) {
      setDragX(0);
      onSwipeLeft();
      return;
    }

    setDragX(0);
  }

  return (
    <article
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={resetDrag}
      style={{
        transform: `translateX(${dragX}px) rotate(${dragX / 25}deg)`,
        transition: isDragging ? "none" : "transform 180ms ease-out",
        position: "relative",
        overflow: "hidden",
      }}
      className={`relative isolate mx-auto w-full cursor-grab touch-pan-y select-none overflow-hidden active:cursor-grabbing ${
        hasAvatar
          ? "rounded-[2rem] border border-slate-200 bg-white shadow-[0_18px_48px_rgba(15,23,42,0.3)]"
          : "rounded-3xl border border-slate-700 bg-slate-950/80 p-6 text-slate-100 shadow-2xl shadow-indigo-950/50 ring-1 ring-fuchsia-400/40"
      }`}
      aria-label={`${user.name}さんのプロフィール`}
    >
      {hasAvatar ? (
        <>
          <div className="relative w-full bg-white">
            <img
              src={user.avatar_url}
              alt={`${user.name} のプロフィール画像`}
              draggable="false"
              onError={() => setFailedAvatarUrl(user.avatar_url)}
              className="block h-auto w-full"
              style={{
                width: "100%",
                height: "auto",
                maxWidth: "100%",
              }}
            />

          </div>

          <div className="bg-white px-5 py-4 text-slate-500">
            <p className="text-sm font-semibold">自己紹介</p>
            <p className="mt-1 whitespace-pre-wrap break-words text-sm leading-6">
              {user.bio || "自己紹介はまだありません。"}
            </p>
          </div>
        </>
      ) : (
        <div>
          <h2 className="text-2xl font-bold text-white">{user.name}</h2>
          <p className="mt-1 text-sm font-semibold uppercase tracking-widest text-slate-400">
            {user.role || "メンバー"}
          </p>

          <div className="mt-6 border-t border-slate-700 pt-4">
            <p className="mb-2 text-sm font-semibold tracking-wide text-sky-300">
              自己紹介
            </p>
            <p className="min-h-16 whitespace-pre-wrap break-words leading-6 text-slate-200">
              {user.bio || "自己紹介はまだありません。"}
            </p>
          </div>
        </div>
      )}

    </article>
  );
}
