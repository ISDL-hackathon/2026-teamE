// ============================================================
// 担当: メンバー2（個人マッチング）
// 責務: スワイプ可能なプロフィールカード1枚分のコンポーネント。
// props（この形は変更しない）:
//   - user: { id, name, role, bio, avatar_url }  表示する相手
//   - onSwipeRight: () => void   右スワイプ（いいね）時に呼ぶ
//   - onSwipeLeft:  () => void   左スワイプ（保留）時に呼ぶ
// 実装内容:
//   - タッチ/マウスのドラッグでカードを左右に動かし、
//     しきい値を超えたら onSwipeRight / onSwipeLeft を呼ぶ
//   - ドラッグが難しければ、まずは「いいね」「保留」ボタンでも可
//     （ボタン実装でも同じ props を呼べば SwipeScreen 側は動く）
// ============================================================

import { useRef, useState } from "react";

const SWIPE_THRESHOLD = 80;

export default function SwipeCard({ user, onSwipeRight, onSwipeLeft }) {
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startX = useRef(null);

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
      onSwipeRight(); // 右へドラッグ: いいね
      return;
    }

    if (movedX <= -SWIPE_THRESHOLD) {
      onSwipeLeft(); // 左へドラッグ: 保留
      return;
    }

    setDragX(0);
  }

  return (
  <div className="w-full">
    <article
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={resetDrag}
      style={{
        transform: `translateX(${dragX}px) rotate(${dragX / 25}deg)`,
        transition: isDragging ? "none" : "transform 180ms ease-out",
      }}
      className="relative mx-auto max-h-[390px] w-full cursor-grab select-none touch-pan-y overflow-x-hidden overflow-y-auto overscroll-contain [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden rounded-3xl border border-slate-700 bg-slate-950/80 p-6 text-slate-100 shadow-2xl shadow-indigo-950/50 ring-1 ring-fuchsia-400/40 before:absolute before:inset-x-0 before:top-0 before:h-1 before:bg-gradient-to-r before:from-sky-400 before:via-violet-500 before:to-pink-500 active:cursor-grabbing"
    >
     <div className="mb-6 flex items-center gap-4">
        {user.avatar_url ? (
  <img
    src={user.avatar_url}
    alt={`${user.name} のプロフィール画像`}
    className="h-20 w-20 rounded-full border-2 border-violet-300/70 object-cover shadow-lg shadow-violet-950/60"
  />
) : (
  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-fuchsia-400 via-violet-500 to-indigo-500 text-3xl font-bold text-white shadow-lg shadow-violet-950/60">
  {user.name?.slice(0, 1)}
</div>
)}

        <div>
  <h2 className="text-2xl font-bold text-white">{user.name}</h2>
  <p className="mt-1 text-sm font-semibold uppercase tracking-widest text-slate-400">
    {user.role}
  </p>
</div>
      </div>

      <div className="border-t border-slate-700 pt-4">
  <p className="mb-2 text-sm font-semibold tracking-wide text-sky-300">
    自己紹介
  </p>
  <p className="min-h-[4.0rem] whitespace-pre-wrap break-words leading-6 text-slate-200">
    {user.bio || "自己紹介はまだありません。"}
  </p>
</div>
    </article>
  </div>
);
}
