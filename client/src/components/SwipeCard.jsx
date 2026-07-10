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

export default function SwipeCard({ user, onSwipeRight, onSwipeLeft }) {
  // TODO: 実装する
  return (
    <div className="rounded-2xl shadow-lg bg-white p-6">
      <p className="text-gray-400">TODO: メンバー2が実装する（SwipeCard）</p>
      {/* user.name / user.role / user.bio を表示する */}
    </div>
  );
}
