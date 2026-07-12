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
    <div className="relative w-full">
     <button
  type="button"
  onClick={onSwipeLeft}
  aria-label="保留にする"
  title="保留"
  className="absolute -left-7 top-1/2 z-10 flex h-40 w-11 -translate-y-1/2 shrink-0 items-center justify-center rounded-2xl border border-slate-300 bg-white px-1 text-xs font-bold text-slate-700 shadow [writing-mode:vertical-rl] [text-orientation:upright]"
>
  保留
</button>

      <article
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={resetDrag}
        style={{
          transform: `translateX(${dragX}px) rotate(${dragX / 25}deg)`,
          transition: isDragging ? "none" : "transform 180ms ease-out",
        }}
        className="mx-auto w-[calc(100%-7.5rem)] cursor-grab select-none touch-pan-y rounded-2xl bg-white p-6 text-slate-800 shadow-lg active:cursor-grabbing"
      >
        <div className="mb-5 flex items-center gap-4">
          {user.avatar_url ? (
            <img
              src={user.avatar_url}
              alt={`${user.name} のプロフィール画像`}
              className="h-16 w-16 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-white">
              {user.name?.slice(0, 1)}
            </div>
          )}

          <div>
            <h2 className="text-xl font-bold">{user.name}</h2>
            <p className="text-sm text-slate-500">{user.role}</p>
          </div>
        </div>

        <p className="min-h-24 whitespace-pre-wrap text-slate-700">
          {user.bio || "自己紹介はまだありません。"}
        </p>
      </article>

      <button
  type="button"
  onClick={onSwipeRight}
  aria-label="いいねする"
  title="いいね"
 className="absolute -right-7 top-1/2 z-10 flex h-40 w-11 -translate-y-1/2 shrink-0 items-center justify-center rounded-2xl bg-pink-500 px-1 text-xs font-bold text-white shadow [writing-mode:vertical-rl] [text-orientation:upright]"
>
  いいね
</button>
    </div>
  );
}
