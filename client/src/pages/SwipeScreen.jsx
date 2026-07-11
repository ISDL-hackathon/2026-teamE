// ============================================================
// 担当: メンバー2（個人マッチング）
// 責務: 個人マッチングのスワイプ画面（B4のトップページを兼ねる）。
// 実装内容:
//   - 初期表示:
//       await api("GET", "/matching/candidates") → 候補配列
//       await api("GET", "/matching/quota")      → { limit, used, remaining }
//   - 候補を1枚ずつ SwipeCard で表示
//       右スワイプ → api("POST", "/matching/likes", { to_user_id, action: "LIKE" })
//       左スワイプ → api("POST", "/matching/likes", { to_user_id, action: "HOLD" })
//   - レスポンスの likes_remaining で残数表示を更新
//   - matched: true が返ったら「マッチしました！」の演出を出す
//   - 429 が返ったら「今週のいいねは上限（3人）です」を表示しスワイプ無効化
// 使うもの: api (../lib/api.js), SwipeCard (../components/SwipeCard.jsx)
// ============================================================

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/api.js";
import SwipeCard from "../components/SwipeCard.jsx";

export default function SwipeScreen() {
  const navigate = useNavigate();
  const [candidates, setCandidates] = useState([]);
  const [remaining, setRemaining] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [quotaReached, setQuotaReached] = useState(false);
  const [matched, setMatched] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const [candidateData, quotaData] = await Promise.all([
          api("GET", "/matching/candidates"),
          api("GET", "/matching/quota"),
        ]);

        if (cancelled) return;

        setCandidates(candidateData.candidates ?? []);
        setRemaining(quotaData.remaining);
        setQuotaReached(quotaData.remaining === 0);
      } catch (error) {
        if (!cancelled) {
          setErrorMessage(
            error.message || "候補の取得に失敗しました"
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  async function handleAction(action) {
    const candidate = candidates[0];

    if (!candidate || isSending || quotaReached) return;

    setIsSending(true);
    setMatched(false);
    setErrorMessage("");

    try {
      const data = await api("POST", "/matching/likes", {
        to_user_id: candidate.id,
        action,
      });

      setCandidates((previous) =>
  action === "HOLD"
    ? [...previous.slice(1), candidate]
    : previous.slice(1)
);
      setRemaining(data.likes_remaining);
      setQuotaReached(data.likes_remaining === 0);

      if (data.matched) {
        setMatched(true);
      }
    } catch (error) {
      if (error.status === 429) {
        setQuotaReached(true);
        setRemaining(0);
        setErrorMessage("今週のいいねは上限（3人）です");
      } else {
        setErrorMessage(
          error.message || "送信に失敗しました"
        );
      }
    } finally {
      setIsSending(false);
    }
  }

  const candidate = candidates[0];

  return (
  <div className="relative flex min-h-[calc(100vh-4rem)] flex-col px-6 pb-24 pt-6">
    <header className="flex items-start justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold text-primary">
          個人マッチング
        </h1>

        {remaining !== null && (
          <p className="mt-1 text-sm text-slate-300">
            残り {remaining} 回
          </p>
        )}
      </div>

      <button
        type="button"
        onClick={() => navigate("/profile")}
        className="shrink-0 rounded-xl border border-slate-400 px-3 py-2 text-sm font-bold text-white"
      >
        プロフィールを編集
      </button>
    </header>

    <div className="mt-4 space-y-3">
      {matched && (
        <p className="rounded-xl bg-pink-500/20 px-4 py-3 text-center font-bold text-pink-200">
          マッチしました！
        </p>
      )}

      {errorMessage && (
        <p className="rounded-xl bg-red-500/20 px-4 py-3 text-sm text-red-200">
          {errorMessage}
        </p>
      )}
    </div>

    <main className="flex flex-1 items-center justify-center py-4">
      {loading ? (
        <p className="text-slate-300">候補を読み込んでいます...</p>
      ) : quotaReached ? (
        <p className="w-full max-w-sm rounded-xl border border-slate-600 p-4 text-slate-300">
          今週のいいねは上限です。来週また利用できます。
        </p>
      ) : isSending ? (
        <p className="text-slate-300">送信しています...</p>
      ) : candidate ? (
        <div className="w-full max-w-sm">
          <SwipeCard
            user={candidate}
            onSwipeRight={() => handleAction("LIKE")}
            onSwipeLeft={() => handleAction("HOLD")}
          />
        </div>
      ) : (
        <p className="w-full max-w-sm rounded-xl border border-slate-600 p-4 text-slate-300">
          表示できる候補はいません。
        </p>
      )}
    </main>

    <button
      type="button"
      onClick={() => navigate("/chats")}
      className="fixed bottom-20 left-1/2 z-10 w-[calc(100%-3rem)] max-w-sm -translate-x-1/2 rounded-xl bg-primary px-4 py-3 font-bold text-white shadow-lg"
    >
      チャット一覧へ
    </button>
  </div>
  );
}
