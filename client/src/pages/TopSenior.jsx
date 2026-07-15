// ============================================================
// 担当: 共通部（完成済み・編集禁止）
// 責務: 院生・先生用トップページ。
//        「個人マッチング」→ /swipe、「ランダムマッチング」→ /random
// ============================================================
import { Link } from "react-router-dom";
import { getSessionUser } from "../lib/api.js";

export default function TopSenior() {
  const user = getSessionUser();

  return (
    <div className="relative min-h-[calc(100vh-4rem)] overflow-hidden px-4 pb-48 pt-8">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-8 h-64 w-64 rounded-full bg-sky-500/10 blur-3xl" />
        <div className="absolute -right-24 top-72 h-72 w-72 rounded-full bg-fuchsia-500/10 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-md">
        <header className="-mb-4 text-center">
  <h1 className="mb-12 bg-gradient-to-r from-blue-400 via-indigo-400 to-fuchsia-400 bg-clip-text text-center text-5xl font-extrabold text-transparent">
    ISDLove
  </h1>

  <p className="-translate-y-9 text-center text-lg text-gray-600">
    こんにちは、{user?.name} さん
  </p>
</header>

       <section className="space-y-3">
  <Link
    to="/swipe"
    className="group relative flex min-h-[90px] items-center gap-5 overflow-hidden rounded-xl border border-indigo-400/90 bg-slate-950 px-5 shadow-[0_12px_30px_rgba(2,6,23,0.55)] transition duration-200 hover:-translate-y-0.5 hover:border-indigo-300 before:absolute before:inset-y-0 before:left-0 before:w-2 before:bg-gradient-to-b before:from-blue-400 before:via-indigo-400 before:to-violet-400"
  >
    <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-indigo-300 bg-indigo-400/5 text-indigo-300">
  <svg
    viewBox="0 0 48 48"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-14 w-14 -translate-x-1.5 -translate-y-0.5 overflow-visible"
    aria-hidden="true"
  >
    <path d="m22.5 36-11-10.1a7.6 7.6 0 0 1-.2-10.9 7.6 7.6 0 0 1 10.7-.1l1.4 1.4 1.4-1.4a7.6 7.6 0 0 1 10.7.1 7.6 7.6 0 0 1-.2 10.9L24.3 36a1.3 1.3 0 0 1-1.8 0Z" />
    <path
  d="m33.1 42-10.4-9.5a7.2 7.2 0 0 1-.2-10.3 7.2 7.2 0 0 1 10.1-.1l1.2 1.2 1.2-1.2a7.2 7.2 0 0 1 10.1.1 7.2 7.2 0 0 1-.2 10.3L34.9 42a1.3 1.3 0 0 1-1.8 0Z"
  transform="translate(1.5 1.5)"
/>
  </svg>
</span>

    <span className="min-w-0 flex-1">
      <span className="block whitespace-nowrap text-[clamp(1.125rem,5vw,1.5rem)] font-bold leading-tight tracking-tight text-white">
        個人マッチング
      </span>
    </span>

    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-8 w-8 shrink-0 text-indigo-400 transition group-hover:translate-x-1"
      aria-hidden="true"
    >
      <path d="m9 6 6 6-6 6" />
    </svg>
  </Link>

  <Link
    to="/random"
    className="group relative flex min-h-[90px] items-center gap-5 overflow-hidden rounded-xl border border border-indigo-400/90 bg-slate-950 px-5 shadow-[0_12px_30px_rgba(2,6,23,0.55)] transition duration-200 hover:-translate-y-0.5 hover:border-indigo-300 before:absolute before:inset-y-0 before:left-0 before:w-2 before:bg-gradient-to-b before:from-blue-400 before:via-indigo-400 before:to-violet-400"
  >
    <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-indigo-300 bg-indigo-400/5 text-indigo-300">
  <svg
    viewBox="0 0 48 48"
    fill="none"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-14 w-14 translate-y-1"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="random-icon-gradient" x1="8" y1="6" x2="42" y2="42">
        <stop stopColor="#818cf8" />
<stop offset="1" stopColor="#a78bfa" />
      </linearGradient>
    </defs>

    <g stroke="url(#random-icon-gradient)">
  <path d="m24 7 14 8v17l-14 8-14-8V15l14-8Z" />
  <path d="m10 15 14 8 14-8M24 23v17" />

  {/* 上面：1 */}
  <circle cx="24" cy="15.5" r="1.15" fill="url(#random-icon-gradient)" stroke="none" />

  {/* 左面：2 */}
  <circle cx="15" cy="25" r="1.15" fill="url(#random-icon-gradient)" stroke="none" />
  <circle cx="18" cy="31" r="1.15" fill="url(#random-icon-gradient)" stroke="none" />

  {/* 右面：3 */}
  <circle cx="33" cy="23" r="1.15" fill="url(#random-icon-gradient)" stroke="none" />
  <circle cx="31" cy="27.5" r="1.15" fill="url(#random-icon-gradient)" stroke="none" />
  <circle cx="29" cy="32" r="1.15" fill="url(#random-icon-gradient)" stroke="none" />

  <path
  d="M39 3 40.1 6.4 43.5 7.5 40.1 8.6 39 12 37.9 8.6 34.5 7.5 37.9 6.4 39 3Z"
  strokeWidth="1.15"
  strokeLinejoin="miter"
  transform="translate(-1 0)"
/>
<path
  d="M41 17.5 41.8 20.1 44.5 21 41.8 21.9 41 24.5 40.2 21.9 37.5 21 40.2 20.1 41 17.5Z"
  strokeWidth="1.15"
  strokeLinejoin="miter"
  transform="translate(2.7 0)"
/>
</g>
  </svg>
</span>

    <span className="min-w-0 flex-1">
      <span className="block whitespace-nowrap text-[clamp(1.125rem,5vw,1.5rem)] font-bold leading-tight tracking-tight text-white">
        ランダムマッチング
      </span>
    </span>

    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-8 w-8 shrink-0 text-indigo-400 transition group-hover:translate-x-1"
      aria-hidden="true"
    >
      <path d="m9 6 6 6-6 6" />
    </svg>
  </Link>
</section>

<section className="relative mt-3 h-[clamp(16rem,36vh,20rem)] overflow-hidden">
  <svg
  viewBox="0 0 480 300"
  preserveAspectRatio="xMidYMid meet"
  className="absolute inset-0 h-full w-full origin-top scale-[0.75] opacity-100"
  fill="none"
  aria-hidden="true"
>
  <defs>
  <radialGradient id="node-cyan">
  <stop offset="0" stopColor="#ffffff" />
  <stop offset="0.2" stopColor="#e0f2fe" />
  <stop offset="0.55" stopColor="#7dd3fc" />
  <stop offset="1" stopColor="#0ea5e9" />
</radialGradient>

<radialGradient id="node-pink">
  <stop offset="0" stopColor="#ffffff" />
  <stop offset="0.2" stopColor="#fdf2f8" />
  <stop offset="0.55" stopColor="#f9a8d4" />
  <stop offset="1" stopColor="#ec4899" />
</radialGradient>

<filter
  id="node-glow"
  x="-100%"
  y="-100%"
  width="300%"
  height="300%"
  colorInterpolationFilters="sRGB"
>
  <feGaussianBlur in="SourceGraphic" stdDeviation="1.8" result="wideGlow" />
  <feGaussianBlur in="SourceGraphic" stdDeviation="0.55" result="nearGlow" />
  <feMerge>
    <feMergeNode in="wideGlow" />
    <feMergeNode in="nearGlow" />
    <feMergeNode in="SourceGraphic" />
  </feMerge>
</filter>
</defs>

  <g
  stroke="#ffffff"
  strokeWidth="0.7"
  opacity="0.52"
  strokeLinecap="round"
  strokeLinejoin="round"
>
  <path d="M12 54 62 24 116 48 166 20 222 56 274 30 330 58 386 24 438 50 472 30" />
  <path d="M12 54 42 108 96 84 116 48 166 106 222 56 260 118 330 58 366 110 438 50 472 96" />
  <path d="M42 108 78 166 138 126 166 106 214 174 260 118 314 158 366 110 402 176 452 132 472 96" />
  <path d="M78 166 126 228 214 174 250 228 314 158 356 240 402 176 452 132" />
  <path d="M126 228 180 278 250 228 300 282 356 240 420 272" />

  <path d="M96 84 138 126 194 92 260 118 314 158" />
  <path d="M138 126 214 174 250 228" />
  <path d="M222 56 274 96 330 58" />
  <path d="M366 110 410 78 438 50" />

  <path d="M42 108 18 154 78 166" />
  <path d="M78 166 38 210 126 228" />
  <path d="M214 174 180 220 250 228" />
  <path d="M314 158 342 196 356 240" />
  <path d="M402 176 448 224 420 272" />
  <path d="M250 228 278 256 300 282" />

  <path d="M116 48 140 76 166 106" />
  <path d="M222 56 240 88 260 118" />
  <path d="M330 58 350 84 366 110" />
  <path d="M438 50 454 72 472 96" />
  <path d="M38 210 18 270 126 228" />
</g>

  <g filter="url(#node-glow)">
  <circle cx="12" cy="54" r="1.3" fill="url(#node-cyan)" />
  <circle cx="62" cy="24" r="2.7" fill="url(#node-cyan)" />
  <circle cx="116" cy="48" r="1.3" fill="url(#node-pink)" />
  <circle cx="166" cy="20" r="1.6" fill="url(#node-pink)" />
  <circle cx="222" cy="56" r="1.6" fill="url(#node-cyan)" />
  <circle cx="274" cy="30" r="1.4" fill="url(#node-cyan)" />
  <circle cx="330" cy="58" r="1.7" fill="url(#node-cyan)" />
  <circle cx="386" cy="24" r="2.4" fill="url(#node-pink)" />
  <circle cx="438" cy="50" r="1.4" fill="url(#node-cyan)" />
  <circle cx="472" cy="30" r="2" fill="url(#node-pink)" />

  <circle cx="42" cy="108" r="1.4" fill="url(#node-cyan)" />
  <circle cx="96" cy="84" r="1.2" fill="url(#node-pink)" />
  <circle cx="140" cy="76" r="1" fill="url(#node-cyan)" />
  <circle cx="166" cy="106" r="2.5" fill="url(#node-pink)" />
  <circle cx="194" cy="92" r="1.1" fill="url(#node-cyan)" />
  <circle cx="240" cy="88" r="1.1" fill="url(#node-pink)" />
  <circle cx="260" cy="118" r="1.5" fill="url(#node-cyan)" />
  <circle cx="274" cy="96" r="1.1" fill="url(#node-pink)" />
  <circle cx="350" cy="84" r="1" fill="url(#node-cyan)" />
  <circle cx="366" cy="110" r="2.6" fill="url(#node-pink)" />
  <circle cx="410" cy="78" r="1.1" fill="url(#node-cyan)" />
  <circle cx="454" cy="72" r="1" fill="url(#node-pink)" />
  <circle cx="472" cy="96" r="1.5" fill="url(#node-cyan)" />

  <circle cx="18" cy="154" r="1.1" fill="url(#node-pink)" />
  <circle cx="78" cy="166" r="1.4" fill="url(#node-cyan)" />
  <circle cx="138" cy="126" r="1.1" fill="url(#node-pink)" />
  <circle cx="214" cy="174" r="2.5" fill="url(#node-pink)" />
  <circle cx="314" cy="158" r="1.5" fill="url(#node-cyan)" />
  <circle cx="342" cy="196" r="1.1" fill="url(#node-pink)" />
  <circle cx="402" cy="176" r="1.4" fill="url(#node-cyan)" />
  <circle cx="452" cy="132" r="1.3" fill="url(#node-pink)" />

  <circle cx="38" cy="210" r="1.1" fill="url(#node-cyan)" />
  <circle cx="18" cy="270" r="3.2" fill="url(#node-pink)" />
  <circle cx="126" cy="228" r="1.4" fill="url(#node-pink)" />
  <circle cx="180" cy="220" r="1.1" fill="url(#node-cyan)" />
  <circle cx="250" cy="228" r="2.7" fill="url(#node-pink)" />
  <circle cx="278" cy="256" r="1.1" fill="url(#node-cyan)" />
  <circle cx="356" cy="240" r="1.5" fill="url(#node-pink)" />
  <circle cx="448" cy="224" r="1.2" fill="url(#node-cyan)" />

  <circle cx="180" cy="278" r="1.2" fill="url(#node-cyan)" />
  <circle cx="300" cy="282" r="1.4" fill="url(#node-pink)" />
  <circle cx="420" cy="272" r="1.3" fill="url(#node-cyan)" />
</g>
</svg>

  <div className="absolute left-1/2 top-[39%] flex -translate-x-1/2 -translate-y-1/2 items-center gap-2.5 whitespace-nowrap rounded-xl border border-sky-200/35 bg-slate-950/70 px-4 py-2.5 shadow-[0_0_14px_rgba(56,189,248,0.18)] backdrop-blur">
 
<svg
  viewBox="0 0 40 40"
  fill="none"
  stroke="#ffffff"
  strokeWidth="1.8"
  strokeLinecap="round"
  strokeLinejoin="round"
  className="h-7 w-7 shrink-0 overflow-visible"
  aria-hidden="true"
>
  <g transform="translate(9 0) rotate(-35 20 20)">
    <rect x="16" y="14" width="8" height="12" rx="1.5" />
    <path d="M16 17H5v6h11M24 17h11v6H24" />
    <path d="M9 17v6M13 17v6M27 17v6M31 17v6" />
    <path d="M20 14V9" />
    <path d="M17.5 9h5" />
    <circle cx="20" cy="20" r="1.2" fill="#ffffff" stroke="none" />
  </g>
</svg>



  <span className="text-sm font-normal text-slate-300">
    研究室の出会いを、スィングバイに
  </span>
</div>
</section>

      <Link
  to="/chats"
  className="fixed bottom-20 left-1/2 z-10 w-[calc(100%-3rem)] max-w-sm -translate-x-1/2 rounded-xl bg-gray-500 px-4 py-3 text-center font-bold text-white shadow-lg"
>
  チャット一覧へ
</Link>

      </div>

    </div>
  );
}