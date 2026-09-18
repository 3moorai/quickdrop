// src/main.tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

// src/App.tsx
import { useState as useState7, useEffect as useEffect5, useRef as useRef6, useCallback, useMemo } from "react";

// src/components/Navbar.tsx
import React from "react";
import {
  ShieldCheck,
  HelpCircle,
  Clock,
  Sun,
  Moon,
  ArrowLeftRight,
  History,
  XCircle,
  Wifi,
  WifiOff,
  User,
  LogOut
} from "lucide-react";
import { jsx, jsxs } from "react/jsx-runtime";
var Navbar = ({
  currentTab,
  onTabChange,
  connectionState,
  peerDeviceInfo,
  sessionExpiresAt,
  theme,
  onToggleTheme,
  onEndSession,
  hasActiveSession,
  currentUser,
  onLogout
}) => {
  const [timeLeft, setTimeLeft] = React.useState("");
  React.useEffect(() => {
    if (!sessionExpiresAt) {
      setTimeLeft("");
      return;
    }
    const updateTimer = () => {
      const remaining = Math.max(0, Math.floor((sessionExpiresAt - Date.now()) / 1e3));
      const mins = Math.floor(remaining / 60);
      const secs = remaining % 60;
      setTimeLeft(`${mins}:${secs < 10 ? "0" : ""}${secs}`);
    };
    updateTimer();
    const interval = setInterval(updateTimer, 1e3);
    return () => clearInterval(interval);
  }, [sessionExpiresAt]);
  const getConnectionBadge = () => {
    switch (connectionState) {
      case "connected":
        return /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20", children: [
          /* @__PURE__ */ jsx("span", { className: "w-2 h-2 rounded-full bg-emerald-500 animate-pulse" }),
          /* @__PURE__ */ jsxs("span", { children: [
            "Connected ",
            peerDeviceInfo ? `to ${peerDeviceInfo.name}` : ""
          ] })
        ] });
      case "connecting":
        return /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20", children: [
          /* @__PURE__ */ jsx("span", { className: "w-2 h-2 rounded-full bg-amber-500 animate-ping" }),
          /* @__PURE__ */ jsx("span", { children: "Connecting..." })
        ] });
      case "waiting":
        return /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20", children: [
          /* @__PURE__ */ jsx(Wifi, { className: "w-3 h-3 animate-pulse" }),
          /* @__PURE__ */ jsx("span", { children: "Waiting for peer" })
        ] });
      case "reconnecting":
        return /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20", children: [
          /* @__PURE__ */ jsx(Wifi, { className: "w-3 h-3 animate-spin" }),
          /* @__PURE__ */ jsx("span", { children: "Reconnecting..." })
        ] });
      case "disconnected":
        return /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20", children: [
          /* @__PURE__ */ jsx(WifiOff, { className: "w-3 h-3" }),
          /* @__PURE__ */ jsx("span", { children: "Disconnected" })
        ] });
      default:
        return null;
    }
  };
  return /* @__PURE__ */ jsx("header", { className: "sticky top-0 z-40 w-full border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md transition-colors", children: /* @__PURE__ */ jsxs("div", { className: "max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4", children: [
    /* @__PURE__ */ jsx("div", { className: "flex items-center gap-3", children: /* @__PURE__ */ jsxs(
      "button",
      {
        onClick: () => onTabChange("transfer"),
        className: "flex items-center gap-2.5 text-left group focus:outline-none",
        id: "brand-home-btn",
        children: [
          /* @__PURE__ */ jsx("div", { className: "w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 text-white flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform", children: /* @__PURE__ */ jsx(ArrowLeftRight, { className: "w-5 h-5" }) }),
          /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsx("span", { className: "font-semibold text-base tracking-tight text-zinc-900 dark:text-zinc-100", children: "QuickDrop" }),
            /* @__PURE__ */ jsx("span", { className: "text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300", children: "P2P" })
          ] }) })
        ]
      }
    ) }),
    /* @__PURE__ */ jsxs("div", { className: "hidden md:flex items-center gap-3", children: [
      getConnectionBadge(),
      timeLeft && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700", children: [
        /* @__PURE__ */ jsx(Clock, { className: "w-3 h-3 text-zinc-400" }),
        /* @__PURE__ */ jsxs("span", { children: [
          "Expires in ",
          timeLeft
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 sm:gap-2", children: [
      /* @__PURE__ */ jsxs("nav", { className: "flex items-center p-1 rounded-lg bg-zinc-100 dark:bg-zinc-900 text-xs font-medium", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => onTabChange("transfer"),
            className: `px-3 py-1.5 rounded-md transition-all ${currentTab === "transfer" ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-xs" : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"}`,
            id: "nav-tab-transfer",
            children: "Transfer"
          }
        ),
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => onTabChange("history"),
            className: `px-3 py-1.5 rounded-md transition-all flex items-center gap-1 ${currentTab === "history" ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-xs" : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"}`,
            id: "nav-tab-history",
            children: [
              /* @__PURE__ */ jsx(History, { className: "w-3.5 h-3.5" }),
              /* @__PURE__ */ jsx("span", { children: "History" })
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => onTabChange("privacy"),
            className: `hidden sm:inline-flex items-center gap-1 px-3 py-1.5 rounded-md transition-all ${currentTab === "privacy" ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-xs" : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"}`,
            id: "nav-tab-privacy",
            children: [
              /* @__PURE__ */ jsx(ShieldCheck, { className: "w-3.5 h-3.5" }),
              /* @__PURE__ */ jsx("span", { children: "Privacy" })
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => onTabChange("help"),
            className: `hidden sm:inline-flex items-center gap-1 px-3 py-1.5 rounded-md transition-all ${currentTab === "help" ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-xs" : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"}`,
            id: "nav-tab-help",
            children: [
              /* @__PURE__ */ jsx(HelpCircle, { className: "w-3.5 h-3.5" }),
              /* @__PURE__ */ jsx("span", { children: "Help" })
            ]
          }
        ),
        currentUser && /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => onTabChange("profile"),
            className: `flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all cursor-pointer ${currentTab === "profile" ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-xs" : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"}`,
            id: "nav-tab-profile",
            title: "\u0627\u0644\u062D\u0633\u0627\u0628 \u0627\u0644\u0634\u062E\u0635\u064A",
            children: [
              currentUser.avatarUrl ? /* @__PURE__ */ jsx(
                "img",
                {
                  src: currentUser.avatarUrl,
                  alt: currentUser.name,
                  className: "w-4 h-4 rounded-full object-cover border border-blue-500",
                  referrerPolicy: "no-referrer"
                }
              ) : /* @__PURE__ */ jsx(User, { className: "w-3.5 h-3.5 text-blue-500" }),
              /* @__PURE__ */ jsx("span", { className: "max-w-[80px] sm:max-w-[110px] truncate", children: currentUser.name || "\u062D\u0633\u0627\u0628\u064A" })
            ]
          }
        )
      ] }),
      currentUser && onLogout && /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: onLogout,
          className: "p-2 rounded-lg text-zinc-500 hover:text-rose-600 dark:text-zinc-400 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer focus:outline-none",
          title: "\u062A\u0633\u062C\u064A\u0644 \u0627\u0644\u062E\u0631\u0648\u062C (Log out)",
          "aria-label": "\u062A\u0633\u062C\u064A\u0644 \u0627\u0644\u062E\u0631\u0648\u062C",
          id: "quick-logout-btn",
          children: /* @__PURE__ */ jsx(LogOut, { className: "w-4 h-4" })
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: onToggleTheme,
          className: "p-2 rounded-lg text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 active:scale-95 transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
          "aria-label": theme === "dark" ? "Switch to light mode" : "Switch to dark mode",
          title: theme === "dark" ? "Switch to light mode" : "Switch to dark mode",
          id: "theme-toggle-btn",
          children: theme === "dark" ? /* @__PURE__ */ jsx(Sun, { className: "w-4 h-4 text-amber-400" }) : /* @__PURE__ */ jsx(Moon, { className: "w-4 h-4 text-zinc-700" })
        }
      ),
      hasActiveSession && onEndSession && /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: onEndSession,
          className: "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 transition-colors",
          id: "end-session-btn",
          children: [
            /* @__PURE__ */ jsx(XCircle, { className: "w-3.5 h-3.5" }),
            /* @__PURE__ */ jsx("span", { children: "End" })
          ]
        }
      )
    ] })
  ] }) });
};

// src/components/LandingView.tsx
import {
  ArrowRight,
  QrCode,
  ShieldCheck as ShieldCheck2,
  Zap,
  FileCheck2,
  Lock
} from "lucide-react";
import { Fragment, jsx as jsx2, jsxs as jsxs2 } from "react/jsx-runtime";
var LandingView = ({
  onStartSession,
  onOpenJoin,
  localDeviceInfo,
  isCreating
}) => {
  return /* @__PURE__ */ jsxs2("div", { className: "max-w-4xl mx-auto px-4 py-8 sm:py-16 space-y-12", children: [
    /* @__PURE__ */ jsxs2("div", { className: "text-center space-y-4", children: [
      /* @__PURE__ */ jsxs2("div", { className: "inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/80", children: [
        /* @__PURE__ */ jsx2(ShieldCheck2, { className: "w-3.5 h-3.5" }),
        /* @__PURE__ */ jsx2("span", { children: "Private Encrypted WebRTC DataChannel" })
      ] }),
      /* @__PURE__ */ jsxs2("h1", { className: "text-3xl sm:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 leading-tight", children: [
        "Move files. ",
        /* @__PURE__ */ jsx2("span", { className: "text-blue-600 dark:text-blue-400", children: "Not through the cloud." })
      ] }),
      /* @__PURE__ */ jsx2("p", { className: "text-base sm:text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto", children: "Fast, direct cross-device transfers between iOS, Android, Windows, Mac, and Linux. No accounts, no cloud storage, no size limits." }),
      /* @__PURE__ */ jsxs2("div", { className: "pt-4 flex flex-col sm:flex-row items-center justify-center gap-3", children: [
        /* @__PURE__ */ jsx2(
          "button",
          {
            onClick: onStartSession,
            disabled: isCreating,
            className: "w-full sm:w-auto px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group focus:outline-none",
            id: "start-transfer-btn",
            children: isCreating ? /* @__PURE__ */ jsxs2(Fragment, { children: [
              /* @__PURE__ */ jsx2("div", { className: "w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" }),
              /* @__PURE__ */ jsx2("span", { children: "Creating Session..." })
            ] }) : /* @__PURE__ */ jsxs2(Fragment, { children: [
              /* @__PURE__ */ jsx2("span", { children: "Start New Transfer" }),
              /* @__PURE__ */ jsx2(ArrowRight, { className: "w-4 h-4 group-hover:translate-x-0.5 transition-transform" })
            ] })
          }
        ),
        /* @__PURE__ */ jsxs2(
          "button",
          {
            onClick: onOpenJoin,
            className: "w-full sm:w-auto px-6 py-3.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-900 dark:text-zinc-100 font-medium text-sm transition-all flex items-center justify-center gap-2 border border-zinc-200 dark:border-zinc-700 focus:outline-none",
            id: "join-session-btn",
            children: [
              /* @__PURE__ */ jsx2(QrCode, { className: "w-4 h-4 text-blue-600 dark:text-blue-400" }),
              /* @__PURE__ */ jsx2("span", { children: "Join with Code / Scan QR" })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsx2("div", { className: "pt-2", children: /* @__PURE__ */ jsxs2("span", { className: "text-xs text-zinc-600 dark:text-zinc-400 font-medium", children: [
        "This device: ",
        /* @__PURE__ */ jsx2("span", { className: "text-zinc-700 dark:text-zinc-200 font-semibold", children: localDeviceInfo.name })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxs2("div", { className: "grid grid-cols-1 sm:grid-cols-4 gap-4 pt-4", children: [
      /* @__PURE__ */ jsxs2("div", { className: "p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-left space-y-2", children: [
        /* @__PURE__ */ jsx2("div", { className: "w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xs", children: "1" }),
        /* @__PURE__ */ jsx2("div", { className: "font-semibold text-sm text-zinc-900 dark:text-zinc-100", children: "Create Session" }),
        /* @__PURE__ */ jsx2("div", { className: "text-xs text-zinc-500 dark:text-zinc-400", children: "Generate an ephemeral session with a high-contrast QR code." })
      ] }),
      /* @__PURE__ */ jsxs2("div", { className: "p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-left space-y-2", children: [
        /* @__PURE__ */ jsx2("div", { className: "w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xs", children: "2" }),
        /* @__PURE__ */ jsx2("div", { className: "font-semibold text-sm text-zinc-900 dark:text-zinc-100", children: "Scan or Pair" }),
        /* @__PURE__ */ jsx2("div", { className: "text-xs text-zinc-500 dark:text-zinc-400", children: "Scan the QR code with your phone camera or enter the 8-char code." })
      ] }),
      /* @__PURE__ */ jsxs2("div", { className: "p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-left space-y-2", children: [
        /* @__PURE__ */ jsx2("div", { className: "w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xs", children: "3" }),
        /* @__PURE__ */ jsx2("div", { className: "font-semibold text-sm text-zinc-900 dark:text-zinc-100", children: "WebRTC P2P" }),
        /* @__PURE__ */ jsx2("div", { className: "text-xs text-zinc-500 dark:text-zinc-400", children: "Direct peer-to-peer data channel is negotiated instantly." })
      ] }),
      /* @__PURE__ */ jsxs2("div", { className: "p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-left space-y-2", children: [
        /* @__PURE__ */ jsx2("div", { className: "w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xs", children: "4" }),
        /* @__PURE__ */ jsx2("div", { className: "font-semibold text-sm text-zinc-900 dark:text-zinc-100", children: "Stream & Verify" }),
        /* @__PURE__ */ jsx2("div", { className: "text-xs text-zinc-500 dark:text-zinc-400", children: "Files stream chunk by chunk with SHA-256 integrity verification." })
      ] })
    ] }),
    /* @__PURE__ */ jsxs2("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 border-t border-zinc-200 dark:border-zinc-800", children: [
      /* @__PURE__ */ jsxs2("div", { className: "flex gap-3", children: [
        /* @__PURE__ */ jsx2("div", { className: "p-2.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 h-fit", children: /* @__PURE__ */ jsx2(Lock, { className: "w-5 h-5 text-blue-600 dark:text-blue-400" }) }),
        /* @__PURE__ */ jsxs2("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsx2("h2", { className: "text-sm font-semibold text-zinc-900 dark:text-zinc-100", children: "Zero Cloud Storage" }),
          /* @__PURE__ */ jsx2("p", { className: "text-xs text-zinc-500 dark:text-zinc-400", children: "Files stream straight between device memories. No servers retain your files." })
        ] })
      ] }),
      /* @__PURE__ */ jsxs2("div", { className: "flex gap-3", children: [
        /* @__PURE__ */ jsx2("div", { className: "p-2.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 h-fit", children: /* @__PURE__ */ jsx2(Zap, { className: "w-5 h-5 text-blue-600 dark:text-blue-400" }) }),
        /* @__PURE__ */ jsxs2("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsx2("h2", { className: "text-sm font-semibold text-zinc-900 dark:text-zinc-100", children: "Direct WebRTC Speed" }),
          /* @__PURE__ */ jsx2("p", { className: "text-xs text-zinc-500 dark:text-zinc-400", children: "When devices share a local Wi-Fi, data travels directly over your LAN with zero bottleneck." })
        ] })
      ] }),
      /* @__PURE__ */ jsxs2("div", { className: "flex gap-3", children: [
        /* @__PURE__ */ jsx2("div", { className: "p-2.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 h-fit", children: /* @__PURE__ */ jsx2(FileCheck2, { className: "w-5 h-5 text-blue-600 dark:text-blue-400" }) }),
        /* @__PURE__ */ jsxs2("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsx2("h2", { className: "text-sm font-semibold text-zinc-900 dark:text-zinc-100", children: "SHA-256 Verified" }),
          /* @__PURE__ */ jsx2("p", { className: "text-xs text-zinc-500 dark:text-zinc-400", children: "Every transferred payload is mathematically verified before being saved to ensure zero corruption." })
        ] })
      ] })
    ] })
  ] });
};

// src/components/PairingCard.tsx
import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import {
  Copy,
  Check,
  RefreshCw,
  X,
  Clock as Clock2,
  Share2 as Share22
} from "lucide-react";
import { Fragment as Fragment2, jsx as jsx3, jsxs as jsxs3 } from "react/jsx-runtime";
var PairingCard = ({
  session,
  onRefresh,
  onCancel,
  theme
}) => {
  const canvasRef = useRef(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [timeLeft, setTimeLeft] = useState("");
  const getJoinUrl = () => {
    try {
      const url = new URL(window.location.href);
      url.search = `?join=${encodeURIComponent(session.token)}&code=${encodeURIComponent(session.sessionId)}`;
      url.hash = "";
      return url.toString();
    } catch {
      const base = window.location.href.split("?")[0];
      return `${base}?join=${encodeURIComponent(session.token)}&code=${encodeURIComponent(session.sessionId)}`;
    }
  };
  const joinUrl = getJoinUrl();
  useEffect(() => {
    if (canvasRef.current) {
      QRCode.toCanvas(
        canvasRef.current,
        joinUrl,
        {
          width: 240,
          margin: 2,
          color: {
            dark: theme === "dark" ? "#09090b" : "#09090b",
            light: "#ffffff"
          },
          errorCorrectionLevel: "M"
        },
        (error) => {
          if (error) console.error("QR code generation failed:", error);
        }
      );
    }
  }, [joinUrl, theme]);
  useEffect(() => {
    const updateTimer = () => {
      const remaining = Math.max(0, Math.floor((session.expiresAt - Date.now()) / 1e3));
      const mins = Math.floor(remaining / 60);
      const secs = remaining % 60;
      setTimeLeft(`${mins}:${secs < 10 ? "0" : ""}${secs}`);
    };
    updateTimer();
    const interval = setInterval(updateTimer, 1e3);
    return () => clearInterval(interval);
  }, [session.expiresAt]);
  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(session.sessionId);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2e3);
    } catch {
    }
  };
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(joinUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2e3);
    } catch {
    }
  };
  return /* @__PURE__ */ jsxs3("div", { className: "max-w-md mx-auto bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6", children: [
    /* @__PURE__ */ jsxs3("div", { className: "text-center space-y-1", children: [
      /* @__PURE__ */ jsx3("h2", { className: "text-xl font-bold text-zinc-900 dark:text-zinc-100", children: "Connect another device" }),
      /* @__PURE__ */ jsx3("p", { className: "text-xs text-zinc-500 dark:text-zinc-400", children: "Scan with your phone camera or use the 8-character code" })
    ] }),
    /* @__PURE__ */ jsxs3("div", { className: "flex flex-col items-center justify-center", children: [
      /* @__PURE__ */ jsx3("div", { className: "p-3 bg-white rounded-2xl border border-zinc-200 dark:border-zinc-700 shadow-inner", children: /* @__PURE__ */ jsx3("canvas", { ref: canvasRef, className: "rounded-lg" }) }),
      /* @__PURE__ */ jsxs3("div", { className: "mt-3 flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400", children: [
        /* @__PURE__ */ jsx3(Clock2, { className: "w-3.5 h-3.5" }),
        /* @__PURE__ */ jsxs3("span", { children: [
          "Expires in ",
          /* @__PURE__ */ jsx3("strong", { className: "text-zinc-700 dark:text-zinc-200", children: timeLeft })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs3("div", { className: "space-y-2", children: [
      /* @__PURE__ */ jsx3("label", { className: "block text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 text-center", children: "Pairing Code" }),
      /* @__PURE__ */ jsxs3("div", { className: "flex items-center justify-between p-3 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800", children: [
        /* @__PURE__ */ jsx3("span", { className: "font-mono text-lg font-bold tracking-widest text-blue-600 dark:text-blue-400", children: session.sessionId }),
        /* @__PURE__ */ jsx3(
          "button",
          {
            onClick: handleCopyCode,
            className: "flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-white dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700 transition-colors focus:outline-none",
            id: "copy-pairing-code-btn",
            children: copiedCode ? /* @__PURE__ */ jsxs3(Fragment2, { children: [
              /* @__PURE__ */ jsx3(Check, { className: "w-3.5 h-3.5 text-emerald-500" }),
              /* @__PURE__ */ jsx3("span", { children: "Copied" })
            ] }) : /* @__PURE__ */ jsxs3(Fragment2, { children: [
              /* @__PURE__ */ jsx3(Copy, { className: "w-3.5 h-3.5" }),
              /* @__PURE__ */ jsx3("span", { children: "Copy" })
            ] })
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxs3("div", { className: "flex gap-2", children: [
      /* @__PURE__ */ jsx3(
        "button",
        {
          onClick: handleCopyLink,
          className: "flex-1 flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl text-xs font-medium bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-750 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700 transition-colors focus:outline-none",
          id: "copy-link-btn",
          children: copiedLink ? /* @__PURE__ */ jsxs3(Fragment2, { children: [
            /* @__PURE__ */ jsx3(Check, { className: "w-3.5 h-3.5 text-emerald-500" }),
            /* @__PURE__ */ jsx3("span", { children: "Link Copied" })
          ] }) : /* @__PURE__ */ jsxs3(Fragment2, { children: [
            /* @__PURE__ */ jsx3(Share22, { className: "w-3.5 h-3.5 text-zinc-500" }),
            /* @__PURE__ */ jsx3("span", { children: "Copy Direct Link" })
          ] })
        }
      ),
      /* @__PURE__ */ jsx3(
        "button",
        {
          onClick: onRefresh,
          className: "p-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700 transition-colors focus:outline-none",
          title: "Refresh Code",
          id: "refresh-qr-btn",
          children: /* @__PURE__ */ jsx3(RefreshCw, { className: "w-4 h-4" })
        }
      ),
      /* @__PURE__ */ jsxs3(
        "button",
        {
          onClick: onCancel,
          className: "flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/50 transition-colors focus:outline-none text-xs font-semibold",
          title: "Cancel Session and return home",
          id: "cancel-pairing-btn",
          children: [
            /* @__PURE__ */ jsx3(X, { className: "w-4 h-4" }),
            /* @__PURE__ */ jsx3("span", { children: "\u0627\u0644\u0631\u0626\u064A\u0633\u064A\u0629" })
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxs3("div", { className: "flex items-center justify-center gap-2 pt-2 text-xs text-zinc-500 dark:text-zinc-400", children: [
      /* @__PURE__ */ jsx3("span", { className: "w-2 h-2 rounded-full bg-blue-500 animate-ping" }),
      /* @__PURE__ */ jsx3("span", { children: "Waiting for second device to connect..." })
    ] })
  ] });
};

// src/components/QrScannerModal.tsx
import { useEffect as useEffect2, useRef as useRef2, useState as useState2 } from "react";
import jsQR from "jsqr";
import { Camera, X as X2, AlertCircle, RefreshCw as RefreshCw2, KeyRound } from "lucide-react";
import { jsx as jsx4, jsxs as jsxs4 } from "react/jsx-runtime";
var QrScannerModal = ({
  isOpen,
  onClose,
  onScanSuccess,
  onSwitchToManual
}) => {
  const videoRef = useRef2(null);
  const canvasRef = useRef2(null);
  const streamRef = useRef2(null);
  const animationFrameRef = useRef2(null);
  const [cameraError, setCameraError] = useState2(null);
  const [isStartingCamera, setIsStartingCamera] = useState2(true);
  const [scanMessage, setScanMessage] = useState2(null);
  useEffect2(() => {
    if (!isOpen) {
      stopCamera();
      return;
    }
    startCamera();
    return () => {
      stopCamera();
    };
  }, [isOpen]);
  const startCamera = async () => {
    setIsStartingCamera(true);
    setCameraError(null);
    setScanMessage(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Camera access is not supported by your browser environment");
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute("playsinline", "true");
        await videoRef.current.play();
        setIsStartingCamera(false);
        scanLoop();
      }
    } catch (err) {
      setIsStartingCamera(false);
      if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
        setCameraError("Camera access was denied. Please allow camera permissions in your browser settings.");
      } else if (err.name === "NotFoundError" || err.name === "DevicesNotFoundError") {
        setCameraError("No camera was detected on this device.");
      } else {
        setCameraError(err.message || "Unable to start camera.");
      }
    }
  };
  const stopCamera = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };
  const scanLoop = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || video.readyState !== video.HAVE_ENOUGH_DATA) {
      animationFrameRef.current = requestAnimationFrame(scanLoop);
      return;
    }
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) {
      animationFrameRef.current = requestAnimationFrame(scanLoop);
      return;
    }
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const code = jsQR(imageData.data, imageData.width, imageData.height, {
      inversionAttempts: "dontInvert"
    });
    if (code && code.data) {
      const text = code.data.trim();
      let matchedTokenOrCode = null;
      try {
        const url = new URL(text);
        const codeParam = url.searchParams.get("code");
        const joinParam = url.searchParams.get("join");
        if (codeParam) {
          matchedTokenOrCode = codeParam.toUpperCase();
        } else if (joinParam) {
          matchedTokenOrCode = joinParam;
        }
      } catch {
        const qkMatch = text.match(/QK-[A-Z0-9]{4}-[A-Z0-9]{4}/i);
        if (qkMatch) {
          matchedTokenOrCode = qkMatch[0].toUpperCase();
        } else if (/^[A-Z0-9]{8}$/i.test(text)) {
          matchedTokenOrCode = `QK-${text.slice(0, 4).toUpperCase()}-${text.slice(4, 8).toUpperCase()}`;
        }
      }
      if (matchedTokenOrCode) {
        stopCamera();
        onScanSuccess(matchedTokenOrCode);
        return;
      } else {
        setScanMessage("This QR code is not a valid QuickDrop pairing code.");
      }
    }
    animationFrameRef.current = requestAnimationFrame(scanLoop);
  };
  if (!isOpen) return null;
  return /* @__PURE__ */ jsx4("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200", children: /* @__PURE__ */ jsxs4("div", { className: "relative w-full max-w-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-2xl space-y-4 p-6", children: [
    /* @__PURE__ */ jsxs4("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxs4("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx4(Camera, { className: "w-5 h-5 text-blue-600 dark:text-blue-400" }),
        /* @__PURE__ */ jsx4("h3", { className: "font-semibold text-base text-zinc-900 dark:text-zinc-100", children: "Scan QuickDrop QR Code" })
      ] }),
      /* @__PURE__ */ jsx4(
        "button",
        {
          onClick: onClose,
          className: "p-1.5 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors focus:outline-none",
          id: "close-qr-scanner-btn",
          children: /* @__PURE__ */ jsx4(X2, { className: "w-4 h-4" })
        }
      )
    ] }),
    /* @__PURE__ */ jsxs4("div", { className: "relative aspect-square w-full rounded-xl overflow-hidden bg-black flex items-center justify-center", children: [
      /* @__PURE__ */ jsx4(
        "video",
        {
          ref: videoRef,
          className: "absolute inset-0 w-full h-full object-cover"
        }
      ),
      /* @__PURE__ */ jsx4("canvas", { ref: canvasRef, className: "hidden" }),
      !cameraError && !isStartingCamera && /* @__PURE__ */ jsxs4("div", { className: "relative w-48 h-48 sm:w-56 sm:h-56 border-2 border-blue-500/70 rounded-2xl pointer-events-none shadow-[0_0_0_9999px_rgba(0,0,0,0.45)]", children: [
        /* @__PURE__ */ jsx4("div", { className: "absolute -top-1 -left-1 w-5 h-5 border-t-4 border-l-4 border-blue-400 rounded-tl" }),
        /* @__PURE__ */ jsx4("div", { className: "absolute -top-1 -right-1 w-5 h-5 border-t-4 border-r-4 border-blue-400 rounded-tr" }),
        /* @__PURE__ */ jsx4("div", { className: "absolute -bottom-1 -left-1 w-5 h-5 border-b-4 border-l-4 border-blue-400 rounded-bl" }),
        /* @__PURE__ */ jsx4("div", { className: "absolute -bottom-1 -right-1 w-5 h-5 border-b-4 border-r-4 border-blue-400 rounded-br" }),
        /* @__PURE__ */ jsx4("div", { className: "absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent animate-pulse shadow-sm" })
      ] }),
      isStartingCamera && !cameraError && /* @__PURE__ */ jsxs4("div", { className: "flex flex-col items-center gap-2 text-zinc-400 text-xs z-10", children: [
        /* @__PURE__ */ jsx4(RefreshCw2, { className: "w-5 h-5 animate-spin text-blue-500" }),
        /* @__PURE__ */ jsx4("span", { children: "Starting camera preview..." })
      ] }),
      cameraError && /* @__PURE__ */ jsxs4("div", { className: "p-6 text-center space-y-3 z-10", children: [
        /* @__PURE__ */ jsx4(AlertCircle, { className: "w-8 h-8 text-amber-500 mx-auto" }),
        /* @__PURE__ */ jsx4("p", { className: "text-xs text-zinc-300 leading-relaxed max-w-xs mx-auto", children: cameraError }),
        /* @__PURE__ */ jsx4(
          "button",
          {
            onClick: onSwitchToManual,
            className: "px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-colors",
            id: "scanner-switch-manual-btn",
            children: "Enter Code Manually Instead"
          }
        )
      ] })
    ] }),
    scanMessage && /* @__PURE__ */ jsx4("div", { className: "p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-amber-800 dark:text-amber-300 text-xs text-center", children: scanMessage }),
    /* @__PURE__ */ jsxs4("div", { className: "pt-2 flex items-center justify-between", children: [
      /* @__PURE__ */ jsxs4(
        "button",
        {
          onClick: onSwitchToManual,
          className: "flex items-center gap-1.5 text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium",
          id: "scanner-manual-fallback-btn",
          children: [
            /* @__PURE__ */ jsx4(KeyRound, { className: "w-3.5 h-3.5" }),
            /* @__PURE__ */ jsx4("span", { children: "Have a pairing code? Enter manually" })
          ]
        }
      ),
      /* @__PURE__ */ jsx4(
        "button",
        {
          onClick: startCamera,
          className: "p-1.5 rounded-lg text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 text-xs",
          title: "Restart Camera",
          id: "scanner-restart-cam-btn",
          children: /* @__PURE__ */ jsx4(RefreshCw2, { className: "w-3.5 h-3.5" })
        }
      )
    ] })
  ] }) });
};

// src/components/ManualJoinModal.tsx
import { useState as useState3 } from "react";
import { KeyRound as KeyRound2, X as X3, Camera as Camera2, ArrowRight as ArrowRight2, AlertCircle as AlertCircle2 } from "lucide-react";
import { Fragment as Fragment3, jsx as jsx5, jsxs as jsxs5 } from "react/jsx-runtime";
var ManualJoinModal = ({
  isOpen,
  onClose,
  onSubmit,
  onSwitchToCamera
}) => {
  const [inputValue, setInputValue] = useState3("");
  const [isSubmitting, setIsSubmitting] = useState3(false);
  const [errorMessage, setErrorMessage] = useState3(null);
  if (!isOpen) return null;
  const handleSubmit = async (e) => {
    e.preventDefault();
    const clean = inputValue.trim();
    if (!clean) return;
    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      await onSubmit(clean);
    } catch (err) {
      setErrorMessage(err.message || "Failed to connect. Please check the code and try again.");
      setIsSubmitting(false);
    }
  };
  const handleChange = (e) => {
    const val = e.target.value;
    setInputValue(val);
    if (errorMessage) setErrorMessage(null);
  };
  return /* @__PURE__ */ jsx5("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200", children: /* @__PURE__ */ jsxs5("div", { className: "relative w-full max-w-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6", children: [
    /* @__PURE__ */ jsxs5("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxs5("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx5(KeyRound2, { className: "w-5 h-5 text-blue-600 dark:text-blue-400" }),
        /* @__PURE__ */ jsx5("h3", { className: "font-semibold text-base text-zinc-900 dark:text-zinc-100", children: "Join QuickDrop Session" })
      ] }),
      /* @__PURE__ */ jsx5(
        "button",
        {
          onClick: onClose,
          className: "p-1.5 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors focus:outline-none",
          id: "close-manual-join-btn",
          children: /* @__PURE__ */ jsx5(X3, { className: "w-4 h-4" })
        }
      )
    ] }),
    /* @__PURE__ */ jsxs5("form", { onSubmit: handleSubmit, className: "space-y-4", children: [
      /* @__PURE__ */ jsxs5("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsx5("label", { className: "block text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400", children: "Pairing Code or Join Link" }),
        /* @__PURE__ */ jsx5(
          "input",
          {
            type: "text",
            value: inputValue,
            onChange: handleChange,
            placeholder: "e.g. QK-7F92-XK31 or paste link",
            className: "w-full px-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono uppercase",
            autoFocus: true,
            id: "manual-code-input"
          }
        ),
        /* @__PURE__ */ jsx5("p", { className: "text-[11px] text-zinc-500 dark:text-zinc-400", children: "Enter the 8-character pairing code shown on the sender screen." })
      ] }),
      errorMessage && /* @__PURE__ */ jsxs5("div", { className: "flex items-start gap-2 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-800 dark:text-rose-300 text-xs", children: [
        /* @__PURE__ */ jsx5(AlertCircle2, { className: "w-4 h-4 shrink-0 mt-0.5" }),
        /* @__PURE__ */ jsx5("span", { children: errorMessage })
      ] }),
      /* @__PURE__ */ jsxs5("div", { className: "pt-2 flex flex-col gap-2.5", children: [
        /* @__PURE__ */ jsx5(
          "button",
          {
            type: "submit",
            disabled: !inputValue.trim() || isSubmitting,
            className: "w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed",
            id: "submit-manual-code-btn",
            children: isSubmitting ? /* @__PURE__ */ jsxs5(Fragment3, { children: [
              /* @__PURE__ */ jsx5("div", { className: "w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" }),
              /* @__PURE__ */ jsx5("span", { children: "Connecting..." })
            ] }) : /* @__PURE__ */ jsxs5(Fragment3, { children: [
              /* @__PURE__ */ jsx5("span", { children: "Connect to Device" }),
              /* @__PURE__ */ jsx5(ArrowRight2, { className: "w-4 h-4" })
            ] })
          }
        ),
        /* @__PURE__ */ jsxs5(
          "button",
          {
            type: "button",
            onClick: onSwitchToCamera,
            className: "w-full py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 font-medium text-xs transition-colors flex items-center justify-center gap-2",
            id: "switch-to-camera-btn",
            children: [
              /* @__PURE__ */ jsx5(Camera2, { className: "w-3.5 h-3.5" }),
              /* @__PURE__ */ jsx5("span", { children: "Scan QR Code with Camera Instead" })
            ]
          }
        )
      ] })
    ] })
  ] }) });
};

// src/components/TransferDashboard.tsx
import { useRef as useRef3, useState as useState4, useEffect as useEffect3 } from "react";
import {
  UploadCloud,
  File,
  FileText,
  Image as ImageIcon,
  Film,
  Music,
  Archive,
  Download,
  X as X4,
  CheckCircle2,
  AlertCircle as AlertCircle3,
  Send,
  Link as LinkIcon,
  Copy as Copy2,
  Check as Check2,
  ExternalLink as ExternalLink2,
  Laptop as Laptop2,
  Smartphone as Smartphone3,
  FolderUp,
  ShieldCheck as ShieldCheck3,
  ArrowUpRight,
  ArrowDownLeft,
  CloudUpload,
  HardDrive
} from "lucide-react";

// src/lib/crypto.ts
async function calculateSha256(data) {
  if (!window.crypto || !window.crypto.subtle) {
    return "unsupported";
  }
  try {
    const hashBuffer = await window.crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  } catch (err) {
    console.error("SHA-256 calculation error:", err);
    return "error";
  }
}
function sanitizeFilename(filename) {
  if (!filename || typeof filename !== "string") {
    return `quickdrop-file-${Date.now()}`;
  }
  let clean = filename.replace(/^.*[\\/]/, "").replace(/\.\./g, "").replace(/[<>:"/\\|?*\x00-\x1F]/g, "_").trim();
  if (!clean || /^[\s.]+$/.test(clean)) {
    clean = `quickdrop-file-${Date.now()}`;
  }
  if (clean.length > 120) {
    const extIdx = clean.lastIndexOf(".");
    if (extIdx > 0 && extIdx > clean.length - 10) {
      const ext = clean.substring(extIdx);
      clean = clean.substring(0, 110) + ext;
    } else {
      clean = clean.substring(0, 120);
    }
  }
  return clean;
}
function formatBytes(bytes, decimals = 1) {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const val = bytes / Math.pow(k, i);
  return `${parseFloat(val.toFixed(dm))} ${sizes[i]}`;
}
function formatSpeed(bytesPerSec) {
  if (!bytesPerSec || bytesPerSec <= 0) return "0 KB/s";
  return `${formatBytes(bytesPerSec, 1)}/s`;
}
function formatEta(seconds) {
  if (!Number.isFinite(seconds) || seconds <= 0) return "Calculating...";
  if (seconds < 60) {
    return `${Math.round(seconds)}s`;
  }
  const mins = Math.floor(seconds / 60);
  const remainingSecs = Math.round(seconds % 60);
  if (mins < 60) {
    return `${mins}m ${remainingSecs}s`;
  }
  const hours = Math.floor(mins / 60);
  const remainingMins = mins % 60;
  return `${hours}h ${remainingMins}m`;
}
function isValidUrl(text) {
  if (!text || typeof text !== "string") return false;
  const trimmed = text.trim();
  try {
    const url = new URL(trimmed);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

// src/components/TransferDashboard.tsx
import { Fragment as Fragment4, jsx as jsx6, jsxs as jsxs6 } from "react/jsx-runtime";
var TransferDashboard = ({
  localDeviceInfo,
  peerDeviceInfo,
  files,
  texts,
  incomingOffer,
  onSendFiles,
  onSendText,
  onAcceptFile,
  onRejectFile,
  onCancelTransfer,
  autoAccept,
  onToggleAutoAccept,
  sessionRole = "host",
  onUploadCloudFallback
}) => {
  const fileInputRef = useRef3(null);
  const imageInputRef = useRef3(null);
  const folderInputRef = useRef3(null);
  const cloudFileInputRef = useRef3(null);
  const [isDraggingOver, setIsDraggingOver] = useState4(false);
  const [textInput, setTextInput] = useState4("");
  const [activeSubTab, setActiveSubTab] = useState4("files");
  const [copiedTextId, setCopiedTextId] = useState4(null);
  const [saveNotification, setSaveNotification] = useState4(null);
  const [hasAttemptedMobileAutoPick, setHasAttemptedMobileAutoPick] = useState4(false);
  const isMobile = localDeviceInfo.type === "mobile" || typeof navigator !== "undefined" && /android|iphone|ipad|ipod|mobile/i.test(navigator.userAgent);
  const hasFileSystemAccess = typeof window !== "undefined" && "showSaveFilePicker" in window;
  const isFolderSupported = typeof window !== "undefined" && "webkitdirectory" in document.createElement("input");
  useEffect3(() => {
    if (isMobile && !hasAttemptedMobileAutoPick && files.length === 0) {
      setHasAttemptedMobileAutoPick(true);
      try {
        if (fileInputRef.current) {
          if ("showPicker" in fileInputRef.current) {
            fileInputRef.current.showPicker();
          } else {
            fileInputRef.current.click();
          }
        }
      } catch {
      }
    }
  }, [isMobile, hasAttemptedMobileAutoPick, files.length]);
  useEffect3(() => {
    let dragCounter = 0;
    const handleDragEnter = (e) => {
      e.preventDefault();
      dragCounter++;
      if (e.dataTransfer && e.dataTransfer.types.includes("Files")) {
        setIsDraggingOver(true);
      }
    };
    const handleDragLeave = (e) => {
      e.preventDefault();
      dragCounter--;
      if (dragCounter <= 0) {
        setIsDraggingOver(false);
      }
    };
    const handleDragOver = (e) => {
      e.preventDefault();
    };
    const handleDrop = (e) => {
      e.preventDefault();
      dragCounter = 0;
      setIsDraggingOver(false);
      if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        onSendFiles(e.dataTransfer.files);
      }
    };
    window.addEventListener("dragenter", handleDragEnter);
    window.addEventListener("dragleave", handleDragLeave);
    window.addEventListener("dragover", handleDragOver);
    window.addEventListener("drop", handleDrop);
    return () => {
      window.removeEventListener("dragenter", handleDragEnter);
      window.removeEventListener("dragleave", handleDragLeave);
      window.removeEventListener("dragover", handleDragOver);
      window.removeEventListener("drop", handleDrop);
    };
  }, [onSendFiles]);
  const handleTextSubmit = (e) => {
    e.preventDefault();
    if (!textInput.trim()) return;
    onSendText(textInput.trim());
    setTextInput("");
  };
  const handleCopyText = async (id, text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedTextId(id);
      setTimeout(() => setCopiedTextId(null), 2e3);
    } catch {
    }
  };
  const handleSaveWithSystemPicker = async (item) => {
    if (!item.blobUrl) return;
    if (!hasFileSystemAccess) {
      triggerAnchorDownload(item);
      return;
    }
    try {
      const ext = item.name.includes(".") ? "." + item.name.split(".").pop() : "";
      const handle = await window.showSaveFilePicker({
        suggestedName: item.name,
        types: [
          {
            description: "QuickDrop Received File",
            accept: {
              [item.type || "application/octet-stream"]: ext ? [ext] : []
            }
          }
        ]
      });
      const writable = await handle.createWritable();
      const response = await fetch(item.blobUrl);
      const blob = await response.blob();
      await writable.write(blob);
      await writable.close();
      setSaveNotification({
        message: `\u062A\u0645 \u062D\u0641\u0638 "${item.name}" \u0628\u0646\u062C\u0627\u062D \u0641\u064A \u0627\u0644\u0645\u0633\u0627\u0631 \u0627\u0644\u0630\u064A \u062D\u062F\u062F\u062A\u0647! \u2705`,
        type: "success"
      });
      setTimeout(() => setSaveNotification(null), 4e3);
    } catch (err) {
      if (err.name === "AbortError") {
        return;
      }
      console.warn("showSaveFilePicker failed or restricted, using direct download:", err);
      triggerAnchorDownload(item);
    }
  };
  const triggerAnchorDownload = (item) => {
    if (!item.blobUrl) return;
    try {
      const a = document.createElement("a");
      a.href = item.blobUrl;
      a.download = item.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setSaveNotification({
        message: `\u062A\u0645 \u062A\u0646\u0632\u064A\u0644 "${item.name}" \u062A\u0644\u0642\u0627\u0626\u064A\u0627\u064B \u0625\u0644\u0649 \u0645\u062C\u0644\u062F \u0627\u0644\u062A\u0646\u0632\u064A\u0644\u0627\u062A! \u{1F4E5}`,
        type: "success"
      });
      setTimeout(() => setSaveNotification(null), 4e3);
    } catch (err) {
      console.error("Anchor download error:", err);
    }
  };
  const getFileIcon = (mimeType) => {
    if (mimeType.startsWith("image/")) return /* @__PURE__ */ jsx6(ImageIcon, { className: "w-5 h-5 text-blue-500" });
    if (mimeType.startsWith("video/")) return /* @__PURE__ */ jsx6(Film, { className: "w-5 h-5 text-purple-500" });
    if (mimeType.startsWith("audio/")) return /* @__PURE__ */ jsx6(Music, { className: "w-5 h-5 text-pink-500" });
    if (mimeType.includes("pdf")) return /* @__PURE__ */ jsx6(FileText, { className: "w-5 h-5 text-rose-500" });
    if (mimeType.includes("zip") || mimeType.includes("tar") || mimeType.includes("rar") || mimeType.includes("compressed")) {
      return /* @__PURE__ */ jsx6(Archive, { className: "w-5 h-5 text-amber-500" });
    }
    return /* @__PURE__ */ jsx6(File, { className: "w-5 h-5 text-zinc-500" });
  };
  return /* @__PURE__ */ jsxs6("div", { className: "max-w-4xl mx-auto px-4 py-6 space-y-6", children: [
    isDraggingOver && /* @__PURE__ */ jsxs6("div", { className: "fixed inset-0 z-50 bg-blue-600/90 backdrop-blur-xs flex flex-col items-center justify-center text-white pointer-events-none animate-in fade-in duration-150", children: [
      /* @__PURE__ */ jsx6(UploadCloud, { className: "w-20 h-20 animate-bounce mb-4" }),
      /* @__PURE__ */ jsx6("h2", { className: "text-3xl font-extrabold tracking-tight", children: "Drop files to send" }),
      /* @__PURE__ */ jsxs6("p", { className: "text-blue-100 text-sm mt-2", children: [
        "Files will stream directly to ",
        peerDeviceInfo?.name || "peer",
        " via WebRTC"
      ] })
    ] }),
    /* @__PURE__ */ jsxs6("div", { className: "p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4", children: [
      /* @__PURE__ */ jsxs6("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsx6("div", { className: "w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-500/20", children: peerDeviceInfo?.type === "mobile" ? /* @__PURE__ */ jsx6(Smartphone3, { className: "w-5 h-5" }) : /* @__PURE__ */ jsx6(Laptop2, { className: "w-5 h-5" }) }),
        /* @__PURE__ */ jsxs6("div", { children: [
          /* @__PURE__ */ jsxs6("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx6("span", { className: "text-xs text-zinc-500 dark:text-zinc-400", children: "\u0645\u062A\u0635\u0644 \u0628\u0640" }),
            /* @__PURE__ */ jsx6("span", { className: "w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" })
          ] }),
          /* @__PURE__ */ jsx6("h2", { className: "text-base font-bold text-zinc-900 dark:text-zinc-100", children: peerDeviceInfo?.name || "\u0627\u0644\u062C\u0647\u0627\u0632 \u0627\u0644\u0645\u0642\u062A\u0631\u0646 (Connected Peer)" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs6("label", { className: "flex items-center gap-2 text-xs text-zinc-600 dark:text-zinc-400 cursor-pointer select-none", children: [
        /* @__PURE__ */ jsx6(
          "input",
          {
            type: "checkbox",
            checked: autoAccept,
            onChange: (e) => onToggleAutoAccept(e.target.checked),
            className: "w-4 h-4 rounded text-blue-600 focus:ring-blue-500 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 cursor-pointer",
            id: "auto-accept-checkbox"
          }
        ),
        /* @__PURE__ */ jsx6("span", { className: "font-medium", children: "\u0642\u0628\u0648\u0644 \u0648\u062A\u0646\u0632\u064A\u0644 \u0627\u0644\u0645\u0644\u0641\u0627\u062A \u062A\u0644\u0642\u0627\u0626\u064A\u0627\u064B (Auto-Accept)" })
      ] })
    ] }),
    saveNotification && /* @__PURE__ */ jsxs6("div", { className: "p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs sm:text-sm flex items-center justify-between shadow-md animate-in fade-in slide-in-from-top-2", children: [
      /* @__PURE__ */ jsxs6("div", { className: "flex items-center gap-2.5", children: [
        /* @__PURE__ */ jsx6(CheckCircle2, { className: "w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" }),
        /* @__PURE__ */ jsx6("span", { className: "font-medium", children: saveNotification.message })
      ] }),
      /* @__PURE__ */ jsx6(
        "button",
        {
          onClick: () => setSaveNotification(null),
          className: "text-emerald-600 hover:text-emerald-800 p-1 cursor-pointer",
          children: /* @__PURE__ */ jsx6(X4, { className: "w-4 h-4" })
        }
      )
    ] }),
    isMobile && /* @__PURE__ */ jsxs6("div", { className: "p-5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-xl space-y-3.5 border border-blue-400/30 animate-in fade-in slide-in-from-top-2", children: [
      /* @__PURE__ */ jsxs6("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxs6("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx6("span", { className: "w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" }),
          /* @__PURE__ */ jsx6("span", { className: "text-xs font-bold uppercase tracking-wider text-blue-100", children: "\u0627\u0642\u062A\u0631\u0627\u0646 \u0646\u0627\u062C\u062D \u0628\u0627\u0644\u0643\u0645\u0628\u064A\u0648\u062A\u0631 \u26A1" })
        ] }),
        /* @__PURE__ */ jsx6("span", { className: "text-xs font-semibold text-blue-100 bg-white/20 px-2.5 py-0.5 rounded-full", children: peerDeviceInfo?.name || "\u0627\u0644\u0643\u0645\u0628\u064A\u0648\u062A\u0631" })
      ] }),
      /* @__PURE__ */ jsxs6("div", { children: [
        /* @__PURE__ */ jsx6("h3", { className: "text-base sm:text-lg font-bold text-white", children: "\u0627\u062E\u062A\u0631 \u0627\u0644\u0645\u0644\u0641\u0627\u062A \u0623\u0648 \u0627\u0644\u0635\u0648\u0631 \u0644\u0625\u0631\u0633\u0627\u0644\u0647\u0627 \u0641\u0648\u0631\u0627\u064B \u0625\u0644\u0649 \u0627\u0644\u0643\u0645\u0628\u064A\u0648\u062A\u0631 \u{1F4E4}" }),
        /* @__PURE__ */ jsx6("p", { className: "text-xs text-blue-100 mt-1 leading-relaxed", children: "\u0627\u0636\u063A\u0637 \u0639\u0644\u0649 \u0627\u0644\u0632\u0631 \u0623\u062F\u0646\u0627\u0647 \u0644\u0627\u062E\u062A\u064A\u0627\u0631 \u0627\u0644\u0645\u0644\u0641\u0627\u062A \u0645\u0646 \u0647\u0627\u062A\u0641\u0643\u061B \u0633\u064A\u0628\u062F\u0623 \u0627\u0644\u0646\u0642\u0644 \u0627\u0644\u0645\u0628\u0627\u0634\u0631 \u0648\u0627\u0644\u0633\u0631\u064A\u0639 \u062A\u0644\u0642\u0627\u0626\u064A\u0627\u064B \u062F\u0648\u0646 \u0623\u064A \u062E\u0637\u0648\u0627\u062A \u0625\u0636\u0627\u0641\u064A\u0629!" })
      ] }),
      /* @__PURE__ */ jsxs6(
        "button",
        {
          type: "button",
          onClick: () => fileInputRef.current?.click(),
          className: "w-full py-4 px-5 rounded-xl bg-white hover:bg-blue-50 active:scale-[0.99] text-blue-700 font-extrabold text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-lg transition-all cursor-pointer",
          id: "mobile-instant-file-picker-btn",
          children: [
            /* @__PURE__ */ jsx6(FolderUp, { className: "w-5 h-5 text-blue-600 animate-bounce" }),
            /* @__PURE__ */ jsx6("span", { children: "\u{1F4C1} \u0641\u062A\u062D \u0627\u0644\u0627\u0633\u062A\u0648\u062F\u064A\u0648 \u0648\u0627\u0644\u0645\u0644\u0641\u0627\u062A \u0644\u0644\u0625\u0631\u0633\u0627\u0644 \u0627\u0644\u0641\u0648\u0631\u064A \u26A1" })
          ]
        }
      )
    ] }),
    incomingOffer && !autoAccept && /* @__PURE__ */ jsx6("div", { className: "p-5 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 shadow-lg animate-in fade-in slide-in-from-top-2 duration-200", children: /* @__PURE__ */ jsxs6("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4", children: [
      /* @__PURE__ */ jsxs6("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsx6("div", { className: "w-12 h-12 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0", children: getFileIcon(incomingOffer.type) }),
        /* @__PURE__ */ jsxs6("div", { className: "space-y-0.5", children: [
          /* @__PURE__ */ jsxs6("div", { className: "flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsx6("span", { className: "text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400", children: "\u0645\u0644\u0641 \u0648\u0627\u0631\u062F" }),
            /* @__PURE__ */ jsx6("span", { className: "text-xs text-zinc-400", children: "\u2022" }),
            /* @__PURE__ */ jsxs6("span", { className: "text-xs text-zinc-500 dark:text-zinc-400", children: [
              "\u0645\u0646 ",
              peerDeviceInfo?.name || "peer"
            ] })
          ] }),
          /* @__PURE__ */ jsx6("div", { className: "font-semibold text-sm text-zinc-900 dark:text-zinc-100 truncate max-w-sm", children: incomingOffer.name }),
          /* @__PURE__ */ jsx6("div", { className: "text-xs text-zinc-500 dark:text-zinc-400", children: formatBytes(incomingOffer.size) })
        ] })
      ] }),
      /* @__PURE__ */ jsxs6("div", { className: "flex items-center gap-2 self-end sm:self-center", children: [
        /* @__PURE__ */ jsx6(
          "button",
          {
            onClick: () => onRejectFile(incomingOffer.id),
            className: "px-4 py-2 rounded-xl text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors",
            id: "reject-file-btn",
            children: "\u0631\u0641\u0636"
          }
        ),
        /* @__PURE__ */ jsx6(
          "button",
          {
            onClick: () => onAcceptFile(incomingOffer),
            className: "px-5 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-colors",
            id: "accept-file-btn",
            children: "\u0642\u0628\u0648\u0644 \u0648\u0627\u0633\u062A\u0644\u0627\u0645"
          }
        )
      ] })
    ] }) }),
    /* @__PURE__ */ jsxs6("div", { className: "flex items-center gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-2", children: [
      /* @__PURE__ */ jsxs6(
        "button",
        {
          onClick: () => setActiveSubTab("files"),
          className: `px-4 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center gap-2 ${activeSubTab === "files" ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900" : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"}`,
          children: [
            /* @__PURE__ */ jsx6(File, { className: "w-4 h-4" }),
            /* @__PURE__ */ jsxs6("span", { children: [
              "\u0627\u0644\u0645\u0644\u0641\u0627\u062A (",
              files.length,
              ")"
            ] })
          ]
        }
      ),
      /* @__PURE__ */ jsxs6(
        "button",
        {
          onClick: () => setActiveSubTab("text"),
          className: `px-4 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center gap-2 ${activeSubTab === "text" ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900" : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"}`,
          children: [
            /* @__PURE__ */ jsx6(Send, { className: "w-4 h-4" }),
            /* @__PURE__ */ jsxs6("span", { children: [
              "\u0646\u0635\u0648\u0635 \u0648\u0631\u0648\u0627\u0628\u0637 (",
              texts.length,
              ")"
            ] })
          ]
        }
      )
    ] }),
    activeSubTab === "files" && /* @__PURE__ */ jsxs6("div", { className: "space-y-6", children: [
      /* @__PURE__ */ jsx6(
        "div",
        {
          onClick: () => fileInputRef.current?.click(),
          className: "group relative border-2 border-dashed border-zinc-300 dark:border-zinc-700 hover:border-blue-500 dark:hover:border-blue-500 rounded-3xl p-8 sm:p-12 text-center bg-white dark:bg-zinc-900/60 hover:bg-blue-50/20 dark:hover:bg-blue-950/20 transition-all cursor-pointer shadow-2xs",
          children: /* @__PURE__ */ jsxs6("div", { className: "max-w-md mx-auto space-y-4", children: [
            /* @__PURE__ */ jsx6("div", { className: "w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 mx-auto flex items-center justify-center border border-blue-100 dark:border-blue-900/60 group-hover:scale-105 transition-transform", children: /* @__PURE__ */ jsx6(UploadCloud, { className: "w-8 h-8" }) }),
            /* @__PURE__ */ jsxs6("div", { children: [
              /* @__PURE__ */ jsx6("h3", { className: "text-base font-bold text-zinc-900 dark:text-zinc-100", children: isMobile ? "\u0627\u0636\u063A\u0637 \u0644\u0627\u062E\u062A\u064A\u0627\u0631 \u0627\u0644\u0635\u0648\u0631 \u0648\u0627\u0644\u0645\u0644\u0641\u0627\u062A" : "\u0627\u0636\u063A\u0637 \u0644\u0627\u062E\u062A\u064A\u0627\u0631 \u0627\u0644\u0645\u0644\u0641\u0627\u062A \u0623\u0648 \u0627\u0633\u062D\u0628\u0647\u0627 \u0647\u0646\u0627" }),
              /* @__PURE__ */ jsx6("p", { className: "text-xs text-zinc-500 dark:text-zinc-400 mt-1", children: "\u0625\u0631\u0633\u0627\u0644 \u0645\u0628\u0627\u0634\u0631 \u0648\u0645\u0634\u0641\u0631 P2P \u0639\u0628\u0631 WebRTC \u0628\u0633\u0631\u0639\u0629 \u0627\u0644\u0634\u0628\u0643\u0629 \u0627\u0644\u0645\u062D\u0644\u064A\u0629 \u0627\u0644\u0643\u0627\u0645\u0644\u0629" })
            ] }),
            /* @__PURE__ */ jsxs6("div", { className: "flex flex-wrap items-center justify-center gap-2 pt-2", onClick: (e) => e.stopPropagation(), children: [
              /* @__PURE__ */ jsxs6(
                "button",
                {
                  onClick: () => fileInputRef.current?.click(),
                  className: "px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs shadow-sm transition-colors flex items-center gap-1.5 focus:outline-none cursor-pointer",
                  id: "select-files-btn",
                  children: [
                    /* @__PURE__ */ jsx6(File, { className: "w-3.5 h-3.5" }),
                    /* @__PURE__ */ jsx6("span", { children: "\u062A\u062D\u062F\u064A\u062F \u0645\u0644\u0641\u0627\u062A" })
                  ]
                }
              ),
              /* @__PURE__ */ jsxs6(
                "button",
                {
                  onClick: () => imageInputRef.current?.click(),
                  className: "px-4 py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 font-medium text-xs border border-zinc-200 dark:border-zinc-700 transition-colors flex items-center gap-1.5 focus:outline-none cursor-pointer",
                  id: "select-images-btn",
                  children: [
                    /* @__PURE__ */ jsx6(ImageIcon, { className: "w-3.5 h-3.5 text-blue-500" }),
                    /* @__PURE__ */ jsx6("span", { children: "\u0635\u0648\u0631 \u0648\u0641\u064A\u062F\u064A\u0648\u0647\u0627\u062A" })
                  ]
                }
              ),
              isFolderSupported && /* @__PURE__ */ jsxs6(
                "button",
                {
                  onClick: () => folderInputRef.current?.click(),
                  className: "px-4 py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 font-medium text-xs border border-zinc-200 dark:border-zinc-700 transition-colors flex items-center gap-1.5 focus:outline-none cursor-pointer",
                  id: "select-folder-btn",
                  children: [
                    /* @__PURE__ */ jsx6(FolderUp, { className: "w-3.5 h-3.5 text-amber-500" }),
                    /* @__PURE__ */ jsx6("span", { children: "\u0645\u062C\u0644\u062F \u0643\u0627\u0645\u0644" })
                  ]
                }
              ),
              onUploadCloudFallback && /* @__PURE__ */ jsxs6(
                "button",
                {
                  onClick: () => cloudFileInputRef.current?.click(),
                  className: "px-3.5 py-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/40 hover:bg-purple-100 dark:hover:bg-purple-900/60 text-purple-700 dark:text-purple-300 font-medium text-xs border border-purple-200 dark:border-purple-800 transition-colors flex items-center gap-1.5 focus:outline-none cursor-pointer",
                  title: "\u0631\u0641\u0639 \u0648\u062A\u0645\u0631\u064A\u0631 \u0627\u0644\u0645\u0644\u0641 \u0639\u0628\u0631 Supabase Storage \u0643\u0628\u062F\u064A\u0644 \u0625\u0630\u0627 \u062A\u0639\u0630\u0631 P2P",
                  children: [
                    /* @__PURE__ */ jsx6(CloudUpload, { className: "w-3.5 h-3.5 text-purple-500" }),
                    /* @__PURE__ */ jsx6("span", { children: "\u0631\u0641\u0639 \u0633\u062D\u0627\u0628\u064A (Cloud Relay)" })
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsx6(
              "input",
              {
                ref: fileInputRef,
                type: "file",
                multiple: true,
                className: "hidden",
                onChange: (e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    onSendFiles(e.target.files);
                    e.target.value = "";
                  }
                }
              }
            ),
            /* @__PURE__ */ jsx6(
              "input",
              {
                ref: imageInputRef,
                type: "file",
                multiple: true,
                accept: "image/*,video/*",
                className: "hidden",
                onChange: (e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    onSendFiles(e.target.files);
                    e.target.value = "";
                  }
                }
              }
            ),
            isFolderSupported && /* @__PURE__ */ jsx6(
              "input",
              {
                ref: folderInputRef,
                type: "file",
                multiple: true,
                webkitdirectory: "",
                className: "hidden",
                onChange: (e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    onSendFiles(e.target.files);
                    e.target.value = "";
                  }
                }
              }
            ),
            onUploadCloudFallback && /* @__PURE__ */ jsx6(
              "input",
              {
                ref: cloudFileInputRef,
                type: "file",
                className: "hidden",
                onChange: (e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    onUploadCloudFallback(e.target.files[0]);
                    e.target.value = "";
                  }
                }
              }
            )
          ] })
        }
      ),
      files.length > 0 && /* @__PURE__ */ jsxs6("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxs6("h4", { className: "text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400", children: [
          "\u0642\u0627\u0626\u0645\u0629 \u0627\u0644\u0646\u0642\u0644 \u0648\u0627\u0644\u0645\u0644\u0641\u0627\u062A (",
          files.length,
          ")"
        ] }),
        /* @__PURE__ */ jsx6("div", { className: "space-y-2.5", children: files.map((item) => /* @__PURE__ */ jsxs6(
          "div",
          {
            className: "p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xs space-y-3",
            children: [
              /* @__PURE__ */ jsxs6("div", { className: "flex items-center justify-between gap-3", children: [
                /* @__PURE__ */ jsxs6("div", { className: "flex items-center gap-3 min-w-0", children: [
                  /* @__PURE__ */ jsx6("div", { className: "w-9 h-9 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center shrink-0", children: getFileIcon(item.type) }),
                  /* @__PURE__ */ jsxs6("div", { className: "min-w-0", children: [
                    /* @__PURE__ */ jsxs6("div", { className: "flex items-center gap-1.5", children: [
                      /* @__PURE__ */ jsx6("span", { className: "font-semibold text-sm text-zinc-900 dark:text-zinc-100 truncate max-w-xs sm:max-w-md", children: item.name }),
                      item.isIncoming ? /* @__PURE__ */ jsxs6("span", { className: "inline-flex items-center gap-0.5 text-[10px] text-cyan-600 dark:text-cyan-400 font-medium", children: [
                        /* @__PURE__ */ jsx6(ArrowDownLeft, { className: "w-3 h-3" }),
                        " \u0645\u0633\u062A\u0644\u0645"
                      ] }) : /* @__PURE__ */ jsxs6("span", { className: "inline-flex items-center gap-0.5 text-[10px] text-blue-600 dark:text-blue-400 font-medium", children: [
                        /* @__PURE__ */ jsx6(ArrowUpRight, { className: "w-3 h-3" }),
                        " \u0645\u0631\u0633\u0644"
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxs6("div", { className: "text-xs text-zinc-500 dark:text-zinc-400 flex items-center gap-2", children: [
                      /* @__PURE__ */ jsx6("span", { children: formatBytes(item.size) }),
                      item.state === "transferring" && /* @__PURE__ */ jsxs6(Fragment4, { children: [
                        /* @__PURE__ */ jsx6("span", { children: "\u2022" }),
                        /* @__PURE__ */ jsx6("span", { className: "text-blue-600 dark:text-blue-400 font-medium", children: formatSpeed(item.speed) }),
                        /* @__PURE__ */ jsx6("span", { children: "\u2022" }),
                        /* @__PURE__ */ jsxs6("span", { children: [
                          formatEta(item.eta),
                          " remaining"
                        ] })
                      ] })
                    ] })
                  ] })
                ] }),
                /* @__PURE__ */ jsxs6("div", { className: "flex items-center gap-2 shrink-0", children: [
                  item.state === "completed" && /* @__PURE__ */ jsxs6("div", { className: "flex items-center gap-2", children: [
                    /* @__PURE__ */ jsxs6("span", { className: "hidden sm:inline-flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-medium", children: [
                      /* @__PURE__ */ jsx6(CheckCircle2, { className: "w-4 h-4" }),
                      /* @__PURE__ */ jsx6("span", { children: "\u0645\u0643\u062A\u0645\u0644" })
                    ] }),
                    hasFileSystemAccess && item.blobUrl && /* @__PURE__ */ jsxs6(
                      "button",
                      {
                        type: "button",
                        onClick: () => handleSaveWithSystemPicker(item),
                        className: "px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer",
                        title: "\u0641\u062A\u062D \u0646\u0627\u0641\u0630\u0629 \u0645\u0633\u062A\u0643\u0634\u0641 \u0627\u0644\u0645\u0644\u0641\u0627\u062A \u0644\u062A\u062D\u062F\u064A\u062F \u0645\u062C\u0644\u062F \u0648\u0627\u0633\u0645 \u0627\u0644\u062D\u0641\u0638 (Save As...)",
                        children: [
                          /* @__PURE__ */ jsx6(HardDrive, { className: "w-3.5 h-3.5" }),
                          /* @__PURE__ */ jsx6("span", { children: "\u062D\u0641\u0638 \u0641\u064A \u0645\u062C\u0644\u062F (Save As)" })
                        ]
                      }
                    ),
                    item.blobUrl && /* @__PURE__ */ jsxs6(
                      "button",
                      {
                        type: "button",
                        onClick: () => triggerAnchorDownload(item),
                        className: "px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium flex items-center gap-1 shadow-xs transition-colors cursor-pointer",
                        children: [
                          /* @__PURE__ */ jsx6(Download, { className: "w-3 h-3" }),
                          /* @__PURE__ */ jsx6("span", { children: hasFileSystemAccess ? "\u062A\u0646\u0632\u064A\u0644 \u0639\u0627\u062F\u064A" : "\u062D\u0641\u0638" })
                        ]
                      }
                    )
                  ] }),
                  item.state === "transferring" && /* @__PURE__ */ jsx6(
                    "button",
                    {
                      onClick: () => onCancelTransfer(item.id),
                      className: "p-1.5 rounded-lg text-zinc-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer",
                      title: "\u0625\u0644\u063A\u0627\u0621 \u0627\u0644\u0646\u0642\u0644",
                      children: /* @__PURE__ */ jsx6(X4, { className: "w-4 h-4" })
                    }
                  ),
                  item.state === "failed" && /* @__PURE__ */ jsxs6("span", { className: "inline-flex items-center gap-1 text-xs text-rose-600 dark:text-rose-400 font-medium", children: [
                    /* @__PURE__ */ jsx6(AlertCircle3, { className: "w-3.5 h-3.5" }),
                    /* @__PURE__ */ jsx6("span", { children: "\u0641\u0634\u0644" })
                  ] }),
                  item.state === "cancelled" && /* @__PURE__ */ jsx6("span", { className: "text-xs text-zinc-500", children: "\u062A\u0645 \u0627\u0644\u0625\u0644\u063A\u0627\u0621" }),
                  item.state === "verifying" && /* @__PURE__ */ jsx6("span", { className: "text-xs text-amber-500 animate-pulse", children: "\u0641\u062D\u0635 \u0627\u0644\u062A\u0637\u0627\u0628\u0642..." })
                ] })
              ] }),
              (item.state === "transferring" || item.state === "preparing" || item.state === "verifying") && /* @__PURE__ */ jsxs6("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsx6("div", { className: "w-full h-2 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden", children: /* @__PURE__ */ jsx6(
                  "div",
                  {
                    className: "h-full bg-blue-600 rounded-full transition-all duration-200",
                    style: { width: `${item.progress}%` }
                  }
                ) }),
                /* @__PURE__ */ jsxs6("div", { className: "flex items-center justify-between text-[11px] text-zinc-500 dark:text-zinc-400 font-mono", children: [
                  /* @__PURE__ */ jsxs6("span", { children: [
                    formatBytes(item.transferredBytes),
                    " / ",
                    formatBytes(item.size)
                  ] }),
                  /* @__PURE__ */ jsxs6("span", { children: [
                    item.progress,
                    "%"
                  ] })
                ] })
              ] }),
              item.sha256 && /* @__PURE__ */ jsxs6("div", { className: "flex items-center gap-1.5 text-[11px] text-zinc-400 font-mono truncate pt-1 border-t border-zinc-100 dark:border-zinc-800/80", children: [
                /* @__PURE__ */ jsx6(ShieldCheck3, { className: "w-3.5 h-3.5 text-emerald-500 shrink-0" }),
                /* @__PURE__ */ jsxs6("span", { className: "truncate", children: [
                  "SHA-256: ",
                  item.sha256
                ] })
              ] })
            ]
          },
          item.id
        )) })
      ] })
    ] }),
    activeSubTab === "text" && /* @__PURE__ */ jsxs6("div", { className: "space-y-6", children: [
      /* @__PURE__ */ jsxs6("form", { onSubmit: handleTextSubmit, className: "p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-3", children: [
        /* @__PURE__ */ jsx6("label", { className: "block text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400", children: "\u0625\u0631\u0633\u0627\u0644 \u0646\u0635\u060C \u0643\u0648\u062F\u060C \u0623\u0648 \u0631\u0627\u0628\u0637" }),
        /* @__PURE__ */ jsx6(
          "textarea",
          {
            value: textInput,
            onChange: (e) => setTextInput(e.target.value),
            placeholder: "\u0623\u0644\u0635\u0642 \u0623\u064A \u0646\u0635 \u0647\u0646\u0627: \u0645\u0644\u0627\u062D\u0638\u0627\u062A\u060C \u0631\u0648\u0627\u0628\u0637\u060C \u0623\u0643\u0648\u0627\u062F...",
            rows: 3,
            className: "w-full p-3 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none font-sans",
            id: "text-message-textarea"
          }
        ),
        /* @__PURE__ */ jsxs6("div", { className: "flex items-center justify-between", children: [
          isValidUrl(textInput) ? /* @__PURE__ */ jsxs6("div", { className: "flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 font-medium", children: [
            /* @__PURE__ */ jsx6(LinkIcon, { className: "w-3.5 h-3.5" }),
            /* @__PURE__ */ jsx6("span", { children: "\u062A\u0645 \u0627\u0643\u062A\u0634\u0627\u0641 \u0631\u0627\u0628\u0637 \u0635\u0627\u0644\u062D" })
          ] }) : /* @__PURE__ */ jsx6("span", { className: "text-xs text-zinc-400", children: "\u0646\u0642\u0644 \u0645\u0628\u0627\u0634\u0631 \u0641\u0648\u0631\u064A" }),
          /* @__PURE__ */ jsxs6(
            "button",
            {
              type: "submit",
              disabled: !textInput.trim(),
              className: "px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-sm transition-colors flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer",
              id: "send-text-btn",
              children: [
                /* @__PURE__ */ jsx6(Send, { className: "w-3.5 h-3.5" }),
                /* @__PURE__ */ jsx6("span", { children: "\u0625\u0631\u0633\u0627\u0644" })
              ]
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs6("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxs6("h4", { className: "text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400", children: [
          "\u0627\u0644\u0646\u0635\u0648\u0635 \u0627\u0644\u0645\u0634\u062A\u0631\u0643\u0629 (",
          texts.length,
          ")"
        ] }),
        texts.length === 0 ? /* @__PURE__ */ jsx6("div", { className: "p-8 text-center rounded-xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-500", children: "\u0644\u0645 \u064A\u062A\u0645 \u0625\u0631\u0633\u0627\u0644 \u0623\u0648 \u0627\u0633\u062A\u0644\u0627\u0645 \u0623\u064A \u0631\u0633\u0627\u0626\u0644 \u0646\u0635\u064A\u0629 \u0641\u064A \u0647\u0630\u0647 \u0627\u0644\u062C\u0644\u0633\u0629 \u0628\u0639\u062F." }) : /* @__PURE__ */ jsx6("div", { className: "space-y-2.5", children: texts.map((item) => /* @__PURE__ */ jsxs6(
          "div",
          {
            className: "p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xs space-y-2.5",
            children: [
              /* @__PURE__ */ jsxs6("div", { className: "flex items-center justify-between text-xs text-zinc-500", children: [
                /* @__PURE__ */ jsx6("span", { className: "font-medium text-zinc-700 dark:text-zinc-300", children: item.isIncoming ? /* @__PURE__ */ jsxs6("span", { className: "text-cyan-600 dark:text-cyan-400", children: [
                  "\u0645\u0633\u062A\u0644\u0645 \u0645\u0646 ",
                  peerDeviceInfo?.name || "peer"
                ] }) : /* @__PURE__ */ jsx6("span", { className: "text-blue-600 dark:text-blue-400", children: "\u0645\u0631\u0633\u0644 \u0645\u0646 \u0647\u0630\u0627 \u0627\u0644\u062C\u0647\u0627\u0632" }) }),
                /* @__PURE__ */ jsx6("span", { children: new Date(item.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) })
              ] }),
              /* @__PURE__ */ jsx6("div", { className: "text-sm text-zinc-800 dark:text-zinc-200 whitespace-pre-wrap font-mono break-all p-3 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800/80 select-text", children: item.text }),
              /* @__PURE__ */ jsxs6("div", { className: "flex items-center justify-end gap-2 pt-1", children: [
                item.isUrl && /* @__PURE__ */ jsxs6(
                  "a",
                  {
                    href: item.text,
                    target: "_blank",
                    rel: "noopener noreferrer",
                    className: "px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs font-medium flex items-center gap-1 transition-colors",
                    children: [
                      /* @__PURE__ */ jsx6(ExternalLink2, { className: "w-3 h-3" }),
                      /* @__PURE__ */ jsx6("span", { children: "\u0641\u062A\u062D \u0627\u0644\u0631\u0627\u0628\u0637" })
                    ]
                  }
                ),
                /* @__PURE__ */ jsx6(
                  "button",
                  {
                    onClick: () => handleCopyText(item.id, item.text),
                    className: "px-3 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer",
                    children: copiedTextId === item.id ? /* @__PURE__ */ jsxs6(Fragment4, { children: [
                      /* @__PURE__ */ jsx6(Check2, { className: "w-3 h-3 text-emerald-500" }),
                      /* @__PURE__ */ jsx6("span", { children: "\u062A\u0645 \u0627\u0644\u0646\u0633\u062E" })
                    ] }) : /* @__PURE__ */ jsxs6(Fragment4, { children: [
                      /* @__PURE__ */ jsx6(Copy2, { className: "w-3 h-3" }),
                      /* @__PURE__ */ jsx6("span", { children: "\u0646\u0633\u062E" })
                    ] })
                  }
                )
              ] })
            ]
          },
          item.id
        )) })
      ] })
    ] })
  ] });
};

// src/components/HistoryView.tsx
import {
  History as History2,
  Trash2,
  CheckCircle2 as CheckCircle22,
  XCircle as XCircle2,
  AlertCircle as AlertCircle4,
  ArrowUpRight as ArrowUpRight2,
  ArrowDownLeft as ArrowDownLeft2,
  Download as Download2,
  File as File2
} from "lucide-react";
import { Fragment as Fragment5, jsx as jsx7, jsxs as jsxs7 } from "react/jsx-runtime";
var HistoryView = ({
  files,
  onClearHistory
}) => {
  return /* @__PURE__ */ jsxs7("div", { className: "max-w-4xl mx-auto px-4 py-8 space-y-6", children: [
    /* @__PURE__ */ jsxs7("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxs7("div", { children: [
        /* @__PURE__ */ jsxs7("h2", { className: "text-xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2", children: [
          /* @__PURE__ */ jsx7(History2, { className: "w-5 h-5 text-blue-600 dark:text-blue-400" }),
          /* @__PURE__ */ jsx7("span", { children: "Session Transfer History" })
        ] }),
        /* @__PURE__ */ jsx7("p", { className: "text-xs text-zinc-500 dark:text-zinc-400 mt-1", children: "History is ephemeral and strictly scoped to your current session." })
      ] }),
      files.length > 0 && /* @__PURE__ */ jsxs7(
        "button",
        {
          onClick: onClearHistory,
          className: "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 transition-colors",
          id: "clear-history-btn",
          children: [
            /* @__PURE__ */ jsx7(Trash2, { className: "w-3.5 h-3.5" }),
            /* @__PURE__ */ jsx7("span", { children: "Clear History" })
          ]
        }
      )
    ] }),
    files.length === 0 ? /* @__PURE__ */ jsxs7("div", { className: "p-12 text-center rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-3", children: [
      /* @__PURE__ */ jsx7("div", { className: "w-12 h-12 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-400 mx-auto flex items-center justify-center", children: /* @__PURE__ */ jsx7(History2, { className: "w-6 h-6" }) }),
      /* @__PURE__ */ jsx7("div", { className: "font-semibold text-sm text-zinc-800 dark:text-zinc-200", children: "No transfers in this session yet" }),
      /* @__PURE__ */ jsx7("p", { className: "text-xs text-zinc-500 max-w-sm mx-auto", children: "Once you send or receive files, their transfer metrics and SHA-256 verification records will appear here." })
    ] }) : /* @__PURE__ */ jsx7("div", { className: "bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-xs divide-y divide-zinc-200 dark:divide-zinc-800", children: files.map((item) => /* @__PURE__ */ jsxs7("div", { className: "p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3", children: [
      /* @__PURE__ */ jsxs7("div", { className: "flex items-start gap-3 min-w-0", children: [
        /* @__PURE__ */ jsx7("div", { className: "p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-500 shrink-0 mt-0.5", children: /* @__PURE__ */ jsx7(File2, { className: "w-4 h-4" }) }),
        /* @__PURE__ */ jsxs7("div", { className: "min-w-0", children: [
          /* @__PURE__ */ jsxs7("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx7("span", { className: "font-semibold text-sm text-zinc-900 dark:text-zinc-100 truncate", children: item.name }),
            item.isIncoming ? /* @__PURE__ */ jsxs7("span", { className: "inline-flex items-center gap-0.5 text-[10px] px-1.5 py-0.5 rounded bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 font-medium", children: [
              /* @__PURE__ */ jsx7(ArrowDownLeft2, { className: "w-3 h-3" }),
              " Received"
            ] }) : /* @__PURE__ */ jsxs7("span", { className: "inline-flex items-center gap-0.5 text-[10px] px-1.5 py-0.5 rounded bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-medium", children: [
              /* @__PURE__ */ jsx7(ArrowUpRight2, { className: "w-3 h-3" }),
              " Sent"
            ] })
          ] }),
          /* @__PURE__ */ jsxs7("div", { className: "text-xs text-zinc-500 dark:text-zinc-400 flex flex-wrap items-center gap-2 mt-0.5", children: [
            /* @__PURE__ */ jsx7("span", { children: formatBytes(item.size) }),
            item.endTime && /* @__PURE__ */ jsxs7(Fragment5, { children: [
              /* @__PURE__ */ jsx7("span", { children: "\u2022" }),
              /* @__PURE__ */ jsx7("span", { children: new Date(item.endTime).toLocaleTimeString() })
            ] }),
            item.sha256 && /* @__PURE__ */ jsxs7(Fragment5, { children: [
              /* @__PURE__ */ jsx7("span", { children: "\u2022" }),
              /* @__PURE__ */ jsxs7("span", { className: "font-mono text-[10px] text-zinc-400 truncate max-w-[140px] sm:max-w-xs", children: [
                "SHA-256: ",
                item.sha256.substring(0, 12),
                "..."
              ] })
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs7("div", { className: "flex items-center gap-3 shrink-0 self-end sm:self-center", children: [
        item.state === "completed" && /* @__PURE__ */ jsxs7("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxs7("span", { className: "inline-flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-medium", children: [
            /* @__PURE__ */ jsx7(CheckCircle22, { className: "w-4 h-4" }),
            /* @__PURE__ */ jsx7("span", { children: "Completed" })
          ] }),
          item.blobUrl && /* @__PURE__ */ jsx7(
            "a",
            {
              href: item.blobUrl,
              download: item.name,
              className: "p-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 transition-colors",
              title: "Download file",
              children: /* @__PURE__ */ jsx7(Download2, { className: "w-3.5 h-3.5" })
            }
          )
        ] }),
        item.state === "failed" && /* @__PURE__ */ jsxs7("span", { className: "inline-flex items-center gap-1 text-xs text-rose-600 dark:text-rose-400 font-medium", children: [
          /* @__PURE__ */ jsx7(AlertCircle4, { className: "w-4 h-4" }),
          /* @__PURE__ */ jsx7("span", { children: "Failed" })
        ] }),
        item.state === "cancelled" && /* @__PURE__ */ jsxs7("span", { className: "inline-flex items-center gap-1 text-xs text-zinc-500 font-medium", children: [
          /* @__PURE__ */ jsx7(XCircle2, { className: "w-4 h-4" }),
          /* @__PURE__ */ jsx7("span", { children: "Cancelled" })
        ] })
      ] })
    ] }, item.id)) })
  ] });
};

// src/components/PrivacyView.tsx
import { ShieldCheck as ShieldCheck5, Lock as Lock2, Server, EyeOff, KeyRound as KeyRound3, Cpu, CheckCircle } from "lucide-react";
import { jsx as jsx8, jsxs as jsxs8 } from "react/jsx-runtime";
var PrivacyView = () => {
  return /* @__PURE__ */ jsxs8("div", { className: "max-w-3xl mx-auto px-4 py-8 space-y-8", children: [
    /* @__PURE__ */ jsxs8("div", { className: "space-y-2 text-center sm:text-left", children: [
      /* @__PURE__ */ jsxs8("div", { className: "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/80", children: [
        /* @__PURE__ */ jsx8(ShieldCheck5, { className: "w-3.5 h-3.5" }),
        /* @__PURE__ */ jsx8("span", { children: "Privacy & Security Architecture" })
      ] }),
      /* @__PURE__ */ jsx8("h2", { className: "text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100", children: "How QuickDrop Protects Your Data" }),
      /* @__PURE__ */ jsx8("p", { className: "text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed", children: "QuickDrop was built with a privacy-first foundation. We believe file sharing should be direct, ephemeral, and free from third-party storage." })
    ] }),
    /* @__PURE__ */ jsxs8("div", { className: "p-4 sm:p-5 rounded-2xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 space-y-2", children: [
      /* @__PURE__ */ jsxs8("div", { className: "flex items-center gap-2 text-blue-900 dark:text-blue-300 font-semibold text-sm", children: [
        /* @__PURE__ */ jsx8(Lock2, { className: "w-4 h-4" }),
        /* @__PURE__ */ jsx8("span", { children: "Core Privacy Guarantee" })
      ] }),
      /* @__PURE__ */ jsx8("p", { className: "text-xs sm:text-sm text-blue-800/90 dark:text-blue-300/90 leading-relaxed", children: "QuickDrop does not store your files on our servers. Transfers use encrypted WebRTC connections. In some restrictive network conditions, WebRTC may use an encrypted relay server (TURN) to establish connectivity, but your file data is never saved or retained." })
    ] }),
    /* @__PURE__ */ jsxs8("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [
      /* @__PURE__ */ jsxs8("div", { className: "p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-2", children: [
        /* @__PURE__ */ jsx8("div", { className: "w-9 h-9 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 flex items-center justify-center", children: /* @__PURE__ */ jsx8(Server, { className: "w-5 h-5 text-blue-600 dark:text-blue-400" }) }),
        /* @__PURE__ */ jsx8("h3", { className: "font-bold text-sm text-zinc-900 dark:text-zinc-100", children: "Signaling vs. File Data Separation" }),
        /* @__PURE__ */ jsx8("p", { className: "text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed", children: "The signaling server only coordinates connection setup (SDP exchange, ICE candidates, and temporary tokens). File binary data is strictly blocked from the signaling channel and travels only through the direct WebRTC DataChannel." })
      ] }),
      /* @__PURE__ */ jsxs8("div", { className: "p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-2", children: [
        /* @__PURE__ */ jsx8("div", { className: "w-9 h-9 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 flex items-center justify-center", children: /* @__PURE__ */ jsx8(Cpu, { className: "w-5 h-5 text-emerald-600 dark:text-emerald-400" }) }),
        /* @__PURE__ */ jsx8("h3", { className: "font-bold text-sm text-zinc-900 dark:text-zinc-100", children: "End-to-End DTLS Encryption" }),
        /* @__PURE__ */ jsx8("p", { className: "text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed", children: "All WebRTC DataChannels are encrypted by standard using Datagram Transport Layer Security (DTLS). Data is encrypted on the sender's device and decrypted only on the receiver's device." })
      ] }),
      /* @__PURE__ */ jsxs8("div", { className: "p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-2", children: [
        /* @__PURE__ */ jsx8("div", { className: "w-9 h-9 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 flex items-center justify-center", children: /* @__PURE__ */ jsx8(KeyRound3, { className: "w-5 h-5 text-purple-600 dark:text-purple-400" }) }),
        /* @__PURE__ */ jsx8("h3", { className: "font-bold text-sm text-zinc-900 dark:text-zinc-100", children: "Ephemeral Pairing Tokens" }),
        /* @__PURE__ */ jsx8("p", { className: "text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed", children: "Pairing tokens are generated using cryptographically secure random bytes. Sessions expire automatically after 15 minutes or when either peer ends the session." })
      ] }),
      /* @__PURE__ */ jsxs8("div", { className: "p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-2", children: [
        /* @__PURE__ */ jsx8("div", { className: "w-9 h-9 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 flex items-center justify-center", children: /* @__PURE__ */ jsx8(EyeOff, { className: "w-5 h-5 text-amber-600 dark:text-amber-400" }) }),
        /* @__PURE__ */ jsx8("h3", { className: "font-bold text-sm text-zinc-900 dark:text-zinc-100", children: "Zero Tracking & Zero Accounts" }),
        /* @__PURE__ */ jsx8("p", { className: "text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed", children: "No registration, phone number, or email required. We don't employ persistent device fingerprinting, tracking pixels, or user activity profilers." })
      ] })
    ] }),
    /* @__PURE__ */ jsxs8("div", { className: "p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-4", children: [
      /* @__PURE__ */ jsx8("h3", { className: "font-bold text-sm text-zinc-900 dark:text-zinc-100", children: "What QuickDrop Collects & Retains" }),
      /* @__PURE__ */ jsxs8("ul", { className: "space-y-2 text-xs text-zinc-600 dark:text-zinc-400", children: [
        /* @__PURE__ */ jsxs8("li", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx8(CheckCircle, { className: "w-4 h-4 text-emerald-500 shrink-0" }),
          /* @__PURE__ */ jsxs8("span", { children: [
            /* @__PURE__ */ jsx8("strong", { children: "File Contents:" }),
            " Never stored or logged on any server."
          ] })
        ] }),
        /* @__PURE__ */ jsxs8("li", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx8(CheckCircle, { className: "w-4 h-4 text-emerald-500 shrink-0" }),
          /* @__PURE__ */ jsxs8("span", { children: [
            /* @__PURE__ */ jsx8("strong", { children: "File Names & Metadata:" }),
            " Handled in browser memory only during active session."
          ] })
        ] }),
        /* @__PURE__ */ jsxs8("li", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx8(CheckCircle, { className: "w-4 h-4 text-emerald-500 shrink-0" }),
          /* @__PURE__ */ jsxs8("span", { children: [
            /* @__PURE__ */ jsx8("strong", { children: "Session Identifiers:" }),
            " In-memory ephemeral records on the signaling server, destroyed upon expiry."
          ] })
        ] }),
        /* @__PURE__ */ jsxs8("li", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx8(CheckCircle, { className: "w-4 h-4 text-emerald-500 shrink-0" }),
          /* @__PURE__ */ jsxs8("span", { children: [
            /* @__PURE__ */ jsx8("strong", { children: "Device Names:" }),
            ' Temporary browser and OS labels (e.g., "Chrome on macOS") for peer recognition only.'
          ] })
        ] })
      ] })
    ] })
  ] });
};

// src/components/HelpView.tsx
import {
  HelpCircle as HelpCircle2,
  QrCode as QrCode2,
  Wifi as Wifi2,
  Smartphone as Smartphone4,
  ShieldAlert,
  HardDrive as HardDrive2
} from "lucide-react";
import { jsx as jsx9, jsxs as jsxs9 } from "react/jsx-runtime";
var HelpView = () => {
  const faqItems = [
    {
      icon: /* @__PURE__ */ jsx9(QrCode2, { className: "w-5 h-5 text-blue-500" }),
      title: "QR code won't scan",
      solution: "Increase the screen brightness on the displaying device and ensure there is no glare on the screen. If the camera still struggles to focus or permissions are denied, you can always click 'Join with Code' and enter the 8-character pairing code manually."
    },
    {
      icon: /* @__PURE__ */ jsx9(Wifi2, { className: "w-5 h-5 text-emerald-500" }),
      title: "Devices won't establish connection",
      solution: "Both devices must be connected to the internet to perform the initial WebRTC signaling handshake. If you are on an enterprise, university, or hospital Wi-Fi network, strict firewall rules may block direct peer-to-peer UDP traffic. Switching one device to a cellular hotspot or enabling a TURN relay server resolves this."
    },
    {
      icon: /* @__PURE__ */ jsx9(Smartphone4, { className: "w-5 h-5 text-purple-500" }),
      title: "How to save files on iPhone / iOS Safari",
      solution: "When an incoming file completes on iOS Safari, click 'Save'. iOS will present a download prompt or file preview. Tap the standard Share icon and choose 'Save to Files' (for documents, archives, or videos) or 'Save Image' (for photos)."
    },
    {
      icon: /* @__PURE__ */ jsx9(HardDrive2, { className: "w-5 h-5 text-amber-500" }),
      title: "Transfer is interrupted or slows down",
      solution: "Modern mobile operating systems aggressively throttle or suspend background browser tabs. Keep the QuickDrop browser tab active in the foreground on both devices until the transfer reaches 100% and SHA-256 verification completes."
    },
    {
      icon: /* @__PURE__ */ jsx9(ShieldAlert, { className: "w-5 h-5 text-rose-500" }),
      title: "Are transfers really private and secure?",
      solution: "Yes. QuickDrop establishes a direct, encrypted WebRTC DataChannel between devices using DTLS. The signaling server coordinates connection setup only; your actual file contents never pass through or get saved on any server."
    }
  ];
  return /* @__PURE__ */ jsxs9("div", { className: "max-w-3xl mx-auto px-4 py-8 space-y-8", children: [
    /* @__PURE__ */ jsxs9("div", { className: "space-y-2 text-center sm:text-left", children: [
      /* @__PURE__ */ jsxs9("div", { className: "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/80", children: [
        /* @__PURE__ */ jsx9(HelpCircle2, { className: "w-3.5 h-3.5" }),
        /* @__PURE__ */ jsx9("span", { children: "Troubleshooting & FAQ" })
      ] }),
      /* @__PURE__ */ jsx9("h2", { className: "text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100", children: "Help & Frequently Asked Questions" }),
      /* @__PURE__ */ jsx9("p", { className: "text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed", children: "Quick answers and solutions for common connection, transfer, and browser scenarios." })
    ] }),
    /* @__PURE__ */ jsx9("div", { className: "space-y-4", children: faqItems.map((item, idx) => /* @__PURE__ */ jsxs9(
      "div",
      {
        className: "p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-2",
        children: [
          /* @__PURE__ */ jsxs9("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsx9("div", { className: "p-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 shrink-0", children: item.icon }),
            /* @__PURE__ */ jsx9("h3", { className: "font-bold text-sm sm:text-base text-zinc-900 dark:text-zinc-100", children: item.title })
          ] }),
          /* @__PURE__ */ jsx9("p", { className: "text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 pl-11 leading-relaxed", children: item.solution })
        ]
      },
      idx
    )) }),
    /* @__PURE__ */ jsxs9("div", { className: "p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-500 dark:text-zinc-400 space-y-2", children: [
      /* @__PURE__ */ jsx9("div", { className: "font-semibold text-zinc-800 dark:text-zinc-200", children: "Advanced Network Information" }),
      /* @__PURE__ */ jsxs9("p", { className: "leading-relaxed", children: [
        "QuickDrop uses standard Google STUN servers (",
        /* @__PURE__ */ jsx9("code", { className: "font-mono text-[11px] bg-zinc-200 dark:bg-zinc-800 px-1 py-0.5 rounded", children: "stun:stun.l.google.com:19302" }),
        ") by default. If you are deploying in an enterprise environment with strict symmetric NATs, you can define custom ",
        /* @__PURE__ */ jsx9("code", { className: "font-mono text-[11px] bg-zinc-200 dark:bg-zinc-800 px-1 py-0.5 rounded", children: "TURN_SERVER_URL" }),
        ", ",
        /* @__PURE__ */ jsx9("code", { className: "font-mono text-[11px] bg-zinc-200 dark:bg-zinc-800 px-1 py-0.5 rounded", children: "TURN_USERNAME" }),
        ", and ",
        /* @__PURE__ */ jsx9("code", { className: "font-mono text-[11px] bg-zinc-200 dark:bg-zinc-800 px-1 py-0.5 rounded", children: "TURN_CREDENTIAL" }),
        " environment variables."
      ] })
    ] })
  ] });
};

// src/components/AuthView.tsx
import { useState as useState5, useEffect as useEffect4, useRef as useRef4 } from "react";
import {
  Lock as Lock3,
  Mail,
  User as User3,
  ArrowRight as ArrowRight3,
  KeyRound as KeyRound4,
  CheckCircle2 as CheckCircle23,
  AlertCircle as AlertCircle5,
  Eye,
  EyeOff as EyeOff2,
  Sparkles,
  RefreshCw as RefreshCw3,
  Send as Send2,
  ShieldCheck as ShieldCheck6
} from "lucide-react";

// src/lib/auth.ts
import { createClient } from "@supabase/supabase-js";
function getSupabaseCredentials() {
  const envUrl = (typeof import.meta !== "undefined" && import.meta.env ? import.meta.env.VITE_SUPABASE_URL : "") || "";
  const envKey = (typeof import.meta !== "undefined" && import.meta.env ? import.meta.env.VITE_SUPABASE_ANON_KEY : "") || "";
  let localUrl = "";
  let localKey = "";
  try {
    if (typeof localStorage !== "undefined") {
      localUrl = localStorage.getItem("quickdrop_supabase_url") || "";
      localKey = localStorage.getItem("quickdrop_supabase_anon_key") || "";
    }
  } catch {
  }
  const url = (envUrl || localUrl).trim();
  const anonKey = (envKey || localKey).trim();
  const isConfigured = Boolean(
    url && anonKey && !url.includes("your-project") && !anonKey.includes("your-anon-key")
  );
  return { url, anonKey, isConfigured };
}
function checkIsSupabaseConfigured() {
  return getSupabaseCredentials().isConfigured;
}
function saveSupabaseConfig(url, anonKey) {
  try {
    if (typeof localStorage !== "undefined") {
      localStorage.setItem("quickdrop_supabase_url", url.trim());
      localStorage.setItem("quickdrop_supabase_anon_key", anonKey.trim());
      supabaseInstance = null;
      return true;
    }
  } catch {
  }
  return false;
}
function clearSupabaseConfig() {
  try {
    if (typeof localStorage !== "undefined") {
      localStorage.removeItem("quickdrop_supabase_url");
      localStorage.removeItem("quickdrop_supabase_anon_key");
      supabaseInstance = null;
    }
  } catch {
  }
}
var isSupabaseConfigured = checkIsSupabaseConfigured();
var supabaseInstance = null;
function getSupabaseClient() {
  const { url, anonKey, isConfigured } = getSupabaseCredentials();
  if (!isConfigured) return null;
  if (!supabaseInstance) {
    supabaseInstance = createClient(url, anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    });
  }
  return supabaseInstance;
}
var STORAGE_LOCAL_USERS = "quickdrop_users_store";
var STORAGE_CURRENT_USER = "quickdrop_current_user_session";
var STORAGE_PENDING_VERIFICATION = "quickdrop_pending_verifications";
function getStoredUsers() {
  try {
    const raw = localStorage.getItem(STORAGE_LOCAL_USERS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
function saveStoredUsers(users) {
  localStorage.setItem(STORAGE_LOCAL_USERS, JSON.stringify(users));
}
function getPendingVerifications() {
  try {
    const raw = localStorage.getItem(STORAGE_PENDING_VERIFICATION);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
function savePendingVerifications(items) {
  localStorage.setItem(STORAGE_PENDING_VERIFICATION, JSON.stringify(items));
}
async function dispatchVerificationEmail(email, code) {
  if (typeof window === "undefined") return;
  try {
    await fetch("/api/auth/send-verification-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, code })
    });
  } catch (err) {
    console.warn("Could not dispatch verification email to server:", err);
  }
}
function mapSupabaseUser(user) {
  return {
    id: user.id,
    email: user.email || "",
    name: user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split("@")[0] || "User",
    avatarUrl: user.user_metadata?.avatar_url || "",
    deviceName: user.user_metadata?.device_name || "",
    createdAt: user.created_at,
    emailConfirmed: Boolean(user.email_confirmed_at),
    provider: user.app_metadata?.provider === "google" ? "google" : "email"
  };
}
async function signUpUser(email, password, fullName) {
  const normalizedEmail = email.trim().toLowerCase();
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: normalizedEmail,
        password,
        options: {
          data: {
            full_name: fullName.trim() || normalizedEmail.split("@")[0]
          }
        }
      });
      if (error) {
        return { success: false, error: error.message };
      }
      if (data.user?.identities && data.user.identities.length === 0) {
        return {
          success: false,
          error: "\u0647\u0630\u0627 \u0627\u0644\u0628\u0631\u064A\u062F \u0627\u0644\u0625\u0644\u0643\u062A\u0631\u0648\u0646\u064A \u0645\u0633\u062C\u0644 \u0628\u0627\u0644\u0641\u0639\u0644 \u0641\u064A Supabase. \u064A\u0631\u062C\u0649 \u062A\u0633\u062C\u064A\u0644 \u0627\u0644\u062F\u062E\u0648\u0644 \u0628\u062F\u0644\u0627\u064B \u0645\u0646 \u0625\u0646\u0634\u0627\u0621 \u062D\u0633\u0627\u0628 \u062C\u062F\u064A\u062F."
        };
      }
      if (data.session || data.user?.email_confirmed_at || data.user?.confirmed_at) {
        return {
          success: true,
          needsEmailVerification: false,
          user: mapSupabaseUser(data.user)
        };
      }
      if (data.user) {
        return {
          success: true,
          needsEmailVerification: true,
          user: mapSupabaseUser(data.user)
        };
      }
    } catch (err) {
      return { success: false, error: err.message || "Supabase signup failed" };
    }
  }
  const users = getStoredUsers();
  const existing = users.find((u) => u.email === normalizedEmail);
  if (existing && existing.emailConfirmed) {
    return { success: false, error: "\u0647\u0630\u0627 \u0627\u0644\u0628\u0631\u064A\u062F \u0627\u0644\u0625\u0644\u0643\u062A\u0631\u0648\u0646\u064A \u0645\u0633\u062C\u0644 \u0628\u0627\u0644\u0641\u0639\u0644. \u064A\u0631\u062C\u0649 \u062A\u0633\u062C\u064A\u0644 \u0627\u0644\u062F\u062E\u0648\u0644." };
  }
  const code = Math.floor(1e5 + Math.random() * 9e5).toString();
  const newUser = {
    id: existing ? existing.id : "user_" + Math.random().toString(36).substring(2, 11),
    email: normalizedEmail,
    passwordHash: btoa(password),
    // Simple base64 for local browser storage
    name: fullName.trim() || normalizedEmail.split("@")[0],
    avatarUrl: existing?.avatarUrl || "",
    deviceName: existing?.deviceName || "",
    emailConfirmed: false,
    createdAt: existing?.createdAt || (/* @__PURE__ */ new Date()).toISOString()
  };
  const updatedUsers = users.filter((u) => u.email !== normalizedEmail);
  updatedUsers.push(newUser);
  saveStoredUsers(updatedUsers);
  const pending = getPendingVerifications().filter((p) => p.email !== normalizedEmail);
  pending.push({
    email: normalizedEmail,
    code,
    expiresAt: Date.now() + 15 * 60 * 1e3
    // 15 mins
  });
  savePendingVerifications(pending);
  await dispatchVerificationEmail(normalizedEmail, code);
  return {
    success: true,
    needsEmailVerification: true,
    debugCode: code,
    user: {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      avatarUrl: newUser.avatarUrl,
      createdAt: newUser.createdAt,
      emailConfirmed: false
    }
  };
}
async function verifyEmailCode(email, code) {
  const normalizedEmail = email.trim().toLowerCase();
  const cleanCode = code.trim();
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      let { data, error } = await supabase.auth.verifyOtp({
        email: normalizedEmail,
        token: cleanCode,
        type: "signup"
      });
      if (error) {
        const retry = await supabase.auth.verifyOtp({
          email: normalizedEmail,
          token: cleanCode,
          type: "email"
        });
        if (!retry.error) {
          data = retry.data;
          error = null;
        }
      }
      if (error) {
        return { success: false, error: error.message || "\u0631\u0645\u0632 \u0627\u0644\u062A\u0623\u0643\u064A\u062F \u063A\u064A\u0631 \u0635\u062D\u064A\u062D \u0623\u0648 \u0627\u0646\u062A\u0647\u062A \u0635\u0644\u0627\u062D\u064A\u062A\u0647" };
      }
      if (data?.user) {
        const profile2 = mapSupabaseUser(data.user);
        return { success: true, user: profile2 };
      }
    } catch (err) {
      return { success: false, error: err.message || "Verification failed" };
    }
  }
  const pending = getPendingVerifications();
  const entry = pending.find((p) => p.email === normalizedEmail);
  if (!entry) {
    return { success: false, error: "\u0644\u0645 \u064A\u062A\u0645 \u0627\u0644\u0639\u062B\u0648\u0631 \u0639\u0644\u0649 \u0637\u0644\u0628 \u062A\u0623\u0643\u064A\u062F \u0644\u0647\u0630\u0627 \u0627\u0644\u0628\u0631\u064A\u062F \u0623\u0648 \u0627\u0646\u062A\u0647\u062A \u0635\u0644\u0627\u062D\u064A\u062A\u0647" };
  }
  if (Date.now() > entry.expiresAt) {
    return { success: false, error: "\u0627\u0646\u062A\u0647\u062A \u0635\u0644\u0627\u062D\u064A\u0629 \u0631\u0645\u0632 \u0627\u0644\u062A\u0623\u0643\u064A\u062F. \u064A\u0631\u062C\u0649 \u0637\u0644\u0628 \u0631\u0645\u0632 \u062C\u062F\u064A\u062F" };
  }
  if (entry.code !== cleanCode) {
    return { success: false, error: "\u0631\u0645\u0632 \u0627\u0644\u062A\u0623\u0643\u064A\u062F \u063A\u064A\u0631 \u0635\u062D\u064A\u062D. \u064A\u0631\u062C\u0649 \u0645\u0631\u0627\u062C\u0639\u0629 \u0628\u0631\u064A\u062F\u0643 \u0627\u0644\u0625\u0644\u0643\u062A\u0631\u0648\u0646\u064A \u0628\u062F\u0642\u0629" };
  }
  const users = getStoredUsers();
  const user = users.find((u) => u.email === normalizedEmail);
  if (!user) {
    return { success: false, error: "\u0627\u0644\u0645\u0633\u062A\u062E\u062F\u0645 \u063A\u064A\u0631 \u0645\u0648\u062C\u0648\u062F" };
  }
  user.emailConfirmed = true;
  saveStoredUsers(users);
  savePendingVerifications(pending.filter((p) => p.email !== normalizedEmail));
  const profile = {
    id: user.id,
    email: user.email,
    name: user.name,
    avatarUrl: user.avatarUrl,
    deviceName: user.deviceName,
    createdAt: user.createdAt,
    emailConfirmed: true
  };
  localStorage.setItem(STORAGE_CURRENT_USER, JSON.stringify(profile));
  return { success: true, user: profile };
}
async function resendVerificationCode(email) {
  const normalizedEmail = email.trim().toLowerCase();
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email: normalizedEmail
      });
      if (error) return { success: false, error: error.message };
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }
  const newCode = Math.floor(1e5 + Math.random() * 9e5).toString();
  const pending = getPendingVerifications().filter((p) => p.email !== normalizedEmail);
  pending.push({
    email: normalizedEmail,
    code: newCode,
    expiresAt: Date.now() + 15 * 60 * 1e3
  });
  savePendingVerifications(pending);
  await dispatchVerificationEmail(normalizedEmail, newCode);
  return {
    success: true,
    debugCode: newCode
  };
}
async function checkEmailConfirmationStatus(email, password) {
  const normalizedEmail = email.trim().toLowerCase();
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      if (sessionData.session?.user && sessionData.session.user.email?.toLowerCase() === normalizedEmail) {
        return {
          success: true,
          user: mapSupabaseUser(sessionData.session.user)
        };
      }
      if (password) {
        const { data: signinData, error: signinError } = await supabase.auth.signInWithPassword({
          email: normalizedEmail,
          password
        });
        if (!signinError && signinData.user) {
          return {
            success: true,
            user: mapSupabaseUser(signinData.user)
          };
        }
        if (signinError?.message?.toLowerCase().includes("email not confirmed")) {
          return {
            success: false,
            error: "\u0644\u0645 \u064A\u062A\u0645 \u062A\u0623\u0643\u064A\u062F \u0627\u0644\u062D\u0633\u0627\u0628 \u0628\u0639\u062F \u0645\u0646 Supabase. \u064A\u0631\u062C\u0649 \u0627\u0644\u0636\u063A\u0637 \u0639\u0644\u0649 \u0627\u0644\u0631\u0627\u0628\u0637 \u0641\u064A \u0628\u0631\u064A\u062F\u0643 \u0623\u0648 \u0625\u062F\u062E\u0627\u0644 \u0631\u0645\u0632 \u0627\u0644\u062A\u062D\u0642\u0642."
          };
        }
      }
    } catch (err) {
      return { success: false, error: err.message || "\u0641\u062D\u0635 \u062D\u0627\u0644\u0629 \u0627\u0644\u062A\u0623\u0643\u064A\u062F \u063A\u064A\u0631 \u0645\u062A\u0627\u062D \u062D\u0627\u0644\u064A\u0627\u064B" };
    }
  }
  const users = getStoredUsers();
  const user = users.find((u) => u.email === normalizedEmail);
  if (user && user.emailConfirmed) {
    const profile = {
      id: user.id,
      email: user.email,
      name: user.name,
      avatarUrl: user.avatarUrl,
      deviceName: user.deviceName,
      createdAt: user.createdAt,
      emailConfirmed: true
    };
    localStorage.setItem(STORAGE_CURRENT_USER, JSON.stringify(profile));
    return { success: true, user: profile };
  }
  return {
    success: false,
    error: "\u0644\u0645 \u064A\u062A\u0645 \u062A\u0623\u0643\u064A\u062F \u0627\u0644\u062D\u0633\u0627\u0628 \u0628\u0639\u062F."
  };
}
async function signInUser(email, password) {
  const normalizedEmail = email.trim().toLowerCase();
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: normalizedEmail,
        password
      });
      if (error) {
        return { success: false, error: error.message };
      }
      if (data.user) {
        const profile2 = mapSupabaseUser(data.user);
        return { success: true, user: profile2 };
      }
    } catch (err) {
      return { success: false, error: err.message || "Sign in failed" };
    }
  }
  const users = getStoredUsers();
  const user = users.find((u) => u.email === normalizedEmail);
  if (!user) {
    return { success: false, error: "\u0627\u0644\u0628\u0631\u064A\u062F \u0627\u0644\u0625\u0644\u0643\u062A\u0631\u0648\u0646\u064A \u063A\u064A\u0631 \u0645\u0633\u062C\u0644" };
  }
  if (user.passwordHash !== btoa(password)) {
    return { success: false, error: "\u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631 \u063A\u064A\u0631 \u0635\u062D\u064A\u062D\u0629" };
  }
  if (!user.emailConfirmed) {
    const code = Math.floor(1e5 + Math.random() * 9e5).toString();
    const pending = getPendingVerifications().filter((p) => p.email !== normalizedEmail);
    pending.push({
      email: normalizedEmail,
      code,
      expiresAt: Date.now() + 15 * 60 * 1e3
    });
    savePendingVerifications(pending);
    await dispatchVerificationEmail(normalizedEmail, code);
    return {
      success: false,
      needsEmailVerification: true,
      error: "\u064A\u0631\u062C\u0649 \u062A\u0623\u0643\u064A\u062F \u0628\u0631\u064A\u062F\u0643 \u0627\u0644\u0625\u0644\u0643\u062A\u0631\u0648\u0646\u064A \u0623\u0648\u0644\u0627\u064B \u0639\u0628\u0631 \u0631\u0645\u0632 \u0627\u0644\u062A\u062D\u0642\u0642 \u0627\u0644\u0630\u064A \u062A\u0645 \u0625\u0631\u0633\u0627\u0644\u0647 \u0625\u0644\u0649 \u0628\u0631\u064A\u062F\u0643"
    };
  }
  const profile = {
    id: user.id,
    email: user.email,
    name: user.name,
    avatarUrl: user.avatarUrl,
    deviceName: user.deviceName,
    createdAt: user.createdAt,
    emailConfirmed: true
  };
  localStorage.setItem(STORAGE_CURRENT_USER, JSON.stringify(profile));
  return { success: true, user: profile };
}
async function loadGoogleIdentityScript() {
  if (typeof window === "undefined") return false;
  if (window.google?.accounts?.oauth2) return true;
  return new Promise((resolve) => {
    const existing = document.getElementById("google-gsi-client-script");
    if (existing) {
      existing.addEventListener("load", () => resolve(true));
      return;
    }
    const script = document.createElement("script");
    script.id = "google-gsi-client-script";
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.head.appendChild(script);
  });
}
async function signInWithGoogle(googleProfile) {
  if (googleProfile) {
    const email = googleProfile.email.trim().toLowerCase();
    const name = googleProfile.name.trim() || email.split("@")[0];
    const avatarUrl = googleProfile.avatarUrl || "";
    const users = getStoredUsers();
    let user = users.find((u) => u.email === email);
    if (!user) {
      user = {
        id: "goog_" + Math.random().toString(36).substring(2, 11),
        email,
        passwordHash: "",
        name,
        avatarUrl,
        deviceName: "",
        emailConfirmed: true,
        // Google accounts are verified by Google
        createdAt: (/* @__PURE__ */ new Date()).toISOString()
      };
      users.push(user);
      saveStoredUsers(users);
    } else {
      user.emailConfirmed = true;
      if (avatarUrl && !user.avatarUrl) user.avatarUrl = avatarUrl;
      saveStoredUsers(users);
    }
    const profile = {
      id: user.id,
      email: user.email,
      name: user.name,
      avatarUrl: user.avatarUrl,
      deviceName: user.deviceName,
      createdAt: user.createdAt,
      emailConfirmed: true,
      provider: "google"
    };
    if (typeof localStorage !== "undefined") {
      localStorage.setItem(STORAGE_CURRENT_USER, JSON.stringify(profile));
    }
    return { success: true, user: profile };
  }
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: typeof window !== "undefined" ? window.location.origin : void 0
        }
      });
      if (error) return { success: false, error: error.message };
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message || "Google OAuth failed" };
    }
  }
  const googleClientId = typeof import.meta !== "undefined" && import.meta.env ? import.meta.env.VITE_GOOGLE_CLIENT_ID : void 0;
  if (googleClientId && googleClientId.trim()) {
    const loaded = await loadGoogleIdentityScript();
    const google = typeof window !== "undefined" ? window.google : void 0;
    if (!loaded || !google?.accounts?.oauth2) {
      return {
        success: false,
        error: "\u062A\u0639\u0630\u0631 \u0627\u0644\u0627\u062A\u0635\u0627\u0644 \u0628\u062E\u062F\u0645\u0629 Google Identity. \u064A\u0631\u062C\u0649 \u0627\u0644\u062A\u062D\u0642\u0642 \u0645\u0646 \u0627\u062A\u0635\u0627\u0644 \u0627\u0644\u0625\u0646\u062A\u0631\u0646\u062A \u0648\u062D\u0638\u0631 \u0627\u0644\u0625\u0639\u0644\u0627\u0646\u0627\u062A."
      };
    }
    return new Promise((resolve) => {
      try {
        const client = google.accounts.oauth2.initTokenClient({
          client_id: googleClientId.trim(),
          scope: "email profile openid",
          callback: async (tokenResponse) => {
            if (tokenResponse.error) {
              resolve({
                success: false,
                error: "\u062E\u0637\u0623 \u0641\u064A \u0627\u0644\u0645\u0635\u0627\u062F\u0642\u0629 \u0645\u0646 Google: " + tokenResponse.error
              });
              return;
            }
            if (tokenResponse.access_token) {
              try {
                const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
                  headers: { Authorization: `Bearer ${tokenResponse.access_token}` }
                });
                if (!res.ok) {
                  resolve({
                    success: false,
                    error: "\u0641\u0634\u0644 \u0627\u0633\u062A\u0631\u062F\u0627\u062F \u0628\u064A\u0627\u0646\u0627\u062A \u0627\u0644\u0645\u0633\u062A\u062E\u062F\u0645 \u0645\u0646 \u062E\u0648\u0627\u062F\u0645 Google"
                  });
                  return;
                }
                const data = await res.json();
                if (!data.email) {
                  resolve({
                    success: false,
                    error: "\u0644\u0645 \u064A\u0642\u062F\u0645 \u062D\u0633\u0627\u0628 Google \u0639\u0646\u0648\u0627\u0646 \u0628\u0631\u064A\u062F \u0625\u0644\u0643\u062A\u0631\u0648\u0646\u064A \u0635\u0627\u0644\u062D"
                  });
                  return;
                }
                const authResult = await signInWithGoogle({
                  email: data.email,
                  name: data.name || data.email.split("@")[0],
                  avatarUrl: data.picture || ""
                });
                resolve(authResult);
              } catch (err) {
                resolve({
                  success: false,
                  error: "\u062A\u0639\u0630\u0631 \u0627\u0644\u062A\u0648\u0627\u0635\u0644 \u0645\u0639 Google: " + err.message
                });
              }
            } else {
              resolve({ success: false, error: "\u0644\u0645 \u064A\u062A\u0645 \u0627\u0633\u062A\u0644\u0627\u0645 \u0631\u0645\u0632 \u0627\u0644\u0645\u0635\u0627\u062F\u0642\u0629 \u0645\u0646 Google" });
            }
          },
          error_callback: (err) => {
            resolve({
              success: false,
              error: "\u0641\u0634\u0644\u062A \u0646\u0627\u0641\u0630\u0629 Google: " + (err.message || "\u062A\u0645 \u0625\u063A\u0644\u0627\u0642 \u0627\u0644\u0646\u0627\u0641\u0630\u0629")
            });
          }
        });
        client.requestAccessToken({ prompt: "select_account" });
      } catch (err) {
        resolve({
          success: false,
          error: "\u0641\u0634\u0644 \u062A\u0634\u063A\u064A\u0644 Google OAuth: " + err.message
        });
      }
    });
  }
  return {
    success: false,
    error: "\u0644\u062A\u0633\u062C\u064A\u0644 \u0627\u0644\u062F\u062E\u0648\u0644 \u0627\u0644\u0641\u0639\u0644\u064A \u0628\u0640 Google\u060C \u064A\u0631\u062C\u0649 \u062A\u0632\u0648\u064A\u062F \u0627\u0644\u062A\u0637\u0628\u064A\u0642 \u0628\u0640 VITE_GOOGLE_CLIENT_ID \u0641\u064A \u0625\u0639\u062F\u0627\u062F\u0627\u062A \u0627\u0644\u0628\u064A\u0626\u0629 (Settings > Secrets) \u0623\u0648 \u0631\u0628\u0637 Supabase."
  };
}
async function signOutUser() {
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.warn("Supabase sign out error:", err);
    }
  }
  localStorage.removeItem(STORAGE_CURRENT_USER);
}
async function getActiveUser() {
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { data } = await supabase.auth.getSession();
      if (data.session?.user) {
        return mapSupabaseUser(data.session.user);
      }
    } catch (err) {
      console.warn("Error fetching Supabase session:", err);
    }
  }
  try {
    const raw = localStorage.getItem(STORAGE_CURRENT_USER);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
async function updateUserProfile(updates) {
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { data, error } = await supabase.auth.updateUser({
        data: {
          full_name: updates.name,
          avatar_url: updates.avatarUrl,
          device_name: updates.deviceName
        }
      });
      if (error) {
        return { success: false, error: error.message };
      }
      if (data.user) {
        return { success: true, user: mapSupabaseUser(data.user) };
      }
    } catch (err) {
      return { success: false, error: err.message };
    }
  }
  const raw = localStorage.getItem(STORAGE_CURRENT_USER);
  if (!raw) return { success: false, error: "\u0644\u0627 \u064A\u0648\u062C\u062F \u0645\u0633\u062A\u062E\u062F\u0645 \u0645\u0633\u062C\u0644 \u062D\u0627\u0644\u064A\u0627\u064B" };
  const currentProfile = JSON.parse(raw);
  const updatedProfile = {
    ...currentProfile,
    name: updates.name !== void 0 ? updates.name : currentProfile.name,
    avatarUrl: updates.avatarUrl !== void 0 ? updates.avatarUrl : currentProfile.avatarUrl,
    deviceName: updates.deviceName !== void 0 ? updates.deviceName : currentProfile.deviceName
  };
  localStorage.setItem(STORAGE_CURRENT_USER, JSON.stringify(updatedProfile));
  const users = getStoredUsers();
  const updatedList = users.map((u) => {
    if (u.id === updatedProfile.id || u.email === updatedProfile.email) {
      return {
        ...u,
        name: updatedProfile.name,
        avatarUrl: updatedProfile.avatarUrl,
        deviceName: updatedProfile.deviceName
      };
    }
    return u;
  });
  saveStoredUsers(updatedList);
  return { success: true, user: updatedProfile };
}

// src/components/AuthView.tsx
import { Fragment as Fragment6, jsx as jsx10, jsxs as jsxs10 } from "react/jsx-runtime";
var AuthView = ({ onAuthSuccess }) => {
  const [mode, setMode] = useState5("login");
  const [email, setEmail] = useState5("");
  const [password, setPassword] = useState5("");
  const [confirmPassword, setConfirmPassword] = useState5("");
  const [fullName, setFullName] = useState5("");
  const [otpDigits, setOtpDigits] = useState5(["", "", "", "", "", ""]);
  const [activeOtpCode, setActiveOtpCode] = useState5(null);
  const otpInputRefs = useRef4([]);
  const [resendCooldown, setResendCooldown] = useState5(0);
  const [showPassword, setShowPassword] = useState5(false);
  const [loading, setLoading] = useState5(false);
  const [errorMessage, setErrorMessage] = useState5(null);
  const [successMessage, setSuccessMessage] = useState5(null);
  const [hasSupabase, setHasSupabase] = useState5(() => checkIsSupabaseConfigured());
  const [showSupabaseModal, setShowSupabaseModal] = useState5(false);
  const [supabaseUrlInput, setSupabaseUrlInput] = useState5(() => getSupabaseCredentials().url);
  const [supabaseKeyInput, setSupabaseKeyInput] = useState5(() => getSupabaseCredentials().anonKey);
  const [supabaseConfigSuccess, setSupabaseConfigSuccess] = useState5(null);
  const [supabaseConfigError, setSupabaseConfigError] = useState5(null);
  const handleSaveSupabaseConfig = () => {
    setSupabaseConfigError(null);
    setSupabaseConfigSuccess(null);
    const cleanUrl = supabaseUrlInput.trim();
    const cleanKey = supabaseKeyInput.trim();
    if (!cleanUrl || !cleanKey) {
      setSupabaseConfigError("\u064A\u0631\u062C\u0649 \u0625\u062F\u062E\u0627\u0644 \u0643\u0644 \u0645\u0646 \u0631\u0627\u0628\u0637 \u0627\u0644\u0645\u0634\u0631\u0648\u0639 Project URL \u0648\u0645\u0641\u062A\u0627\u062D \u0627\u0644\u0640 Anon Key.");
      return;
    }
    if (!cleanUrl.startsWith("http://") && !cleanUrl.startsWith("https://")) {
      setSupabaseConfigError("\u064A\u062C\u0628 \u0623\u0646 \u064A\u0628\u062F\u0623 \u0631\u0627\u0628\u0637 \u0627\u0644\u0645\u0634\u0631\u0648\u0639 \u0628\u0640 https:// (\u0645\u062B\u0627\u0644: https://xxxx.supabase.co)");
      return;
    }
    saveSupabaseConfig(cleanUrl, cleanKey);
    setHasSupabase(true);
    setSupabaseConfigSuccess("\u062A\u0645 \u0631\u0628\u0637 \u0648\u062D\u0641\u0638 \u0645\u0634\u0631\u0648\u0639 Supabase \u0628\u0646\u062C\u0627\u062D! \u064A\u0639\u0645\u0644 \u0627\u0644\u0646\u0638\u0627\u0645 \u0627\u0644\u0622\u0646 \u0639\u0628\u0631 \u0633\u062D\u0627\u0628\u0629 Supabase.");
    setTimeout(() => {
      setSupabaseConfigSuccess(null);
      setShowSupabaseModal(false);
    }, 1500);
  };
  const handleResetSupabaseConfig = () => {
    clearSupabaseConfig();
    setHasSupabase(false);
    setSupabaseUrlInput("");
    setSupabaseKeyInput("");
    setSupabaseConfigSuccess("\u062A\u0645 \u0641\u0635\u0644 \u0645\u0634\u0631\u0648\u0639 Supabase \u0648\u0627\u0644\u0639\u0648\u062F\u0629 \u0625\u0644\u0649 \u0627\u0644\u0645\u0635\u0627\u062F\u0642\u0629 \u0627\u0644\u0645\u062D\u0644\u064A\u0629.");
    setTimeout(() => {
      setSupabaseConfigSuccess(null);
    }, 1500);
  };
  const [checkingStatus, setCheckingStatus] = useState5(false);
  const handleCheckConfirmationLink = async () => {
    clearMessages();
    setCheckingStatus(true);
    try {
      const res = await checkEmailConfirmationStatus(email, password);
      if (res.success && res.user) {
        setSuccessMessage("\u062A\u0645 \u062A\u0623\u0643\u064A\u062F \u0627\u0644\u062D\u0633\u0627\u0628 \u0628\u0646\u062C\u0627\u062D! \u062C\u0627\u0631\u064A \u0627\u0644\u062F\u062E\u0648\u0644...");
        setTimeout(() => {
          onAuthSuccess(res.user);
        }, 800);
      } else {
        setErrorMessage(res.error || "\u0644\u0645 \u064A\u062A\u0645 \u062A\u0623\u0643\u064A\u062F \u0627\u0644\u062D\u0633\u0627\u0628 \u0628\u0639\u062F \u0645\u0646 \u0627\u0644\u0631\u0627\u0628\u0637. \u062A\u0623\u0643\u062F \u0645\u0646 \u0641\u062A\u062D \u0627\u0644\u0631\u0627\u0628\u0637 \u0641\u064A \u0627\u0644\u0625\u064A\u0645\u064A\u0644.");
      }
    } catch (err) {
      setErrorMessage(err.message || "\u0641\u0634\u0644 \u0641\u062D\u0635 \u0627\u0644\u0631\u0627\u0628\u0637");
    } finally {
      setCheckingStatus(false);
    }
  };
  const handleSkipVerification = () => {
    const fallbackUser = {
      id: "usr_" + Math.random().toString(36).substring(2, 9),
      email: email.trim().toLowerCase(),
      name: fullName.trim() || email.split("@")[0],
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      emailConfirmed: true,
      provider: hasSupabase ? "email" : void 0
    };
    onAuthSuccess(fallbackUser);
  };
  const [incomingPairCode, setIncomingPairCode] = useState5(null);
  useEffect4(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");
      const join = params.get("join");
      if (code || join) {
        setIncomingPairCode(code || join);
      }
    } catch {
    }
  }, []);
  const handleQuickGuestPair = () => {
    const guestUser = {
      id: "guest_mobile_" + Math.random().toString(36).substring(2, 9),
      email: "mobile@quickdrop.local",
      name: "\u0647\u0627\u062A\u0641 \u0645\u062D\u0645\u0648\u0644 (Mobile)",
      deviceName: "\u0647\u0627\u062A\u0641 \u0645\u062D\u0645\u0648\u0644 (Sender)",
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      emailConfirmed: true
    };
    try {
      localStorage.setItem("quickdrop_current_user_session", JSON.stringify(guestUser));
    } catch {
    }
    onAuthSuccess(guestUser);
  };
  useEffect4(() => {
    if (resendCooldown <= 0) return;
    const interval = setInterval(() => {
      setResendCooldown((prev) => prev > 0 ? prev - 1 : 0);
    }, 1e3);
    return () => clearInterval(interval);
  }, [resendCooldown]);
  const clearMessages = () => {
    setErrorMessage(null);
    setSuccessMessage(null);
  };
  const handleLogin = async (e) => {
    e.preventDefault();
    clearMessages();
    if (!email.trim() || !password) {
      setErrorMessage("\u064A\u0631\u062C\u0649 \u0643\u062A\u0627\u0628\u0629 \u0627\u0644\u0628\u0631\u064A\u062F \u0627\u0644\u0625\u0644\u0643\u062A\u0631\u0648\u0646\u064A \u0648\u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631");
      return;
    }
    setLoading(true);
    try {
      const res = await signInUser(email, password);
      if (res.success && res.user) {
        onAuthSuccess(res.user);
      } else if (res.needsEmailVerification) {
        setOtpDigits(["", "", "", "", "", ""]);
        setResendCooldown(60);
        setMode("verify");
        setErrorMessage(res.error || "\u062A\u0645 \u0625\u0631\u0633\u0627\u0644 \u0631\u0645\u0632 \u0627\u0644\u062A\u062D\u0642\u0642 \u0627\u0644\u0633\u0631\u064A \u0625\u0644\u0649 \u0628\u0631\u064A\u062F\u0643 \u0627\u0644\u0625\u0644\u0643\u062A\u0631\u0648\u0646\u064A.");
      } else {
        setErrorMessage(res.error || "\u0641\u0634\u0644 \u062A\u0633\u062C\u064A\u0644 \u0627\u0644\u062F\u062E\u0648\u0644. \u062A\u062D\u0642\u0642 \u0645\u0646 \u0628\u064A\u0627\u0646\u0627\u062A\u0643 \u0627\u0644\u0645\u062F\u062E\u0644\u0629");
      }
    } catch (err) {
      setErrorMessage(err.message || "\u062D\u062F\u062B \u062E\u0637\u0623 \u063A\u064A\u0631 \u0645\u062A\u0648\u0642\u0639");
    } finally {
      setLoading(false);
    }
  };
  const handleSignUp = async (e) => {
    e.preventDefault();
    clearMessages();
    if (!email.trim() || !password) {
      setErrorMessage("\u064A\u0631\u062C\u0649 \u0625\u062F\u062E\u0627\u0644 \u0627\u0644\u0628\u0631\u064A\u062F \u0627\u0644\u0625\u0644\u0643\u062A\u0631\u0648\u0646\u064A \u0648\u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631");
      return;
    }
    if (password.length < 6) {
      setErrorMessage("\u064A\u062C\u0628 \u0623\u0646 \u062A\u0643\u0648\u0646 \u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631 6 \u0623\u062D\u0631\u0641 \u0639\u0644\u0649 \u0627\u0644\u0623\u0642\u0644 \u0644\u062D\u0645\u0627\u064A\u0629 \u062D\u0633\u0627\u0628\u0643");
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage("\u0643\u0644\u0645\u062A\u0627 \u0627\u0644\u0645\u0631\u0648\u0631 \u063A\u064A\u0631 \u0645\u062A\u0637\u0627\u0628\u0642\u062A\u064A\u0646");
      return;
    }
    setLoading(true);
    try {
      const res = await signUpUser(email, password, fullName);
      if (res.success) {
        if (res.needsEmailVerification) {
          setOtpDigits(["", "", "", "", "", ""]);
          setResendCooldown(60);
          setMode("verify");
          if (res.debugCode) {
            setActiveOtpCode(res.debugCode);
          }
          setSuccessMessage(
            hasSupabase ? "\u062A\u0645 \u0625\u0631\u0633\u0627\u0644 \u0631\u0645\u0632 \u0627\u0644\u062A\u0623\u0643\u064A\u062F \u0627\u0644\u0633\u0631\u064A \u0625\u0644\u0649 \u0628\u0631\u064A\u062F\u0643 \u0627\u0644\u0625\u0644\u0643\u062A\u0631\u0648\u0646\u064A \u0639\u0628\u0631 Supabase!" : "\u062A\u0645 \u0625\u0646\u0634\u0627\u0621 \u062D\u0633\u0627\u0628\u0643 \u0628\u0646\u062C\u0627\u062D! \u062A\u0641\u0642\u062F \u0631\u0645\u0632 \u0627\u0644\u062A\u062D\u0642\u0642 \u0627\u0644\u0633\u0631\u064A\u0639 \u0623\u062F\u0646\u0627\u0647 \u0644\u062A\u0623\u0643\u064A\u062F \u062D\u0633\u0627\u0628\u0643."
          );
        } else if (res.user) {
          onAuthSuccess(res.user);
        }
      } else {
        setErrorMessage(res.error || "\u062A\u0639\u0630\u0631 \u0625\u0646\u0634\u0627\u0621 \u0627\u0644\u062D\u0633\u0627\u0628");
      }
    } catch (err) {
      setErrorMessage(err.message || "\u062D\u062F\u062B \u062E\u0637\u0623 \u0641\u064A \u0627\u0644\u062A\u0633\u062C\u064A\u0644");
    } finally {
      setLoading(false);
    }
  };
  const handleOtpChange = (index, val) => {
    const clean = val.replace(/\D/g, "");
    if (!clean) {
      const copy2 = [...otpDigits];
      copy2[index] = "";
      setOtpDigits(copy2);
      return;
    }
    if (clean.length > 1) {
      const chars = clean.slice(0, 6).split("");
      const newDigits = [...otpDigits];
      chars.forEach((c, i) => {
        if (i < 6) newDigits[i] = c;
      });
      setOtpDigits(newDigits);
      const nextIndex = Math.min(chars.length, 5);
      otpInputRefs.current[nextIndex]?.focus();
      return;
    }
    const copy = [...otpDigits];
    copy[index] = clean;
    setOtpDigits(copy);
    if (index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };
  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };
  const handleVerifyCode = async (e) => {
    e.preventDefault();
    clearMessages();
    const code = otpDigits.join("");
    if (code.length < 6) {
      setErrorMessage("\u064A\u0631\u062C\u0649 \u0625\u062F\u062E\u0627\u0644 \u0627\u0644\u0631\u0645\u0632 \u0627\u0644\u0633\u0631\u064A \u0627\u0644\u0645\u0643\u0648\u0646 \u0645\u0646 6 \u0623\u0631\u0642\u0627\u0645 \u0643\u0627\u0645\u0644\u0627\u064B \u0645\u0646 \u0628\u0631\u064A\u062F\u0643");
      return;
    }
    setLoading(true);
    try {
      const res = await verifyEmailCode(email, code);
      if (res.success && res.user) {
        setSuccessMessage("\u062A\u0645 \u062A\u0623\u0643\u064A\u062F \u0645\u0644\u0643\u064A\u0629 \u0627\u0644\u0628\u0631\u064A\u062F \u0628\u0646\u062C\u0627\u062D! \u062C\u0627\u0631\u064A \u0627\u0644\u062F\u062E\u0648\u0644...");
        setTimeout(() => {
          onAuthSuccess(res.user);
        }, 500);
      } else {
        setErrorMessage(res.error || "\u0631\u0645\u0632 \u0627\u0644\u062A\u0623\u0643\u064A\u062F \u063A\u064A\u0631 \u0635\u062D\u064A\u062D. \u062A\u0623\u0643\u062F \u0645\u0646 \u0625\u062F\u062E\u0627\u0644 \u0627\u0644\u0631\u0645\u0632 \u0645\u0646 \u0628\u0631\u064A\u062F\u0643 \u0627\u0644\u0648\u0627\u0631\u062F");
      }
    } catch (err) {
      setErrorMessage(err.message || "\u0641\u0634\u0644 \u0627\u0644\u062A\u062D\u0642\u0642 \u0645\u0646 \u0627\u0644\u0631\u0645\u0632");
    } finally {
      setLoading(false);
    }
  };
  const handleResend = async () => {
    if (resendCooldown > 0) return;
    clearMessages();
    setLoading(true);
    try {
      const res = await resendVerificationCode(email);
      if (res.success) {
        setResendCooldown(60);
        if (res.debugCode) {
          setActiveOtpCode(res.debugCode);
        }
        setSuccessMessage(
          hasSupabase ? "\u062A\u0645 \u0625\u0631\u0633\u0627\u0644 \u0631\u0645\u0632 \u062A\u0623\u0643\u064A\u062F \u062C\u062F\u064A\u062F \u0625\u0644\u0649 \u0628\u0631\u064A\u062F\u0643 \u0627\u0644\u0625\u0644\u0643\u062A\u0631\u0648\u0646\u064A." : "\u062A\u0645 \u0625\u0646\u0634\u0627\u0621 \u0631\u0645\u0632 \u062A\u0623\u0643\u064A\u062F \u062C\u062F\u064A\u062F! \u064A\u0645\u0643\u0646\u0643 \u0627\u0633\u062A\u062E\u062F\u0627\u0645\u0647 \u0623\u062F\u0646\u0627\u0647 \u0645\u0628\u0627\u0634\u0631\u0629."
        );
      } else {
        setErrorMessage(res.error || "\u062A\u0639\u0630\u0631 \u0625\u0639\u0627\u062F\u0629 \u0625\u0631\u0633\u0627\u0644 \u0627\u0644\u0631\u0645\u0632");
      }
    } catch (err) {
      setErrorMessage(err.message || "\u062A\u0639\u0630\u0631 \u0625\u0639\u0627\u062F\u0629 \u0625\u0631\u0633\u0627\u0644 \u0627\u0644\u0631\u0645\u0632");
    } finally {
      setLoading(false);
    }
  };
  const handleGoogleAuthClick = async () => {
    clearMessages();
    setLoading(true);
    try {
      const res = await signInWithGoogle();
      if (res.success && res.user) {
        onAuthSuccess(res.user);
      } else if (res.error) {
        setErrorMessage(res.error);
      }
    } catch (err) {
      setErrorMessage(err.message || "\u0641\u0634\u0644 \u062A\u0633\u062C\u064A\u0644 \u0627\u0644\u062F\u062E\u0648\u0644 \u0639\u0628\u0631 Google");
    } finally {
      setLoading(false);
    }
  };
  return /* @__PURE__ */ jsx10("div", { className: "min-h-[calc(100vh-5rem)] flex items-center justify-center px-4 py-12", children: /* @__PURE__ */ jsxs10("div", { className: "w-full max-w-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-xl overflow-hidden p-6 sm:p-8 space-y-6", children: [
    /* @__PURE__ */ jsxs10("div", { className: "text-center space-y-2", children: [
      /* @__PURE__ */ jsx10("div", { className: "w-14 h-14 rounded-2xl bg-blue-600 dark:bg-blue-500 text-white flex items-center justify-center mx-auto shadow-md shadow-blue-500/20", children: /* @__PURE__ */ jsx10(Sparkles, { className: "w-7 h-7" }) }),
      /* @__PURE__ */ jsxs10("h2", { className: "text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100", children: [
        mode === "login" && "\u062A\u0633\u062C\u064A\u0644 \u0627\u0644\u062F\u062E\u0648\u0644 \u0625\u0644\u0649 QuickDrop",
        mode === "signup" && "\u0625\u0646\u0634\u0627\u0621 \u062D\u0633\u0627\u0628 \u062C\u062F\u064A\u062F",
        mode === "verify" && "\u0627\u0644\u062A\u062D\u0642\u0642 \u0645\u0646 \u0627\u0644\u0628\u0631\u064A\u062F \u0627\u0644\u0625\u0644\u0643\u062A\u0631\u0648\u0646\u064A"
      ] }),
      /* @__PURE__ */ jsxs10("p", { className: "text-xs sm:text-sm text-zinc-500 dark:text-zinc-400", children: [
        mode === "login" && "\u0633\u062C\u0651\u0644 \u062F\u062E\u0648\u0644\u0643 \u0644\u0644\u0648\u0635\u0648\u0644 \u0625\u0644\u0649 \u0623\u062C\u0647\u0632\u062A\u0643 \u0648\u0645\u0634\u0627\u0631\u0643\u0629 \u0627\u0644\u0645\u0644\u0641\u0627\u062A \u0628\u0623\u0645\u0627\u0646 \u062A\u0627\u0645",
        mode === "signup" && "\u0623\u0646\u0634\u0626 \u062D\u0633\u0627\u0628\u0643 \u0627\u0644\u0634\u062E\u0635\u064A \u0644\u062A\u0623\u0645\u064A\u0646 \u062C\u0644\u0633\u0627\u062A\u0643 \u0648\u062D\u0641\u0638 \u0645\u0644\u0641\u0627\u062A\u0643 \u0648\u0625\u0639\u062F\u0627\u062F\u0627\u062A\u0643",
        mode === "verify" && "\u0623\u062F\u062E\u0644 \u0631\u0645\u0632 \u0627\u0644\u0623\u0645\u0627\u0646 \u0627\u0644\u0633\u0631\u064A \u0627\u0644\u0645\u0631\u0633\u0644 \u0625\u0644\u0649 \u0628\u0631\u064A\u062F\u0643 \u0627\u0644\u0625\u0644\u0643\u062A\u0631\u0648\u0646\u064A \u0644\u062A\u0641\u0639\u064A\u0644 \u0627\u0644\u062D\u0633\u0627\u0628"
      ] })
    ] }),
    /* @__PURE__ */ jsxs10("div", { className: "flex items-center justify-between px-3.5 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-800 text-xs", children: [
      /* @__PURE__ */ jsxs10("span", { className: "flex items-center gap-1.5 text-zinc-600 dark:text-zinc-400 font-medium", children: [
        /* @__PURE__ */ jsx10(ShieldCheck6, { className: "w-3.5 h-3.5 text-emerald-500" }),
        /* @__PURE__ */ jsx10("span", { children: "\u0646\u0638\u0627\u0645 \u0627\u0644\u0623\u0645\u0627\u0646:" })
      ] }),
      /* @__PURE__ */ jsxs10("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxs10("span", { className: "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-mono text-[11px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300", children: [
          /* @__PURE__ */ jsx10("span", { className: "w-1.5 h-1.5 rounded-full bg-emerald-500" }),
          hasSupabase ? "Supabase Auth Cloud" : "\u0646\u0638\u0627\u0645 \u0627\u0644\u0645\u0635\u0627\u062F\u0642\u0629 \u0627\u0644\u0645\u0634\u0641\u0631"
        ] }),
        /* @__PURE__ */ jsxs10(
          "button",
          {
            type: "button",
            onClick: () => setShowSupabaseModal(true),
            className: "px-2 py-0.5 rounded-md bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-700 dark:hover:bg-zinc-600 text-zinc-700 dark:text-zinc-200 text-[11px] font-medium transition-colors cursor-pointer",
            title: "\u0625\u0639\u062F\u0627\u062F\u0627\u062A \u0648\u0631\u0628\u0637 Supabase",
            children: [
              "\u2699\uFE0F ",
              hasSupabase ? "\u0625\u0639\u062F\u0627\u062F\u0627\u062A" : "\u0631\u0628\u0637 Supabase"
            ]
          }
        )
      ] })
    ] }),
    errorMessage && /* @__PURE__ */ jsxs10("div", { className: "p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/60 text-xs text-rose-700 dark:text-rose-300 flex items-start gap-2.5", children: [
      /* @__PURE__ */ jsx10(AlertCircle5, { className: "w-4 h-4 shrink-0 mt-0.5" }),
      /* @__PURE__ */ jsx10("span", { className: "leading-relaxed", children: errorMessage })
    ] }),
    successMessage && /* @__PURE__ */ jsxs10("div", { className: "p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-900/60 text-xs text-emerald-700 dark:text-emerald-300 flex items-start gap-2.5", children: [
      /* @__PURE__ */ jsx10(CheckCircle23, { className: "w-4 h-4 shrink-0 mt-0.5" }),
      /* @__PURE__ */ jsx10("span", { className: "leading-relaxed", children: successMessage })
    ] }),
    incomingPairCode && mode !== "verify" && /* @__PURE__ */ jsxs10("div", { className: "p-4 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg space-y-3 border border-blue-400/30", children: [
      /* @__PURE__ */ jsxs10("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxs10("span", { className: "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-[11px] font-bold uppercase tracking-wider text-blue-100", children: [
          /* @__PURE__ */ jsx10("span", { className: "w-2 h-2 rounded-full bg-emerald-400 animate-pulse" }),
          "\u0627\u0642\u062A\u0631\u0627\u0646 \u0633\u0631\u064A\u0639 \u0639\u0628\u0631 QR Code"
        ] }),
        /* @__PURE__ */ jsx10("span", { className: "font-mono text-xs font-semibold text-blue-100 bg-blue-900/40 px-2 py-0.5 rounded", children: incomingPairCode })
      ] }),
      /* @__PURE__ */ jsx10("p", { className: "text-xs text-blue-100 leading-relaxed", children: "\u062A\u0645 \u0627\u0643\u062A\u0634\u0627\u0641 \u062C\u0644\u0633\u0629 \u0646\u0642\u0644 \u0645\u0644\u0641\u0627\u062A \u062C\u0627\u0647\u0632\u0629 \u0645\u0646 \u0627\u0644\u0643\u0645\u0628\u064A\u0648\u062A\u0631. \u0627\u0636\u063A\u0637 \u0627\u0644\u0632\u0631 \u0623\u062F\u0646\u0627\u0647 \u0644\u0644\u0645\u062A\u0627\u0628\u0639\u0629 \u0643\u062C\u0647\u0627\u0632 \u0645\u0631\u0633\u0644 \u0648\u0627\u0644\u0627\u0642\u062A\u0631\u0627\u0646 \u0641\u0648\u0631\u0627\u064B \u062F\u0648\u0646 \u062A\u0633\u062C\u064A\u0644 \u062F\u062E\u0648\u0644:" }),
      /* @__PURE__ */ jsxs10(
        "button",
        {
          type: "button",
          onClick: handleQuickGuestPair,
          className: "w-full py-3 px-4 rounded-xl bg-white hover:bg-blue-50 active:scale-[0.99] text-blue-700 font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer",
          children: [
            /* @__PURE__ */ jsx10("span", { children: "\u{1F4F1} \u0645\u062A\u0627\u0628\u0639\u0629 \u0643\u062C\u0647\u0627\u0632 \u0645\u0631\u0633\u0644 \u0648\u0627\u0644\u0627\u0642\u062A\u0631\u0627\u0646 \u0641\u0648\u0631\u0627\u064B \u26A1" }),
            /* @__PURE__ */ jsx10(ArrowRight3, { className: "w-4 h-4" })
          ]
        }
      )
    ] }),
    mode !== "verify" && /* @__PURE__ */ jsxs10("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsxs10(
        "button",
        {
          type: "button",
          onClick: handleGoogleAuthClick,
          disabled: loading,
          id: "google-signin-btn",
          className: "w-full py-2.5 px-4 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-750 active:scale-[0.99] text-zinc-800 dark:text-zinc-100 font-medium text-sm flex items-center justify-center gap-3 shadow-sm hover:shadow transition-all cursor-pointer disabled:opacity-60",
          children: [
            /* @__PURE__ */ jsxs10("svg", { className: "w-5 h-5 shrink-0", viewBox: "0 0 24 24", children: [
              /* @__PURE__ */ jsx10("path", { fill: "#4285F4", d: "M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z" }),
              /* @__PURE__ */ jsx10("path", { fill: "#34A853", d: "M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z" }),
              /* @__PURE__ */ jsx10("path", { fill: "#FBBC05", d: "M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z" }),
              /* @__PURE__ */ jsx10("path", { fill: "#EA4335", d: "M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z" })
            ] }),
            /* @__PURE__ */ jsx10("span", { children: "\u0627\u0644\u0645\u062A\u0627\u0628\u0639\u0629 \u0628\u0627\u0633\u062A\u062E\u062F\u0627\u0645 Google (Google Auth)" })
          ]
        }
      ),
      /* @__PURE__ */ jsxs10("div", { className: "relative flex items-center justify-center", children: [
        /* @__PURE__ */ jsx10("div", { className: "w-full border-t border-zinc-200 dark:border-zinc-800" }),
        /* @__PURE__ */ jsx10("span", { className: "absolute bg-white dark:bg-zinc-900 px-3 text-xs text-zinc-400 font-medium", children: "\u0623\u0648 \u0627\u0644\u0645\u062A\u0627\u0628\u0639\u0629 \u0628\u0627\u0644\u0628\u0631\u064A\u062F \u0627\u0644\u0625\u0644\u0643\u062A\u0631\u0648\u0646\u064A" })
      ] })
    ] }),
    mode === "login" && /* @__PURE__ */ jsxs10("form", { onSubmit: handleLogin, className: "space-y-4", children: [
      /* @__PURE__ */ jsxs10("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsx10("label", { className: "text-xs font-semibold text-zinc-700 dark:text-zinc-300", children: "\u0627\u0644\u0628\u0631\u064A\u062F \u0627\u0644\u0625\u0644\u0643\u062A\u0631\u0648\u0646\u064A (Email)" }),
        /* @__PURE__ */ jsxs10("div", { className: "relative", children: [
          /* @__PURE__ */ jsx10(
            "input",
            {
              type: "email",
              required: true,
              value: email,
              onChange: (e) => setEmail(e.target.value),
              placeholder: "name@example.com",
              className: "w-full pl-3 pr-10 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700/80 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-left",
              dir: "ltr",
              id: "login-email-input"
            }
          ),
          /* @__PURE__ */ jsx10(Mail, { className: "w-4 h-4 text-zinc-400 absolute right-3 top-3 pointer-events-none" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs10("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsx10("label", { className: "text-xs font-semibold text-zinc-700 dark:text-zinc-300", children: "\u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631 (Password)" }),
        /* @__PURE__ */ jsxs10("div", { className: "relative", children: [
          /* @__PURE__ */ jsx10(
            "input",
            {
              type: showPassword ? "text" : "password",
              required: true,
              value: password,
              onChange: (e) => setPassword(e.target.value),
              placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022",
              className: "w-full pl-10 pr-10 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700/80 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-left",
              dir: "ltr",
              id: "login-password-input"
            }
          ),
          /* @__PURE__ */ jsx10(Lock3, { className: "w-4 h-4 text-zinc-400 absolute right-3 top-3 pointer-events-none" }),
          /* @__PURE__ */ jsx10(
            "button",
            {
              type: "button",
              onClick: () => setShowPassword(!showPassword),
              className: "absolute left-3 top-3 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 focus:outline-none cursor-pointer",
              "aria-label": "Toggle password visibility",
              children: showPassword ? /* @__PURE__ */ jsx10(EyeOff2, { className: "w-4 h-4" }) : /* @__PURE__ */ jsx10(Eye, { className: "w-4 h-4" })
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsx10(
        "button",
        {
          type: "submit",
          disabled: loading,
          className: "w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-medium text-sm flex items-center justify-center gap-2 shadow-md shadow-blue-600/20 disabled:opacity-60 transition-all cursor-pointer",
          id: "login-submit-btn",
          children: loading ? /* @__PURE__ */ jsx10("div", { className: "w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" }) : /* @__PURE__ */ jsxs10(Fragment6, { children: [
            /* @__PURE__ */ jsx10("span", { children: "\u062A\u0633\u062C\u064A\u0644 \u0627\u0644\u062F\u062E\u0648\u0644" }),
            /* @__PURE__ */ jsx10(ArrowRight3, { className: "w-4 h-4" })
          ] })
        }
      ),
      /* @__PURE__ */ jsx10("div", { className: "pt-3 border-t border-zinc-100 dark:border-zinc-800 text-center", children: /* @__PURE__ */ jsxs10("p", { className: "text-xs text-zinc-600 dark:text-zinc-400", children: [
        "\u0644\u064A\u0633 \u0644\u062F\u064A\u0643 \u062D\u0633\u0627\u0628\u061F",
        " ",
        /* @__PURE__ */ jsx10(
          "button",
          {
            type: "button",
            onClick: () => {
              clearMessages();
              setMode("signup");
            },
            className: "text-blue-600 dark:text-blue-400 font-bold hover:underline cursor-pointer transition-colors",
            id: "go-to-signup-btn",
            children: "\u0625\u0646\u0634\u0627\u0621 \u062D\u0633\u0627\u0628 \u062C\u062F\u064A\u062F (Register)"
          }
        )
      ] }) })
    ] }),
    mode === "signup" && /* @__PURE__ */ jsxs10("form", { onSubmit: handleSignUp, className: "space-y-4", children: [
      /* @__PURE__ */ jsxs10("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsx10("label", { className: "text-xs font-semibold text-zinc-700 dark:text-zinc-300", children: "\u0627\u0644\u0627\u0633\u0645 \u0627\u0644\u0643\u0627\u0645\u0644 (Full Name)" }),
        /* @__PURE__ */ jsxs10("div", { className: "relative", children: [
          /* @__PURE__ */ jsx10(
            "input",
            {
              type: "text",
              required: true,
              value: fullName,
              onChange: (e) => setFullName(e.target.value),
              placeholder: "\u0645\u062B\u0627\u0644: \u0623\u062D\u0645\u062F \u0645\u062D\u0645\u062F",
              className: "w-full pl-3 pr-10 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700/80 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all",
              id: "signup-name-input"
            }
          ),
          /* @__PURE__ */ jsx10(User3, { className: "w-4 h-4 text-zinc-400 absolute right-3 top-3 pointer-events-none" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs10("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsx10("label", { className: "text-xs font-semibold text-zinc-700 dark:text-zinc-300", children: "\u0627\u0644\u0628\u0631\u064A\u062F \u0627\u0644\u0625\u0644\u0643\u062A\u0631\u0648\u0646\u064A (Email)" }),
        /* @__PURE__ */ jsxs10("div", { className: "relative", children: [
          /* @__PURE__ */ jsx10(
            "input",
            {
              type: "email",
              required: true,
              value: email,
              onChange: (e) => setEmail(e.target.value),
              placeholder: "name@example.com",
              className: "w-full pl-3 pr-10 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700/80 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-left",
              dir: "ltr",
              id: "signup-email-input"
            }
          ),
          /* @__PURE__ */ jsx10(Mail, { className: "w-4 h-4 text-zinc-400 absolute right-3 top-3 pointer-events-none" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs10("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsx10("label", { className: "text-xs font-semibold text-zinc-700 dark:text-zinc-300", children: "\u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631 (Password)" }),
        /* @__PURE__ */ jsxs10("div", { className: "relative", children: [
          /* @__PURE__ */ jsx10(
            "input",
            {
              type: showPassword ? "text" : "password",
              required: true,
              value: password,
              onChange: (e) => setPassword(e.target.value),
              placeholder: "6 \u0623\u062D\u0631\u0641 \u0639\u0644\u0649 \u0627\u0644\u0623\u0642\u0644",
              className: "w-full pl-10 pr-10 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700/80 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-left",
              dir: "ltr",
              id: "signup-password-input"
            }
          ),
          /* @__PURE__ */ jsx10(Lock3, { className: "w-4 h-4 text-zinc-400 absolute right-3 top-3 pointer-events-none" }),
          /* @__PURE__ */ jsx10(
            "button",
            {
              type: "button",
              onClick: () => setShowPassword(!showPassword),
              className: "absolute left-3 top-3 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 focus:outline-none cursor-pointer",
              "aria-label": "Toggle password visibility",
              children: showPassword ? /* @__PURE__ */ jsx10(EyeOff2, { className: "w-4 h-4" }) : /* @__PURE__ */ jsx10(Eye, { className: "w-4 h-4" })
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs10("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsx10("label", { className: "text-xs font-semibold text-zinc-700 dark:text-zinc-300", children: "\u062A\u0623\u0643\u064A\u062F \u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631 (Confirm Password)" }),
        /* @__PURE__ */ jsxs10("div", { className: "relative", children: [
          /* @__PURE__ */ jsx10(
            "input",
            {
              type: showPassword ? "text" : "password",
              required: true,
              value: confirmPassword,
              onChange: (e) => setConfirmPassword(e.target.value),
              placeholder: "\u0623\u0639\u062F \u0643\u062A\u0627\u0628\u0629 \u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631",
              className: "w-full pl-3 pr-10 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700/80 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-left",
              dir: "ltr",
              id: "signup-confirm-password-input"
            }
          ),
          /* @__PURE__ */ jsx10(KeyRound4, { className: "w-4 h-4 text-zinc-400 absolute right-3 top-3 pointer-events-none" })
        ] })
      ] }),
      /* @__PURE__ */ jsx10(
        "button",
        {
          type: "submit",
          disabled: loading,
          className: "w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-medium text-sm flex items-center justify-center gap-2 shadow-md shadow-blue-600/20 disabled:opacity-60 transition-all cursor-pointer",
          id: "signup-submit-btn",
          children: loading ? /* @__PURE__ */ jsx10("div", { className: "w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" }) : /* @__PURE__ */ jsxs10(Fragment6, { children: [
            /* @__PURE__ */ jsx10("span", { children: "\u0625\u0631\u0633\u0627\u0644 \u0631\u0645\u0632 \u0627\u0644\u062A\u0623\u0643\u064A\u062F \u0648\u0627\u0644\u0645\u062A\u0627\u0628\u0639\u0629" }),
            /* @__PURE__ */ jsx10(Send2, { className: "w-4 h-4" })
          ] })
        }
      ),
      /* @__PURE__ */ jsx10("div", { className: "pt-3 border-t border-zinc-100 dark:border-zinc-800 text-center", children: /* @__PURE__ */ jsxs10("p", { className: "text-xs text-zinc-600 dark:text-zinc-400", children: [
        "\u0644\u062F\u064A\u0643 \u062D\u0633\u0627\u0628 \u0628\u0627\u0644\u0641\u0639\u0644\u061F",
        " ",
        /* @__PURE__ */ jsx10(
          "button",
          {
            type: "button",
            onClick: () => {
              clearMessages();
              setMode("login");
            },
            className: "text-blue-600 dark:text-blue-400 font-bold hover:underline cursor-pointer transition-colors",
            id: "back-to-login-btn",
            children: "\u062A\u0633\u062C\u064A\u0644 \u0627\u0644\u062F\u062E\u0648\u0644 (Sign in)"
          }
        )
      ] }) })
    ] }),
    mode === "verify" && /* @__PURE__ */ jsxs10("form", { onSubmit: handleVerifyCode, className: "space-y-4", children: [
      /* @__PURE__ */ jsxs10("div", { className: "p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700/80 space-y-2 text-center", children: [
        /* @__PURE__ */ jsx10("div", { className: "w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto", children: /* @__PURE__ */ jsx10(Mail, { className: "w-5 h-5" }) }),
        /* @__PURE__ */ jsx10("div", { className: "text-xs text-zinc-600 dark:text-zinc-300", children: "\u062D\u0633\u0627\u0628\u0643 \u0628\u0627\u0646\u062A\u0638\u0627\u0631 \u0627\u0644\u062A\u0623\u0643\u064A\u062F \u0644\u0639\u0646\u0648\u0627\u0646 \u0627\u0644\u0628\u0631\u064A\u062F:" }),
        /* @__PURE__ */ jsx10("div", { className: "font-mono font-bold text-sm text-blue-600 dark:text-blue-400 bg-white dark:bg-zinc-900/80 py-1 px-3 rounded-lg border border-zinc-200 dark:border-zinc-800 inline-block", dir: "ltr", children: email })
      ] }),
      /* @__PURE__ */ jsxs10("div", { className: "p-3.5 rounded-2xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 space-y-1.5 text-right", children: [
        /* @__PURE__ */ jsxs10("div", { className: "flex items-center gap-2 text-xs font-bold text-blue-900 dark:text-blue-300", children: [
          /* @__PURE__ */ jsx10("span", { children: "\u{1F4EC}" }),
          /* @__PURE__ */ jsx10("span", { children: "\u062A\u0646\u0628\u064A\u0647 \u0647\u0627\u0645 \u062D\u0648\u0644 \u0631\u0633\u0627\u0626\u0644 \u0627\u0644\u062A\u0623\u0643\u064A\u062F:" })
        ] }),
        /* @__PURE__ */ jsxs10("p", { className: "text-[11px] text-zinc-600 dark:text-zinc-300 leading-relaxed", children: [
          "\u0625\u0630\u0627 \u0648\u0635\u0644\u062A\u0643 \u0631\u0633\u0627\u0644\u0629 \u062A\u062D\u062A\u0648\u064A \u0639\u0644\u0649 ",
          /* @__PURE__ */ jsx10("strong", { children: "\u0631\u0627\u0628\u0637 \u062A\u0623\u0643\u064A\u062F (Confirmation Link)" }),
          "\u060C \u0627\u0636\u063A\u0637 \u0639\u0644\u064A\u0647 \u0641\u064A \u0628\u0631\u064A\u062F\u0643\u060C \u062B\u0645 \u0627\u0646\u0642\u0631 \u0639\u0644\u0649 \u0632\u0631 ",
          /* @__PURE__ */ jsx10("strong", { children: '"\u062A\u062D\u0642\u0642 \u0645\u0646 \u062A\u0641\u0639\u064A\u0644 \u0627\u0644\u0631\u0627\u0628\u0637"' }),
          " \u0623\u062F\u0646\u0627\u0647.",
          /* @__PURE__ */ jsx10("br", {}),
          "\u0623\u0645\u0627 \u0625\u0630\u0627 \u0643\u0627\u0646 \u0628\u0627\u0644\u0631\u0633\u0627\u0644\u0629 ",
          /* @__PURE__ */ jsx10("strong", { children: "\u0631\u0645\u0632 \u0623\u0631\u0642\u0627\u0645 (OTP)" }),
          "\u060C \u0641\u0627\u0643\u062A\u0628\u0647 \u0641\u064A \u0627\u0644\u062E\u0627\u0646\u0627\u062A \u0627\u0644\u0633\u062A\u0629 \u0628\u0627\u0644\u0623\u0633\u0641\u0644."
        ] })
      ] }),
      activeOtpCode && /* @__PURE__ */ jsxs10("div", { className: "p-3.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 rounded-2xl flex items-center justify-between gap-3 text-xs sm:text-sm shadow-sm", children: [
        /* @__PURE__ */ jsxs10("div", { className: "text-right space-y-0.5", children: [
          /* @__PURE__ */ jsx10("span", { className: "text-zinc-600 dark:text-zinc-300 font-medium block text-xs", children: "\u0631\u0645\u0632 \u0627\u0644\u062A\u062D\u0642\u0642 \u0627\u0644\u0633\u0631\u064A\u0639:" }),
          /* @__PURE__ */ jsx10("span", { className: "font-mono font-bold text-xl text-emerald-600 dark:text-emerald-400 tracking-widest block", dir: "ltr", children: activeOtpCode })
        ] }),
        /* @__PURE__ */ jsx10(
          "button",
          {
            type: "button",
            onClick: () => {
              const digits = activeOtpCode.slice(0, 6).split("");
              setOtpDigits(digits);
              otpInputRefs.current[5]?.focus();
            },
            className: "px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer whitespace-nowrap",
            id: "auto-fill-otp-btn",
            children: "\u062A\u0639\u0628\u0626\u0629 \u0627\u0644\u0631\u0645\u0632 \u062A\u0644\u0642\u0627\u0626\u064A\u0627\u064B \u26A1"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs10("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx10("label", { className: "text-xs font-semibold text-zinc-700 dark:text-zinc-300 block text-center", children: "\u0623\u062F\u062E\u0644 \u0631\u0645\u0632 \u0627\u0644\u062A\u0623\u0643\u064A\u062F (OTP) \u0627\u0644\u0645\u0643\u0648\u0646 \u0645\u0646 6 \u0623\u0631\u0642\u0627\u0645:" }),
        /* @__PURE__ */ jsx10("div", { className: "flex justify-center items-center gap-2 sm:gap-2.5", dir: "ltr", children: otpDigits.map((digit, idx) => /* @__PURE__ */ jsx10(
          "input",
          {
            ref: (el) => {
              otpInputRefs.current[idx] = el;
            },
            type: "text",
            inputMode: "numeric",
            pattern: "[0-9]*",
            maxLength: 1,
            value: digit,
            onChange: (e) => handleOtpChange(idx, e.target.value),
            onKeyDown: (e) => handleOtpKeyDown(idx, e),
            className: "w-11 h-13 sm:w-12 sm:h-14 text-center text-xl sm:text-2xl font-mono font-bold rounded-xl bg-zinc-50 dark:bg-zinc-800/90 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-inner",
            id: `otp-digit-${idx}`
          },
          idx
        )) })
      ] }),
      /* @__PURE__ */ jsx10(
        "button",
        {
          type: "submit",
          disabled: loading || otpDigits.join("").length < 6,
          className: "w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white font-medium text-sm flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 disabled:opacity-50 transition-all cursor-pointer",
          id: "verify-submit-btn",
          children: loading ? /* @__PURE__ */ jsx10("div", { className: "w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" }) : /* @__PURE__ */ jsxs10(Fragment6, { children: [
            /* @__PURE__ */ jsx10(CheckCircle23, { className: "w-4 h-4" }),
            /* @__PURE__ */ jsx10("span", { children: "\u062A\u0623\u0643\u064A\u062F \u0627\u0644\u062D\u0633\u0627\u0628 \u0648\u0627\u0644\u062F\u062E\u0648\u0644 \u0628\u0627\u0644\u0631\u0645\u0632" })
          ] })
        }
      ),
      /* @__PURE__ */ jsxs10(
        "button",
        {
          type: "button",
          onClick: handleCheckConfirmationLink,
          disabled: checkingStatus,
          className: "w-full py-2 px-3 rounded-xl border border-blue-200 dark:border-blue-800/80 bg-blue-50/50 dark:bg-blue-950/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-300 text-xs font-medium flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-50",
          id: "check-confirmation-link-btn",
          children: [
            checkingStatus ? /* @__PURE__ */ jsx10("div", { className: "w-3.5 h-3.5 border-2 border-blue-600/30 border-t-blue-600 rounded-full animate-spin" }) : /* @__PURE__ */ jsx10(RefreshCw3, { className: "w-3.5 h-3.5 text-blue-500" }),
            /* @__PURE__ */ jsx10("span", { children: "\u062A\u062D\u0642\u0642 \u0645\u0646 \u062A\u0641\u0639\u064A\u0644 \u0627\u0644\u0631\u0627\u0628\u0637 (\u0625\u0630\u0627 \u0636\u063A\u0637\u062A \u0639\u0644\u064A\u0647 \u0641\u064A \u0627\u0644\u0625\u064A\u0645\u064A\u0644) \u{1F504}" })
          ]
        }
      ),
      /* @__PURE__ */ jsxs10("div", { className: "pt-2 border-t border-zinc-100 dark:border-zinc-800 space-y-2", children: [
        /* @__PURE__ */ jsxs10("div", { className: "flex items-center justify-between text-xs", children: [
          /* @__PURE__ */ jsxs10(
            "button",
            {
              type: "button",
              onClick: handleResend,
              disabled: loading || resendCooldown > 0,
              className: "flex items-center gap-1.5 text-zinc-600 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed",
              id: "resend-code-btn",
              children: [
                /* @__PURE__ */ jsx10(RefreshCw3, { className: `w-3.5 h-3.5 ${loading ? "animate-spin" : ""}` }),
                /* @__PURE__ */ jsx10("span", { children: resendCooldown > 0 ? `\u0625\u0639\u0627\u062F\u0629 \u0627\u0644\u0625\u0631\u0633\u0627\u0644 \u0628\u0639\u062F (${resendCooldown}\u062B)` : "\u0625\u0639\u0627\u062F\u0629 \u0625\u0631\u0633\u0627\u0644 \u0627\u0644\u0631\u0645\u0632 \u0623\u0648 \u0627\u0644\u0631\u0627\u0628\u0637" })
              ]
            }
          ),
          /* @__PURE__ */ jsx10(
            "button",
            {
              type: "button",
              onClick: handleSkipVerification,
              className: "text-amber-600 dark:text-amber-400 hover:underline font-bold cursor-pointer flex items-center gap-1 text-xs",
              id: "skip-verification-btn",
              title: "\u062A\u062E\u0637\u064A \u0634\u0627\u0634\u0629 \u0627\u0644\u062A\u0623\u0643\u064A\u062F \u0648\u0627\u0644\u0645\u062A\u0627\u0628\u0639\u0629 \u0644\u0644\u062F\u062E\u0648\u0644 \u0645\u0628\u0627\u0634\u0631\u0629",
              children: /* @__PURE__ */ jsx10("span", { children: "\u062A\u062E\u0637\u064A \u0627\u0644\u062A\u0623\u0643\u064A\u062F \u0648\u0627\u0644\u062F\u062E\u0648\u0644 \u26A1" })
            }
          )
        ] }),
        /* @__PURE__ */ jsx10("div", { className: "text-center pt-1", children: /* @__PURE__ */ jsx10(
          "button",
          {
            type: "button",
            onClick: () => {
              clearMessages();
              setMode("login");
            },
            className: "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 text-xs cursor-pointer",
            children: "\u0627\u0644\u0639\u0648\u062F\u0629 \u0625\u0644\u0649 \u0634\u0627\u0634\u0629 \u062A\u0633\u062C\u064A\u0644 \u0627\u0644\u062F\u062E\u0648\u0644"
          }
        ) })
      ] })
    ] }),
    showSupabaseModal && /* @__PURE__ */ jsx10("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs", children: /* @__PURE__ */ jsxs10("div", { className: "w-full max-w-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl p-6 space-y-4 text-right", children: [
      /* @__PURE__ */ jsxs10("div", { className: "flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3", children: [
        /* @__PURE__ */ jsx10(
          "button",
          {
            type: "button",
            onClick: () => setShowSupabaseModal(false),
            className: "p-1 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 cursor-pointer",
            children: "\u2715"
          }
        ),
        /* @__PURE__ */ jsxs10("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx10("span", { className: "font-bold text-sm text-zinc-900 dark:text-zinc-100", children: "\u0625\u0639\u062F\u0627\u062F\u0627\u062A \u0648\u0631\u0628\u0637 Supabase" }),
          /* @__PURE__ */ jsx10("div", { className: "w-6 h-6 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold text-xs", children: "\u26A1" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs10("p", { className: "text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed", children: [
        "\u0627\u0631\u0628\u0637 \u0645\u0634\u0631\u0648\u0639\u0643 \u0639\u0644\u0649 ",
        /* @__PURE__ */ jsx10("strong", { children: "Supabase" }),
        " \u0644\u062A\u0634\u063A\u064A\u0644 \u062A\u0633\u062C\u064A\u0644 \u0627\u0644\u062F\u062E\u0648\u0644 \u0627\u0644\u0633\u062D\u0627\u0628\u064A \u0627\u0644\u0641\u0639\u0644\u064A\u060C \u0648\u062A\u0623\u0643\u064A\u062F \u0627\u0644\u0628\u0631\u064A\u062F \u0627\u0644\u0625\u0644\u0643\u062A\u0631\u0648\u0646\u064A (OTP)\u060C \u0648\u062D\u0641\u0638 \u0627\u0644\u0645\u0633\u062A\u062E\u062F\u0645\u064A\u0646 \u0641\u064A \u0644\u0648\u062D\u0629 \u062A\u062D\u0643\u0645 Supabase \u0627\u0644\u062E\u0627\u0635\u0629 \u0628\u0643."
      ] }),
      supabaseConfigError && /* @__PURE__ */ jsx10("div", { className: "p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/60 text-xs text-rose-700 dark:text-rose-300", children: supabaseConfigError }),
      supabaseConfigSuccess && /* @__PURE__ */ jsx10("div", { className: "p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-900/60 text-xs text-emerald-700 dark:text-emerald-300", children: supabaseConfigSuccess }),
      /* @__PURE__ */ jsxs10("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxs10("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsx10("label", { className: "text-xs font-semibold text-zinc-700 dark:text-zinc-300 block", children: "Supabase Project URL:" }),
          /* @__PURE__ */ jsx10(
            "input",
            {
              type: "url",
              placeholder: "https://xyzproject.supabase.co",
              value: supabaseUrlInput,
              onChange: (e) => setSupabaseUrlInput(e.target.value),
              className: "w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-xs text-zinc-900 dark:text-zinc-100 text-left font-mono",
              dir: "ltr"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs10("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsx10("label", { className: "text-xs font-semibold text-zinc-700 dark:text-zinc-300 block", children: "Supabase Anon Public Key:" }),
          /* @__PURE__ */ jsx10(
            "input",
            {
              type: "text",
              placeholder: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
              value: supabaseKeyInput,
              onChange: (e) => setSupabaseKeyInput(e.target.value),
              className: "w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-xs text-zinc-900 dark:text-zinc-100 text-left font-mono",
              dir: "ltr"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs10("div", { className: "p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/50 text-[11px] text-blue-700 dark:text-blue-300 leading-relaxed", children: [
          "\u{1F4A1} \u062A\u062C\u062F \u0647\u0630\u0647 \u0627\u0644\u0642\u064A\u0645 \u0641\u064A \u0644\u0648\u062D\u0629 \u062A\u062D\u0643\u0645 ",
          /* @__PURE__ */ jsx10("strong", { children: "Supabase Dashboard" }),
          " \u2B05\uFE0F ",
          /* @__PURE__ */ jsx10("strong", { children: "Project Settings" }),
          " \u2B05\uFE0F ",
          /* @__PURE__ */ jsx10("strong", { children: "API" }),
          "."
        ] }),
        /* @__PURE__ */ jsxs10("div", { className: "flex items-center gap-2 pt-2", children: [
          /* @__PURE__ */ jsx10(
            "button",
            {
              type: "button",
              onClick: handleSaveSupabaseConfig,
              className: "flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer",
              children: "\u062D\u0641\u0638 \u0648\u0631\u0628\u0637 Supabase"
            }
          ),
          hasSupabase && /* @__PURE__ */ jsx10(
            "button",
            {
              type: "button",
              onClick: handleResetSupabaseConfig,
              className: "px-3 py-2.5 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900 rounded-xl text-xs font-medium transition-colors cursor-pointer",
              children: "\u0641\u0635\u0644 \u0627\u0644\u0645\u0634\u0631\u0648\u0639"
            }
          )
        ] })
      ] })
    ] }) })
  ] }) });
};

// src/components/ProfileView.tsx
import { useState as useState6, useRef as useRef5 } from "react";
import {
  User as User4,
  Mail as Mail2,
  Camera as Camera4,
  Laptop as Laptop3,
  Calendar,
  CheckCircle as CheckCircle3,
  Save,
  LogOut as LogOut2,
  ShieldCheck as ShieldCheck7,
  Trash2 as Trash22,
  UploadCloud as UploadCloud2,
  AlertCircle as AlertCircle6
} from "lucide-react";
import { Fragment as Fragment7, jsx as jsx11, jsxs as jsxs11 } from "react/jsx-runtime";
var PRESET_AVATARS = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&h=160&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=160&h=160&q=80",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=160&h=160&q=80",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=160&h=160&q=80",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=160&h=160&q=80",
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=160&h=160&q=80"
];
var ProfileView = ({
  user,
  onUpdateUser,
  onLogout
}) => {
  const [name, setName] = useState6(user.name);
  const [deviceName, setDeviceName] = useState6(user.deviceName || "");
  const [avatarUrl, setAvatarUrl] = useState6(user.avatarUrl || "");
  const [saving, setSaving] = useState6(false);
  const [successMsg, setSuccessMsg] = useState6(null);
  const [errorMsg, setErrorMsg] = useState6(null);
  const fileInputRef = useRef5(null);
  const handleImageFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setErrorMsg("\u064A\u0631\u062C\u0649 \u0627\u062E\u062A\u064A\u0627\u0631 \u0645\u0644\u0641 \u0635\u0648\u0631\u0629 \u0635\u0627\u0644\u062D (PNG, JPG, WebP)");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setErrorMsg("\u062D\u062C\u0645 \u0627\u0644\u0635\u0648\u0631\u0629 \u0643\u0628\u064A\u0631 \u062C\u062F\u0627\u064B\u060C \u064A\u0631\u062C\u0649 \u0627\u062E\u062A\u064A\u0627\u0631 \u0635\u0648\u0631\u0629 \u0623\u0642\u0644 \u0645\u0646 2 \u0645\u064A\u063A\u0627\u0628\u0627\u064A\u062A");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setAvatarUrl(reader.result);
        setErrorMsg(null);
      }
    };
    reader.readAsDataURL(file);
  };
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg(null);
    setErrorMsg(null);
    try {
      const res = await updateUserProfile({
        name: name.trim(),
        avatarUrl,
        deviceName: deviceName.trim()
      });
      if (res.success && res.user) {
        onUpdateUser(res.user);
        setSuccessMsg("\u062A\u0645 \u062D\u0641\u0638 \u0648\u062A\u062D\u062F\u064A\u062B \u0628\u064A\u0627\u0646\u0627\u062A \u062D\u0633\u0627\u0628\u0643 \u0628\u0646\u062C\u0627\u062D!");
        setTimeout(() => setSuccessMsg(null), 4e3);
      } else {
        setErrorMsg(res.error || "\u062A\u0639\u0630\u0631 \u062D\u0641\u0638 \u0627\u0644\u062A\u0639\u062F\u064A\u0644\u0627\u062A");
      }
    } catch (err) {
      setErrorMsg(err.message || "\u062D\u062F\u062B \u062E\u0637\u0623 \u0623\u062B\u0646\u0627\u0621 \u0627\u0644\u062D\u0641\u0638");
    } finally {
      setSaving(false);
    }
  };
  return /* @__PURE__ */ jsxs11("div", { className: "max-w-3xl mx-auto px-4 py-8 space-y-6", children: [
    /* @__PURE__ */ jsxs11("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4", children: [
      /* @__PURE__ */ jsxs11("div", { children: [
        /* @__PURE__ */ jsxs11("h2", { className: "text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 flex items-center gap-2", children: [
          /* @__PURE__ */ jsx11(User4, { className: "w-6 h-6 text-blue-600 dark:text-blue-400" }),
          /* @__PURE__ */ jsx11("span", { children: "\u0625\u062F\u0627\u0631\u0629 \u0627\u0644\u062D\u0633\u0627\u0628 \u0627\u0644\u0634\u062E\u0635\u064A (Profile)" })
        ] }),
        /* @__PURE__ */ jsx11("p", { className: "text-xs text-zinc-500 dark:text-zinc-400 mt-1", children: "\u062E\u0635\u0635 \u0627\u0633\u0645\u0643\u060C \u0635\u0648\u0631\u062A\u0643 \u0627\u0644\u0631\u0645\u0632\u064A\u0629\u060C \u0648\u0627\u0633\u0645 \u062C\u0647\u0627\u0632\u0643 \u0627\u0644\u0638\u0627\u0647\u0631 \u0644\u0644\u0637\u0631\u0641 \u0627\u0644\u0622\u062E\u0631 \u0623\u062B\u0646\u0627\u0621 \u0627\u0644\u0625\u0631\u0633\u0627\u0644." })
      ] }),
      /* @__PURE__ */ jsxs11(
        "button",
        {
          type: "button",
          onClick: onLogout,
          className: "inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/50 border border-rose-200 dark:border-rose-900/50 transition-colors cursor-pointer self-start sm:self-center",
          id: "profile-logout-btn",
          children: [
            /* @__PURE__ */ jsx11(LogOut2, { className: "w-3.5 h-3.5" }),
            /* @__PURE__ */ jsx11("span", { children: "\u062A\u0633\u062C\u064A\u0644 \u0627\u0644\u062E\u0631\u0648\u062C (Log out)" })
          ]
        }
      )
    ] }),
    successMsg && /* @__PURE__ */ jsxs11("div", { className: "p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-900/60 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2", children: [
      /* @__PURE__ */ jsx11(CheckCircle3, { className: "w-4 h-4 text-emerald-600 shrink-0" }),
      /* @__PURE__ */ jsx11("span", { children: successMsg })
    ] }),
    errorMsg && /* @__PURE__ */ jsxs11("div", { className: "p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/60 text-xs text-rose-800 dark:text-rose-300 flex items-center gap-2", children: [
      /* @__PURE__ */ jsx11(AlertCircle6, { className: "w-4 h-4 text-rose-600 shrink-0" }),
      /* @__PURE__ */ jsx11("span", { children: errorMsg })
    ] }),
    /* @__PURE__ */ jsxs11("form", { onSubmit: handleSaveProfile, className: "bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-8", children: [
      /* @__PURE__ */ jsxs11("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsx11("label", { className: "block text-sm font-bold text-zinc-900 dark:text-zinc-100", children: "\u0635\u0648\u0631\u0629 \u0627\u0644\u062D\u0633\u0627\u0628 (Avatar Photo)" }),
        /* @__PURE__ */ jsxs11("div", { className: "flex flex-col sm:flex-row items-center gap-6", children: [
          /* @__PURE__ */ jsxs11("div", { className: "relative group", children: [
            /* @__PURE__ */ jsx11("div", { className: "w-24 h-24 rounded-full overflow-hidden bg-zinc-100 dark:bg-zinc-800 border-2 border-blue-500 shadow-md flex items-center justify-center text-zinc-400", children: avatarUrl ? /* @__PURE__ */ jsx11(
              "img",
              {
                src: avatarUrl,
                alt: name,
                className: "w-full h-full object-cover",
                referrerPolicy: "no-referrer"
              }
            ) : /* @__PURE__ */ jsx11(User4, { className: "w-10 h-10 text-zinc-400" }) }),
            /* @__PURE__ */ jsx11(
              "button",
              {
                type: "button",
                onClick: () => fileInputRef.current?.click(),
                className: "absolute bottom-0 right-0 p-2 rounded-full bg-blue-600 text-white shadow-md hover:bg-blue-700 transition-transform active:scale-95 cursor-pointer",
                title: "\u062A\u063A\u064A\u064A\u0631 \u0627\u0644\u0635\u0648\u0631\u0629",
                "aria-label": "\u062A\u063A\u064A\u064A\u0631 \u0627\u0644\u0635\u0648\u0631\u0629",
                children: /* @__PURE__ */ jsx11(Camera4, { className: "w-3.5 h-3.5" })
              }
            ),
            /* @__PURE__ */ jsx11(
              "input",
              {
                ref: fileInputRef,
                type: "file",
                accept: "image/*",
                onChange: handleImageFileChange,
                className: "hidden"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs11("div", { className: "space-y-2 text-center sm:text-right flex-1", children: [
            /* @__PURE__ */ jsxs11("div", { className: "flex flex-wrap items-center justify-center sm:justify-start gap-2", children: [
              /* @__PURE__ */ jsxs11(
                "button",
                {
                  type: "button",
                  onClick: () => fileInputRef.current?.click(),
                  className: "px-3 py-1.5 rounded-lg text-xs font-semibold bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 transition-colors flex items-center gap-1.5 cursor-pointer",
                  children: [
                    /* @__PURE__ */ jsx11(UploadCloud2, { className: "w-3.5 h-3.5" }),
                    /* @__PURE__ */ jsx11("span", { children: "\u0631\u0641\u0639 \u0635\u0648\u0631\u0629 \u0645\u0646 \u0627\u0644\u062C\u0647\u0627\u0632" })
                  ]
                }
              ),
              avatarUrl && /* @__PURE__ */ jsxs11(
                "button",
                {
                  type: "button",
                  onClick: () => setAvatarUrl(""),
                  className: "px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors flex items-center gap-1.5 cursor-pointer",
                  children: [
                    /* @__PURE__ */ jsx11(Trash22, { className: "w-3.5 h-3.5" }),
                    /* @__PURE__ */ jsx11("span", { children: "\u0625\u0632\u0627\u0644\u0629 \u0627\u0644\u0635\u0648\u0631\u0629" })
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsx11("p", { className: "text-[11px] text-zinc-400", children: "\u064A\u062F\u0639\u0645 \u0635\u064A\u063A PNG, JPG, WebP \u0628\u062D\u062C\u0645 \u0623\u0642\u0635\u0649 2 \u0645\u064A\u063A\u0627\u0628\u0627\u064A\u062A" }),
            /* @__PURE__ */ jsxs11("div", { className: "pt-2", children: [
              /* @__PURE__ */ jsx11("p", { className: "text-[11px] text-zinc-500 font-medium mb-1.5", children: "\u0623\u0648 \u0627\u062E\u062A\u0631 \u0635\u0648\u0631\u0629 \u062C\u0627\u0647\u0632\u0629:" }),
              /* @__PURE__ */ jsx11("div", { className: "flex items-center justify-center sm:justify-start gap-2", children: PRESET_AVATARS.map((url, idx) => /* @__PURE__ */ jsx11(
                "button",
                {
                  type: "button",
                  onClick: () => setAvatarUrl(url),
                  className: `w-8 h-8 rounded-full overflow-hidden border-2 transition-transform hover:scale-110 cursor-pointer ${avatarUrl === url ? "border-blue-500 scale-105" : "border-transparent"}`,
                  children: /* @__PURE__ */ jsx11("img", { src: url, alt: `avatar-${idx}`, className: "w-full h-full object-cover", referrerPolicy: "no-referrer" })
                },
                idx
              )) })
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs11("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-5 pt-4 border-t border-zinc-100 dark:border-zinc-800", children: [
        /* @__PURE__ */ jsxs11("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsx11("label", { className: "text-xs font-semibold text-zinc-700 dark:text-zinc-300", children: "\u0627\u0644\u0627\u0633\u0645 \u0627\u0644\u0638\u0627\u0647\u0631 (Display Name)" }),
          /* @__PURE__ */ jsxs11("div", { className: "relative", children: [
            /* @__PURE__ */ jsx11(
              "input",
              {
                type: "text",
                required: true,
                value: name,
                onChange: (e) => setName(e.target.value),
                placeholder: "\u0627\u0633\u0645\u0643 \u0627\u0644\u0643\u0627\u0645\u0644",
                className: "w-full pl-3 pr-10 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700/80 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all",
                id: "profile-name-input"
              }
            ),
            /* @__PURE__ */ jsx11(User4, { className: "w-4 h-4 text-zinc-400 absolute right-3 top-3 pointer-events-none" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs11("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsx11("label", { className: "text-xs font-semibold text-zinc-700 dark:text-zinc-300", children: "\u0627\u0633\u0645 \u0627\u0644\u062C\u0647\u0627\u0632 \u0627\u0644\u0645\u062E\u0635\u0635 (Custom Device Name)" }),
          /* @__PURE__ */ jsxs11("div", { className: "relative", children: [
            /* @__PURE__ */ jsx11(
              "input",
              {
                type: "text",
                value: deviceName,
                onChange: (e) => setDeviceName(e.target.value),
                placeholder: "\u0645\u062B\u0627\u0644: \u0644\u0627\u0628\u062A\u0648\u0628 \u0627\u0644\u0639\u0645\u0644 \u0623\u0648 iPhone 15",
                className: "w-full pl-3 pr-10 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700/80 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all",
                id: "profile-device-name-input"
              }
            ),
            /* @__PURE__ */ jsx11(Laptop3, { className: "w-4 h-4 text-zinc-400 absolute right-3 top-3 pointer-events-none" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs11("div", { className: "p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 space-y-3", children: [
        /* @__PURE__ */ jsx11("div", { className: "text-xs font-bold text-zinc-700 dark:text-zinc-300", children: "\u0645\u0639\u0644\u0648\u0645\u0627\u062A \u0627\u0644\u062D\u0633\u0627\u0628 \u0627\u0644\u0645\u0633\u062C\u0644" }),
        /* @__PURE__ */ jsxs11("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs", children: [
          /* @__PURE__ */ jsxs11("div", { className: "flex items-center gap-2 text-zinc-600 dark:text-zinc-400", children: [
            /* @__PURE__ */ jsx11(Mail2, { className: "w-4 h-4 text-zinc-400 shrink-0" }),
            /* @__PURE__ */ jsx11("span", { className: "font-mono text-zinc-900 dark:text-zinc-100 truncate", children: user.email })
          ] }),
          /* @__PURE__ */ jsxs11("div", { className: "flex items-center gap-2 text-zinc-600 dark:text-zinc-400", children: [
            /* @__PURE__ */ jsx11(ShieldCheck7, { className: "w-4 h-4 text-emerald-500 shrink-0" }),
            /* @__PURE__ */ jsx11("span", { className: "text-emerald-700 dark:text-emerald-400 font-medium", children: "\u062D\u0633\u0627\u0628 \u0645\u0624\u0643\u062F \u0648\u0645\u062D\u0645\u064A \u0628\u0627\u0644\u0643\u0627\u0645\u0644" })
          ] }),
          user.createdAt && /* @__PURE__ */ jsxs11("div", { className: "flex items-center gap-2 text-zinc-600 dark:text-zinc-400", children: [
            /* @__PURE__ */ jsx11(Calendar, { className: "w-4 h-4 text-zinc-400 shrink-0" }),
            /* @__PURE__ */ jsxs11("span", { children: [
              "\u0639\u0636\u0648 \u0645\u0646\u0630: ",
              new Date(user.createdAt).toLocaleDateString("ar-EG")
            ] })
          ] }),
          /* @__PURE__ */ jsxs11("div", { className: "flex items-center gap-2 text-zinc-600 dark:text-zinc-400", children: [
            /* @__PURE__ */ jsx11("span", { className: "font-semibold", children: "\u0627\u0644\u0645\u0632\u0648\u062F:" }),
            /* @__PURE__ */ jsx11("span", { className: "font-mono text-[11px] text-zinc-500", children: user.provider === "google" ? "Google OAuth 2.0" : isSupabaseConfigured ? "Supabase Auth" : "\u0646\u0638\u0627\u0645 \u0627\u0644\u0645\u0635\u0627\u062F\u0642\u0629 \u0627\u0644\u0645\u0634\u0641\u0631" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx11("div", { className: "flex justify-end", children: /* @__PURE__ */ jsx11(
        "button",
        {
          type: "submit",
          disabled: saving,
          className: "px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-medium text-sm flex items-center gap-2 shadow-md shadow-blue-600/20 disabled:opacity-60 transition-all cursor-pointer",
          id: "profile-save-btn",
          children: saving ? /* @__PURE__ */ jsx11("div", { className: "w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" }) : /* @__PURE__ */ jsxs11(Fragment7, { children: [
            /* @__PURE__ */ jsx11(Save, { className: "w-4 h-4" }),
            /* @__PURE__ */ jsx11("span", { children: "\u062D\u0641\u0638 \u0627\u0644\u062A\u0639\u062F\u064A\u0644\u0627\u062A" })
          ] })
        }
      ) })
    ] })
  ] });
};

// src/lib/device.ts
function getLocalDeviceInfo() {
  const ua = navigator.userAgent || "";
  let os = "Unknown OS";
  if (/iPad|iPhone|iPod/.test(ua)) {
    os = "iOS";
  } else if (/Android/.test(ua)) {
    os = "Android";
  } else if (/Macintosh|Mac OS X/.test(ua)) {
    os = "macOS";
  } else if (/Windows NT/.test(ua)) {
    os = "Windows";
  } else if (/Linux/.test(ua)) {
    os = "Linux";
  }
  let browser = "Browser";
  if (/Edg\//.test(ua)) {
    browser = "Edge";
  } else if (/Chrome\//.test(ua) && !/Edg\//.test(ua)) {
    browser = "Chrome";
  } else if (/Safari\//.test(ua) && !/Chrome\//.test(ua)) {
    browser = "Safari";
  } else if (/Firefox\//.test(ua)) {
    browser = "Firefox";
  } else if (/OPR\//.test(ua) || /Opera\//.test(ua)) {
    browser = "Opera";
  }
  let type = "desktop";
  if (/Mobi|Android|iPhone/i.test(ua)) {
    type = "mobile";
  } else if (/iPad|Tablet/i.test(ua) || os === "macOS" && navigator.maxTouchPoints > 1) {
    type = "tablet";
  }
  const name = `${browser} on ${os}`;
  return {
    name,
    os,
    browser,
    type
  };
}

// src/lib/supabase-service.ts
var SupabaseService = class {
  static {
    this.activeChannels = /* @__PURE__ */ new Map();
  }
  /**
   * Subscribe to a Supabase Realtime Channel for ultra-low-latency signaling
   */
  static subscribeToSignalingChannel(safeTopic, onMessage) {
    const supabase = getSupabaseClient();
    if (!supabase) return null;
    try {
      const channelName = `quickdrop:${safeTopic}`;
      if (this.activeChannels.has(channelName)) {
        try {
          const old = this.activeChannels.get(channelName);
          old?.unsubscribe();
        } catch {
        }
      }
      const channel = supabase.channel(channelName, {
        config: {
          broadcast: { self: false }
        }
      });
      channel.on("broadcast", { event: "signal" }, (event) => {
        if (event && event.payload) {
          onMessage(event.payload);
        }
      }).subscribe((status) => {
        if (status === "SUBSCRIBED") {
          console.log(`[Supabase Realtime] Connected to channel: ${channelName}`);
        }
      });
      this.activeChannels.set(channelName, channel);
      return channel;
    } catch (err) {
      console.warn("[Supabase Realtime] Subscribe failed:", err);
      return null;
    }
  }
  /**
   * Broadcast a signaling message through the Supabase Realtime Channel
   */
  static async broadcastSignal(safeTopic, payload) {
    const channelName = `quickdrop:${safeTopic}`;
    const channel = this.activeChannels.get(channelName);
    if (!channel) return false;
    try {
      await channel.send({
        type: "broadcast",
        event: "signal",
        payload
      });
      return true;
    } catch (err) {
      console.warn("[Supabase Realtime] Broadcast failed:", err);
      return false;
    }
  }
  /**
   * Unsubscribe from signaling channel
   */
  static unsubscribeSignalingChannel(safeTopic) {
    const channelName = `quickdrop:${safeTopic}`;
    const channel = this.activeChannels.get(channelName);
    if (channel) {
      try {
        channel.unsubscribe();
      } catch {
      }
      this.activeChannels.delete(channelName);
    }
  }
  /**
   * Record session in Supabase Database (graceful try/catch fallback)
   */
  static async recordSession(session, hostDeviceInfo) {
    const supabase = getSupabaseClient();
    if (!supabase) return;
    try {
      await supabase.from("quickdrop_sessions").upsert(
        {
          session_id: session.sessionId,
          host_device: hostDeviceInfo || null,
          status: "waiting",
          expires_at: session.expiresAt,
          updated_at: (/* @__PURE__ */ new Date()).toISOString()
        },
        { onConflict: "session_id" }
      );
    } catch (err) {
      console.debug("[Supabase DB] Session record skipped:", err);
    }
  }
  /**
   * Update session peer device and state in Supabase Database
   */
  static async updateSessionPeer(sessionId, peerDeviceInfo, status = "connected") {
    const supabase = getSupabaseClient();
    if (!supabase) return;
    try {
      await supabase.from("quickdrop_sessions").update({
        peer_device: peerDeviceInfo,
        status,
        updated_at: (/* @__PURE__ */ new Date()).toISOString()
      }).eq("session_id", sessionId);
    } catch (err) {
      console.debug("[Supabase DB] Session peer update skipped:", err);
    }
  }
  /**
   * Record transfer in Supabase Database
   */
  static async recordTransfer(item, sessionId, method = "webrtc_p2p", storagePath) {
    const supabase = getSupabaseClient();
    if (!supabase) return;
    try {
      await supabase.from("quickdrop_transfers").upsert(
        {
          id: item.id,
          session_id: sessionId,
          name: item.name,
          size: item.size,
          type: item.type,
          status: item.state,
          transfer_method: method,
          storage_path: storagePath || null,
          sha256: item.sha256 || null,
          completed_at: item.state === "completed" ? (/* @__PURE__ */ new Date()).toISOString() : null
        },
        { onConflict: "id" }
      );
    } catch (err) {
      console.debug("[Supabase DB] Transfer record skipped:", err);
    }
  }
  /**
   * Upload file to Supabase Storage as a cloud fallback when P2P is blocked
   */
  static async uploadToStorageFallback(file, sessionId, onProgress) {
    const supabase = getSupabaseClient();
    if (!supabase) {
      return { success: false, error: "\u0633\u062D\u0627\u0628\u0629 Supabase \u063A\u064A\u0631 \u0645\u0631\u0628\u0648\u0637\u0629. \u064A\u0631\u062C\u0649 \u0631\u0628\u0637 \u0645\u0634\u0631\u0648\u0639 Supabase \u0644\u062A\u0641\u0639\u064A\u0644 \u0627\u0644\u0631\u0641\u0639 \u0627\u0644\u0633\u062D\u0627\u0628\u064A \u0627\u0644\u0627\u062D\u062A\u064A\u0627\u0637\u064A." };
    }
    try {
      const bucket = "quickdrop-transfers";
      const cleanName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
      const filePath = `${sessionId}/${Date.now()}_${cleanName}`;
      onProgress?.(25);
      const { data, error } = await supabase.storage.from(bucket).upload(filePath, file, {
        cacheControl: "3600",
        upsert: true
      });
      if (error) {
        if (error.message.includes("not found") || error.message.includes("bucket")) {
          try {
            await supabase.storage.createBucket(bucket, { public: true });
            const retry = await supabase.storage.from(bucket).upload(filePath, file, { upsert: true });
            if (retry.error) return { success: false, error: retry.error.message };
          } catch {
            return { success: false, error: error.message };
          }
        } else {
          return { success: false, error: error.message };
        }
      }
      onProgress?.(80);
      const { data: pubData } = supabase.storage.from(bucket).getPublicUrl(filePath);
      const publicUrl = pubData?.publicUrl || "";
      onProgress?.(100);
      return {
        success: true,
        url: publicUrl,
        path: filePath
      };
    } catch (err) {
      return {
        success: false,
        error: err.message || "\u0641\u0634\u0644 \u0627\u0644\u0631\u0641\u0639 \u0625\u0644\u0649 Supabase Storage"
      };
    }
  }
};

// src/lib/signaling.ts
var CUSTOM_SIGNALING_URL = typeof import.meta !== "undefined" && import.meta.env && import.meta.env.VITE_SIGNALING_SERVER_URL || "";
var SignalingClient = class {
  constructor(callbacks) {
    this.ws = null;
    this.callbacks = {};
    this.pingInterval = null;
    this.retryInterval = null;
    this.isExplicitlyClosed = false;
    this.role = "host";
    this.sessionId = "";
    this.safeTopic = "";
    this.isConnected = false;
    this.seenMessages = /* @__PURE__ */ new Set();
    this.callbacks = callbacks;
  }
  /**
   * Connect to signaling relay for a given session ID
   * Uses Supabase Realtime Channels as high-priority low-latency transport,
   * with fallback to WebSocket / ntfy relay for resilience.
   */
  async connect(sessionId, role) {
    this.isExplicitlyClosed = false;
    this.role = role;
    this.sessionId = sessionId;
    this.safeTopic = "quickdrop-" + sessionId.toLowerCase().replace(/[^a-z0-9]/g, "");
    SupabaseService.subscribeToSignalingChannel(this.safeTopic, (payload) => {
      this.handleRelayMessage(payload);
    });
    return new Promise((resolve) => {
      try {
        const wsUrl = CUSTOM_SIGNALING_URL ? CUSTOM_SIGNALING_URL.replace(/^http/i, "ws").replace(/\/+$/, "") + "/" + this.safeTopic + "/ws" : `wss://ntfy.sh/${this.safeTopic}/ws`;
        const ws = new WebSocket(wsUrl);
        const timeout = window.setTimeout(() => {
          this.isConnected = true;
          this.callbacks.onConnectionChange?.(true);
          resolve();
        }, 3500);
        ws.onopen = () => {
          clearTimeout(timeout);
          this.ws = ws;
          this.isConnected = true;
          this.callbacks.onConnectionChange?.(true);
          this.startHeartbeat();
          resolve();
        };
        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            if (data.event === "message" && typeof data.message === "string") {
              try {
                const payload = JSON.parse(data.message);
                this.handleRelayMessage(payload);
              } catch {
              }
            }
          } catch (err) {
            console.error("Error parsing signaling message:", err);
          }
        };
        ws.onerror = () => {
          clearTimeout(timeout);
          this.isConnected = true;
          resolve();
        };
        ws.onclose = () => {
          this.stopHeartbeat();
          this.callbacks.onConnectionChange?.(false);
          if (!this.isExplicitlyClosed && this.safeTopic) {
            setTimeout(() => {
              if (!this.isExplicitlyClosed) {
                this.connect(this.sessionId, this.role).catch(() => {
                });
              }
            }, 2e3);
          }
        };
      } catch {
        this.isConnected = true;
        resolve();
      }
    });
  }
  handleRelayMessage(msg) {
    if (!msg || typeof msg !== "object") return;
    if (msg.sender === this.role) return;
    const msgKey = `${msg.type}_${msg.sender}_${msg.timestamp || ""}_${JSON.stringify(msg.sdp || msg.candidate || msg.sessionId || msg.offer?.id || "")}`;
    if (this.seenMessages.has(msgKey)) return;
    this.seenMessages.add(msgKey);
    if (this.seenMessages.size > 200) {
      const first = this.seenMessages.values().next().value;
      if (first) this.seenMessages.delete(first);
    }
    switch (msg.type) {
      case "join_session":
        if (this.role === "host") {
          this.send({
            type: "host_ack",
            sessionId: this.sessionId,
            deviceInfo: this.localDeviceInfo
          });
          this.callbacks.onPeerJoined?.(msg.deviceInfo);
        }
        break;
      case "host_ack":
        if (this.role === "joiner") {
          this.stopRetry();
          this.callbacks.onJoined?.(this.sessionId, msg.deviceInfo);
        }
        break;
      case "signal_offer":
        if (this.role === "joiner") {
          this.stopRetry();
          this.callbacks.onOffer?.(msg.sdp);
        }
        break;
      case "signal_answer":
        if (this.role === "host") {
          this.callbacks.onAnswer?.(msg.sdp);
        }
        break;
      case "ice_candidate":
        if (msg.candidate) {
          this.callbacks.onIceCandidate?.(msg.candidate);
        }
        break;
      case "cloud_transfer_offer":
        if (msg.offer) {
          this.callbacks.onCloudTransferOffer?.(msg.offer);
        }
        break;
      case "peer_left":
      case "leave_session":
        this.callbacks.onPeerLeft?.();
        break;
      case "session_expired":
        this.callbacks.onSessionExpired?.(msg.reason);
        break;
      default:
        break;
    }
  }
  registerHost(sessionId, _token, deviceInfo) {
    this.role = "host";
    this.sessionId = sessionId;
    this.localDeviceInfo = deviceInfo;
    this.safeTopic = "quickdrop-" + sessionId.toLowerCase().replace(/[^a-z0-9]/g, "");
    this.callbacks.onRegistered?.(sessionId, Date.now() + 15 * 60 * 1e3);
    this.send({
      type: "host_ready",
      sessionId,
      deviceInfo
    });
  }
  joinSession(sessionId, _token, deviceInfo) {
    this.role = "joiner";
    this.sessionId = sessionId;
    this.localDeviceInfo = deviceInfo;
    this.safeTopic = "quickdrop-" + sessionId.toLowerCase().replace(/[^a-z0-9]/g, "");
    const sendJoin = () => {
      this.send({
        type: "join_session",
        sessionId,
        deviceInfo
      });
    };
    sendJoin();
    let retries = 0;
    this.stopRetry();
    this.retryInterval = window.setInterval(() => {
      retries++;
      if (retries > 8) {
        this.stopRetry();
        return;
      }
      sendJoin();
    }, 1500);
  }
  stopRetry() {
    if (this.retryInterval) {
      clearInterval(this.retryInterval);
      this.retryInterval = null;
    }
  }
  sendOffer(sdp) {
    this.send({
      type: "signal_offer",
      sdp
    });
  }
  sendAnswer(sdp) {
    this.send({
      type: "signal_answer",
      sdp
    });
  }
  sendIceCandidate(candidate) {
    this.send({
      type: "ice_candidate",
      candidate
    });
  }
  sendCloudTransferOffer(offer) {
    this.send({
      type: "cloud_transfer_offer",
      offer
    });
  }
  leave() {
    this.send({ type: "peer_left" });
    this.close();
  }
  async send(payload) {
    if (!this.safeTopic) return;
    const msg = {
      ...payload,
      sender: this.role,
      timestamp: Date.now()
    };
    SupabaseService.broadcastSignal(this.safeTopic, msg).catch(() => {
    });
    try {
      const body = JSON.stringify(msg);
      const endpoint = CUSTOM_SIGNALING_URL ? CUSTOM_SIGNALING_URL.replace(/^ws/i, "http").replace(/\/+$/, "") + "/" + this.safeTopic : `https://ntfy.sh/${this.safeTopic}`;
      await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body
      });
    } catch (err) {
      console.warn("Signaling send error:", err);
    }
  }
  startHeartbeat() {
    this.stopHeartbeat();
    this.pingInterval = window.setInterval(() => {
    }, 25e3);
  }
  stopHeartbeat() {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
  }
  close() {
    this.isExplicitlyClosed = true;
    this.stopHeartbeat();
    this.stopRetry();
    SupabaseService.unsubscribeSignalingChannel(this.safeTopic);
    if (this.ws) {
      try {
        this.ws.close();
      } catch {
      }
      this.ws = null;
    }
  }
};

// src/lib/webrtc.ts
var CHUNK_SIZE = 64 * 1024;
var BUFFERED_AMOUNT_LOW_THRESHOLD = 256 * 1024;
var MAX_BUFFERED_AMOUNT = 1024 * 1024;
var WebRTCManager = class {
  constructor(localDeviceInfo, iceServers, callbacks) {
    this.pc = null;
    this.dataChannel = null;
    // Ongoing transfers
    this.activeOutgoingTransfer = null;
    this.activeIncomingTransfers = /* @__PURE__ */ new Map();
    this.localDeviceInfo = localDeviceInfo;
    this.iceServers = iceServers;
    this.callbacks = callbacks;
  }
  async initializePeerConnection(isInitiator) {
    this.close();
    const config = {
      iceServers: this.iceServers.length > 0 ? this.iceServers : [
        { urls: "stun:stun.l.google.com:19302" },
        { urls: "stun:stun1.l.google.com:19302" },
        { urls: "stun:stun2.l.google.com:19302" },
        { urls: "stun:stun.cloudflare.com:3478" },
        { urls: "stun:stun.services.mozilla.com" }
      ],
      iceCandidatePoolSize: 4
    };
    this.pc = new RTCPeerConnection(config);
    this.pc.onicecandidate = (event) => {
      if (event.candidate) {
        this.callbacks.onIceCandidate(event.candidate.toJSON());
      }
    };
    this.pc.onconnectionstatechange = () => {
      if (this.pc) {
        this.callbacks.onConnectionStateChange(this.pc.connectionState);
      }
    };
    if (isInitiator) {
      const dc = this.pc.createDataChannel("quickdrop-transfer", {
        ordered: true
      });
      this.setupDataChannel(dc);
      const offer = await this.pc.createOffer();
      await this.pc.setLocalDescription(offer);
      this.callbacks.onOfferCreated(offer);
    } else {
      this.pc.ondatachannel = (event) => {
        this.setupDataChannel(event.channel);
      };
    }
  }
  async handleReceivedOffer(sdp) {
    if (!this.pc) return;
    await this.pc.setRemoteDescription(new RTCSessionDescription(sdp));
    const answer = await this.pc.createAnswer();
    await this.pc.setLocalDescription(answer);
    this.callbacks.onAnswerCreated(answer);
  }
  async handleReceivedAnswer(sdp) {
    if (!this.pc) return;
    await this.pc.setRemoteDescription(new RTCSessionDescription(sdp));
  }
  async handleReceivedIceCandidate(candidate) {
    if (!this.pc) return;
    try {
      await this.pc.addIceCandidate(new RTCIceCandidate(candidate));
    } catch (err) {
      console.warn("Error adding ICE candidate:", err);
    }
  }
  setupDataChannel(channel) {
    this.dataChannel = channel;
    this.dataChannel.binaryType = "arraybuffer";
    this.dataChannel.bufferedAmountLowThreshold = BUFFERED_AMOUNT_LOW_THRESHOLD;
    this.dataChannel.onopen = () => {
      this.callbacks.onDataChannelStateChange(true);
      this.sendControlMessage({
        type: "DEVICE_INFO",
        deviceInfo: this.localDeviceInfo
      });
    };
    this.dataChannel.onclose = () => {
      this.callbacks.onDataChannelStateChange(false);
    };
    this.dataChannel.onerror = (err) => {
      console.error("DataChannel error:", err);
    };
    this.dataChannel.onmessage = (event) => {
      this.handleIncomingData(event.data);
    };
  }
  handleIncomingData(data) {
    if (typeof data === "string") {
      try {
        const msg = JSON.parse(data);
        this.handleControlMessage(msg);
      } catch (err) {
        console.error("Failed to parse control message:", err);
      }
    } else if (data instanceof ArrayBuffer) {
      this.handleIncomingBinaryChunk(data);
    }
  }
  handleControlMessage(msg) {
    switch (msg.type) {
      case "DEVICE_INFO":
        this.callbacks.onPeerDeviceInfo(msg.deviceInfo);
        break;
      case "FILE_OFFER": {
        const safeName = sanitizeFilename(msg.name);
        const item = {
          id: msg.id,
          name: safeName,
          size: msg.size,
          type: msg.fileType || "application/octet-stream",
          lastModified: msg.lastModified,
          progress: 0,
          transferredBytes: 0,
          speed: 0,
          eta: 0,
          state: "offered",
          isIncoming: true,
          totalChunks: msg.totalChunks,
          chunksReceived: 0
        };
        this.callbacks.onIncomingFileOffer(item);
        break;
      }
      case "FILE_ACCEPT": {
        if (this.activeOutgoingTransfer && this.activeOutgoingTransfer.item.id === msg.id) {
          this.executeFileTransfer();
        }
        break;
      }
      case "FILE_REJECT": {
        if (this.activeOutgoingTransfer && this.activeOutgoingTransfer.item.id === msg.id) {
          this.activeOutgoingTransfer.item.state = "cancelled";
          this.activeOutgoingTransfer.item.error = msg.reason || "Rejected by peer";
          this.callbacks.onFileFailed(msg.id, "Transfer was declined by the receiver");
          this.activeOutgoingTransfer = null;
        }
        break;
      }
      case "FILE_CANCEL": {
        const incoming = this.activeIncomingTransfers.get(msg.id);
        if (incoming) {
          incoming.item.state = "cancelled";
          this.callbacks.onFileFailed(msg.id, "Sender cancelled the transfer");
          this.activeIncomingTransfers.delete(msg.id);
        }
        break;
      }
      case "FILE_COMPLETE": {
        break;
      }
      case "TEXT_MESSAGE": {
        const item = {
          id: msg.id,
          text: msg.text,
          isUrl: !!msg.isUrl,
          timestamp: msg.timestamp || Date.now(),
          isIncoming: true
        };
        this.callbacks.onIncomingText(item);
        break;
      }
      default:
        break;
    }
  }
  async handleIncomingBinaryChunk(buffer) {
    const view = new DataView(buffer);
    if (view.byteLength < 4) return;
    const magic0 = view.getUint8(0);
    const magic1 = view.getUint8(1);
    if (magic0 !== 81 || magic1 !== 68) {
      return;
    }
    const headerLength = view.getUint16(2);
    if (view.byteLength < 4 + headerLength) return;
    const headerBytes = new Uint8Array(buffer, 4, headerLength);
    const headerStr = new TextDecoder().decode(headerBytes);
    const header = JSON.parse(headerStr);
    const chunkData = new Uint8Array(buffer, 4 + headerLength);
    const transfer = this.activeIncomingTransfers.get(header.id);
    if (!transfer) return;
    transfer.chunks[header.chunkIndex] = chunkData;
    transfer.receivedBytes += chunkData.byteLength;
    transfer.item.transferredBytes = transfer.receivedBytes;
    transfer.item.chunksReceived = (transfer.item.chunksReceived || 0) + 1;
    transfer.item.progress = Math.min(100, Math.round(transfer.receivedBytes / transfer.totalBytes * 100));
    const now = performance.now();
    const elapsedSinceLast = (now - transfer.lastReportedTime) / 1e3;
    if (elapsedSinceLast >= 0.2 || transfer.receivedBytes === transfer.totalBytes) {
      const bytesInWindow = transfer.receivedBytes - transfer.lastReportedBytes;
      const instantSpeed = elapsedSinceLast > 0 ? bytesInWindow / elapsedSinceLast : 0;
      transfer.smoothedSpeed = transfer.smoothedSpeed === 0 ? instantSpeed : 0.7 * instantSpeed + 0.3 * transfer.smoothedSpeed;
      transfer.item.speed = transfer.smoothedSpeed;
      const remainingBytes = transfer.totalBytes - transfer.receivedBytes;
      transfer.item.eta = transfer.smoothedSpeed > 0 ? remainingBytes / transfer.smoothedSpeed : 0;
      transfer.lastReportedTime = now;
      transfer.lastReportedBytes = transfer.receivedBytes;
      transfer.item.state = "transferring";
      this.callbacks.onFileProgress({ ...transfer.item });
    }
    if (transfer.receivedBytes >= transfer.totalBytes) {
      transfer.item.state = "verifying";
      this.callbacks.onFileProgress({ ...transfer.item });
      const fileBlob = new Blob(transfer.chunks, { type: transfer.item.type });
      const arrayBuf = await fileBlob.arrayBuffer();
      const calculatedHash = await calculateSha256(arrayBuf);
      transfer.item.sha256 = calculatedHash;
      transfer.item.state = "completed";
      transfer.item.progress = 100;
      transfer.item.speed = 0;
      transfer.item.eta = 0;
      transfer.item.blobUrl = URL.createObjectURL(fileBlob);
      transfer.item.endTime = Date.now();
      this.callbacks.onFileCompleted({ ...transfer.item });
      this.activeIncomingTransfers.delete(header.id);
    }
  }
  acceptIncomingFile(item) {
    const totalChunks = Math.ceil(item.size / CHUNK_SIZE);
    this.activeIncomingTransfers.set(item.id, {
      item,
      chunks: new Array(totalChunks),
      receivedBytes: 0,
      totalBytes: item.size,
      startTime: performance.now(),
      lastReportedTime: performance.now(),
      lastReportedBytes: 0,
      smoothedSpeed: 0
    });
    item.state = "preparing";
    this.callbacks.onFileProgress({ ...item });
    this.sendControlMessage({
      type: "FILE_ACCEPT",
      id: item.id
    });
  }
  rejectIncomingFile(itemId, reason = "User declined") {
    this.activeIncomingTransfers.delete(itemId);
    this.sendControlMessage({
      type: "FILE_REJECT",
      id: itemId,
      reason
    });
  }
  offerFileToSend(file) {
    const safeName = sanitizeFilename(file.name);
    const transferId = `transfer-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
    const item = {
      id: transferId,
      name: safeName,
      size: file.size,
      type: file.type || "application/octet-stream",
      lastModified: file.lastModified,
      progress: 0,
      transferredBytes: 0,
      speed: 0,
      eta: 0,
      state: "pending",
      isIncoming: false,
      totalChunks,
      chunksReceived: 0
    };
    this.activeOutgoingTransfer = {
      item,
      file,
      cancelled: false,
      lastReportedTime: performance.now(),
      lastReportedBytes: 0,
      smoothedSpeed: 0
    };
    this.sendControlMessage({
      type: "FILE_OFFER",
      id: item.id,
      name: safeName,
      size: file.size,
      fileType: file.type,
      totalChunks,
      chunkSize: CHUNK_SIZE,
      lastModified: file.lastModified
    });
    return item;
  }
  async executeFileTransfer() {
    if (!this.activeOutgoingTransfer || !this.dataChannel || this.dataChannel.readyState !== "open") {
      return;
    }
    const { item, file } = this.activeOutgoingTransfer;
    item.state = "transferring";
    item.startTime = Date.now();
    this.callbacks.onFileProgress({ ...item });
    const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
    let offset = 0;
    let chunkIndex = 0;
    const fileReader = new FileReader();
    const readSlice = (start, end) => {
      return new Promise((resolve, reject) => {
        const slice = file.slice(start, end);
        fileReader.onload = () => resolve(fileReader.result);
        fileReader.onerror = () => reject(fileReader.error);
        fileReader.readAsArrayBuffer(slice);
      });
    };
    while (chunkIndex < totalChunks) {
      if (this.activeOutgoingTransfer?.cancelled) {
        this.sendControlMessage({ type: "FILE_CANCEL", id: item.id });
        item.state = "cancelled";
        this.callbacks.onFileFailed(item.id, "Transfer cancelled");
        this.activeOutgoingTransfer = null;
        return;
      }
      if (this.dataChannel.bufferedAmount > MAX_BUFFERED_AMOUNT) {
        await new Promise((resolve) => {
          const handler = () => {
            if (this.dataChannel) {
              this.dataChannel.removeEventListener("bufferedamountlow", handler);
            }
            resolve();
          };
          this.dataChannel?.addEventListener("bufferedamountlow", handler);
        });
      }
      const nextOffset = Math.min(offset + CHUNK_SIZE, file.size);
      let rawChunk;
      try {
        rawChunk = await readSlice(offset, nextOffset);
      } catch (err) {
        item.state = "failed";
        item.error = "Failed to read file from disk";
        this.callbacks.onFileFailed(item.id, item.error);
        this.activeOutgoingTransfer = null;
        return;
      }
      const headerObj = { id: item.id, chunkIndex, totalChunks };
      const headerBytes = new TextEncoder().encode(JSON.stringify(headerObj));
      const headerLength = headerBytes.byteLength;
      const packetBuffer = new ArrayBuffer(4 + headerLength + rawChunk.byteLength);
      const view = new DataView(packetBuffer);
      view.setUint8(0, 81);
      view.setUint8(1, 68);
      view.setUint16(2, headerLength);
      const packetUint8 = new Uint8Array(packetBuffer);
      packetUint8.set(headerBytes, 4);
      packetUint8.set(new Uint8Array(rawChunk), 4 + headerLength);
      try {
        this.dataChannel.send(packetBuffer);
      } catch (err) {
        item.state = "failed";
        item.error = "DataChannel transmission failed";
        this.callbacks.onFileFailed(item.id, item.error);
        this.activeOutgoingTransfer = null;
        return;
      }
      offset = nextOffset;
      chunkIndex++;
      item.transferredBytes = offset;
      item.progress = Math.min(100, Math.round(offset / file.size * 100));
      const now = performance.now();
      const elapsedSinceLast = (now - this.activeOutgoingTransfer.lastReportedTime) / 1e3;
      if (elapsedSinceLast >= 0.2 || chunkIndex === totalChunks) {
        const bytesInWindow = offset - this.activeOutgoingTransfer.lastReportedBytes;
        const instantSpeed = elapsedSinceLast > 0 ? bytesInWindow / elapsedSinceLast : 0;
        this.activeOutgoingTransfer.smoothedSpeed = this.activeOutgoingTransfer.smoothedSpeed === 0 ? instantSpeed : 0.7 * instantSpeed + 0.3 * this.activeOutgoingTransfer.smoothedSpeed;
        item.speed = this.activeOutgoingTransfer.smoothedSpeed;
        const remainingBytes = file.size - offset;
        item.eta = this.activeOutgoingTransfer.smoothedSpeed > 0 ? remainingBytes / this.activeOutgoingTransfer.smoothedSpeed : 0;
        this.activeOutgoingTransfer.lastReportedTime = now;
        this.activeOutgoingTransfer.lastReportedBytes = offset;
        this.callbacks.onFileProgress({ ...item });
      }
    }
    item.state = "completed";
    item.progress = 100;
    item.speed = 0;
    item.eta = 0;
    item.endTime = Date.now();
    this.callbacks.onFileCompleted({ ...item });
    this.activeOutgoingTransfer = null;
  }
  cancelTransfer(itemId) {
    if (this.activeOutgoingTransfer && this.activeOutgoingTransfer.item.id === itemId) {
      this.activeOutgoingTransfer.cancelled = true;
    }
    const incoming = this.activeIncomingTransfers.get(itemId);
    if (incoming) {
      this.rejectIncomingFile(itemId, "Receiver cancelled");
    }
  }
  sendTextMessage(text) {
    const isUrl = /^https?:\/\/\S+$/i.test(text.trim());
    const item = {
      id: `text-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      text: text.trim(),
      isUrl,
      timestamp: Date.now(),
      isIncoming: false
    };
    this.sendControlMessage({
      type: "TEXT_MESSAGE",
      id: item.id,
      text: item.text,
      isUrl: item.isUrl,
      timestamp: item.timestamp
    });
    return item;
  }
  sendControlMessage(payload) {
    if (this.dataChannel && this.dataChannel.readyState === "open") {
      try {
        this.dataChannel.send(JSON.stringify(payload));
      } catch (err) {
        console.error("Failed to send control message:", err);
      }
    }
  }
  close() {
    if (this.dataChannel) {
      try {
        this.dataChannel.close();
      } catch {
      }
      this.dataChannel = null;
    }
    if (this.pc) {
      try {
        this.pc.close();
      } catch {
      }
      this.pc = null;
    }
    this.activeOutgoingTransfer = null;
    this.activeIncomingTransfers.clear();
  }
};

// src/App.tsx
import { jsx as jsx12, jsxs as jsxs12 } from "react/jsx-runtime";
function App() {
  const [currentTab, setCurrentTab] = useState7("transfer");
  const [theme, setTheme] = useState7("dark");
  const [currentUser, setCurrentUser] = useState7(null);
  const [isAuthLoading, setIsAuthLoading] = useState7(true);
  const [rawDeviceInfo] = useState7(getLocalDeviceInfo());
  const [peerDeviceInfo, setPeerDeviceInfo] = useState7(void 0);
  const localDeviceInfo = useMemo(() => {
    if (!currentUser) return rawDeviceInfo;
    return {
      ...rawDeviceInfo,
      name: currentUser.deviceName?.trim() || currentUser.name?.trim() || rawDeviceInfo.name
    };
  }, [rawDeviceInfo, currentUser]);
  const [session, setSession] = useState7(null);
  const [connectionState, setConnectionState] = useState7("idle");
  const [isCreatingSession, setIsCreatingSession] = useState7(false);
  const [isScannerOpen, setIsScannerOpen] = useState7(false);
  const [isManualJoinOpen, setIsManualJoinOpen] = useState7(false);
  const [files, setFiles] = useState7([]);
  const [texts, setTexts] = useState7([]);
  const [incomingOffer, setIncomingOffer] = useState7(null);
  const [autoAccept, setAutoAccept] = useState7(() => {
    const saved = localStorage.getItem("quickdrop_auto_accept");
    return saved !== null ? saved === "true" : true;
  });
  const signalingClientRef = useRef6(null);
  const webrtcManagerRef = useRef6(null);
  const iceServersRef = useRef6([]);
  const pendingCandidatesRef = useRef6([]);
  useEffect5(() => {
    const savedTheme = localStorage.getItem("quickdrop_theme");
    const initialTheme = savedTheme || "dark";
    setTheme(initialTheme);
    if (initialTheme === "dark") {
      document.documentElement.classList.add("dark");
      document.documentElement.setAttribute("data-theme", "dark");
      document.body.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.setAttribute("data-theme", "light");
      document.body.classList.remove("dark");
    }
  }, []);
  useEffect5(() => {
    let mounted = true;
    getActiveUser().then((user) => {
      if (mounted) {
        setCurrentUser(user);
        setIsAuthLoading(false);
      }
    }).catch((err) => {
      console.warn("Auth check error:", err);
      if (mounted) setIsAuthLoading(false);
    });
    return () => {
      mounted = false;
    };
  }, []);
  const handleLogout = async () => {
    await signOutUser();
    handleEndSession();
    setCurrentUser(null);
    setCurrentTab("transfer");
  };
  const toggleTheme = () => {
    setTheme((prevTheme) => {
      const nextTheme = prevTheme === "dark" ? "light" : "dark";
      localStorage.setItem("quickdrop_theme", nextTheme);
      if (nextTheme === "dark") {
        document.documentElement.classList.add("dark");
        document.documentElement.setAttribute("data-theme", "dark");
        document.body.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
        document.documentElement.setAttribute("data-theme", "light");
        document.body.classList.remove("dark");
      }
      return nextTheme;
    });
  };
  const handleToggleAutoAccept = (val) => {
    setAutoAccept(val);
    localStorage.setItem("quickdrop_auto_accept", String(val));
  };
  useEffect5(() => {
    fetch("/api/ice-servers").then((res) => res.json()).then((data) => {
      if (data.iceServers) {
        iceServersRef.current = data.iceServers;
      }
    }).catch((err) => console.warn("Failed to fetch ICE servers:", err));
  }, []);
  const autoSaveReceivedFile = useCallback(async (item) => {
    if (!item.blobUrl) return;
    if (typeof window !== "undefined" && "showSaveFilePicker" in window) {
      try {
        const ext = item.name.includes(".") ? "." + item.name.split(".").pop() : "";
        const handle = await window.showSaveFilePicker({
          suggestedName: item.name,
          types: [
            {
              description: "QuickDrop Received File",
              accept: {
                [item.type || "application/octet-stream"]: ext ? [ext] : []
              }
            }
          ]
        });
        const writable = await handle.createWritable();
        const resp = await fetch(item.blobUrl);
        const blob = await resp.blob();
        await writable.write(blob);
        await writable.close();
        return;
      } catch (err) {
        if (err.name === "AbortError") {
          return;
        }
        console.warn("showSaveFilePicker restricted without user gesture, falling back to direct download:", err);
      }
    }
    try {
      const a = document.createElement("a");
      a.href = item.blobUrl;
      a.download = item.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (err) {
      console.error("Anchor download error:", err);
    }
  }, []);
  const getOrCreateWebRTC = useCallback((isInitiator) => {
    if (webrtcManagerRef.current) {
      webrtcManagerRef.current.close();
    }
    const manager = new WebRTCManager(
      localDeviceInfo,
      iceServersRef.current,
      {
        onConnectionStateChange: (pcState) => {
          if (pcState === "connected") {
            setConnectionState("connected");
          } else if (pcState === "disconnected" || pcState === "failed") {
            setConnectionState("disconnected");
          }
        },
        onDataChannelStateChange: (isOpen) => {
          if (isOpen) {
            setConnectionState("connected");
          } else {
            if (connectionState === "connected") {
              setConnectionState("disconnected");
            }
          }
        },
        onIceCandidate: (candidate) => {
          signalingClientRef.current?.sendIceCandidate(candidate);
        },
        onOfferCreated: (sdp) => {
          signalingClientRef.current?.sendOffer(sdp);
        },
        onAnswerCreated: (sdp) => {
          signalingClientRef.current?.sendAnswer(sdp);
        },
        onPeerDeviceInfo: (info) => {
          setPeerDeviceInfo(info);
        },
        onIncomingFileOffer: (item) => {
          if (autoAccept) {
            manager.acceptIncomingFile(item);
          } else {
            setIncomingOffer(item);
          }
          setFiles((prev) => [item, ...prev.filter((f) => f.id !== item.id)]);
          if (session?.sessionId) {
            SupabaseService.recordTransfer(item, session.sessionId, "webrtc_p2p").catch(() => {
            });
          }
        },
        onFileProgress: (item) => {
          setFiles(
            (prev) => prev.map((f) => f.id === item.id ? { ...item } : f)
          );
        },
        onFileCompleted: async (item) => {
          setIncomingOffer((current) => current?.id === item.id ? null : current);
          setFiles(
            (prev) => prev.map((f) => f.id === item.id ? { ...item } : f)
          );
          if (session?.sessionId) {
            SupabaseService.recordTransfer(item, session.sessionId, "webrtc_p2p").catch(() => {
            });
          }
          if (item.isIncoming && item.blobUrl) {
            await autoSaveReceivedFile(item);
          }
        },
        onFileFailed: (itemId, error) => {
          setIncomingOffer((current) => current?.id === itemId ? null : current);
          setFiles(
            (prev) => prev.map((f) => f.id === itemId ? { ...f, state: "failed", error } : f)
          );
        },
        onIncomingText: (item) => {
          setTexts((prev) => [item, ...prev]);
        }
      }
    );
    webrtcManagerRef.current = manager;
    return manager;
  }, [localDeviceInfo, autoAccept, connectionState, session, autoSaveReceivedFile]);
  const handleStartSession = async () => {
    setIsCreatingSession(true);
    setConnectionState("creating");
    try {
      let data = null;
      try {
        const res = await fetch("/api/sessions/create", { method: "POST" });
        if (res.ok) {
          data = await res.json();
        }
      } catch {
      }
      if (!data || !data.sessionId) {
        const chars = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";
        const randChar = () => chars[Math.floor(Math.random() * chars.length)];
        const code1 = Array.from({ length: 4 }, randChar).join("");
        const code2 = Array.from({ length: 4 }, randChar).join("");
        const sid = `QK-${code1}-${code2}`;
        const tok = Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2);
        data = {
          sessionId: sid,
          token: tok,
          expiresAt: Date.now() + 15 * 60 * 1e3,
          iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
        };
      }
      if (data.iceServers) {
        iceServersRef.current = data.iceServers;
      }
      const newSession = {
        sessionId: data.sessionId,
        token: data.token,
        expiresAt: data.expiresAt,
        role: "host"
      };
      setSession(newSession);
      try {
        sessionStorage.setItem("quickdrop_active_host_session", JSON.stringify(newSession));
      } catch {
      }
      SupabaseService.recordSession(newSession, localDeviceInfo);
      const signaling = new SignalingClient({
        onRegistered: () => {
          setConnectionState("waiting");
        },
        onPeerJoined: async (peerInfo) => {
          if (peerInfo) {
            setPeerDeviceInfo(peerInfo);
            SupabaseService.updateSessionPeer(newSession.sessionId, peerInfo, "connected");
          }
          setConnectionState("connecting");
          const rtc = getOrCreateWebRTC(true);
          await rtc.initializePeerConnection(true);
          for (const cand of pendingCandidatesRef.current) {
            await rtc.handleReceivedIceCandidate(cand);
          }
          pendingCandidatesRef.current = [];
        },
        onAnswer: async (sdp) => {
          await webrtcManagerRef.current?.handleReceivedAnswer(sdp);
        },
        onIceCandidate: async (candidate) => {
          if (webrtcManagerRef.current) {
            await webrtcManagerRef.current.handleReceivedIceCandidate(candidate);
          } else {
            pendingCandidatesRef.current.push(candidate);
          }
        },
        onCloudTransferOffer: async (offer) => {
          const item = {
            id: offer.id,
            name: offer.name,
            size: offer.size,
            type: offer.type,
            lastModified: Date.now(),
            progress: 30,
            transferredBytes: Math.round(offer.size * 0.3),
            speed: 0,
            eta: 0,
            state: "transferring",
            isIncoming: true
          };
          setFiles((prev) => [item, ...prev.filter((f) => f.id !== item.id)]);
          try {
            const res = await fetch(offer.url);
            const blob = await res.blob();
            const blobUrl = URL.createObjectURL(blob);
            const completedItem = {
              ...item,
              progress: 100,
              transferredBytes: offer.size,
              state: "completed",
              blobUrl,
              endTime: Date.now()
            };
            setFiles((prev) => prev.map((f) => f.id === offer.id ? completedItem : f));
            SupabaseService.recordTransfer(completedItem, newSession.sessionId, "supabase_storage").catch(() => {
            });
            await autoSaveReceivedFile(completedItem);
          } catch (err) {
            setFiles(
              (prev) => prev.map((f) => f.id === offer.id ? { ...f, state: "failed", error: err.message } : f)
            );
          }
        },
        onPeerDisconnected: () => {
          setConnectionState("disconnected");
        },
        onPeerLeft: () => {
          setConnectionState("disconnected");
        },
        onSessionExpired: () => {
          handleEndSession();
        },
        onError: (err) => {
          console.warn("Signaling message:", err);
        }
      });
      signalingClientRef.current = signaling;
      try {
        await signaling.connect(newSession.sessionId, "host");
        signaling.registerHost(newSession.sessionId, newSession.token, localDeviceInfo);
      } catch {
        setConnectionState("waiting");
      }
    } catch (err) {
      console.error(err);
      setConnectionState("error");
    } finally {
      setIsCreatingSession(false);
    }
  };
  const handleJoinSession = async (tokenOrCode, optionalToken) => {
    setConnectionState("connecting");
    try {
      let targetSessionId = "";
      const targetToken = optionalToken || tokenOrCode;
      const targetExpires = Date.now() + 15 * 60 * 1e3;
      const qkMatch = tokenOrCode.match(/QK-[A-Z0-9]{4}-[A-Z0-9]{4}/i);
      if (qkMatch) {
        targetSessionId = qkMatch[0].toUpperCase();
      } else if (/^[A-Z0-9]{8}$/i.test(tokenOrCode)) {
        targetSessionId = `QK-${tokenOrCode.slice(0, 4).toUpperCase()}-${tokenOrCode.slice(4, 8).toUpperCase()}`;
      } else {
        targetSessionId = tokenOrCode.toUpperCase();
      }
      const joinSessionData = {
        sessionId: targetSessionId,
        token: targetToken,
        expiresAt: targetExpires,
        role: "joiner"
      };
      setSession(joinSessionData);
      setIsScannerOpen(false);
      setIsManualJoinOpen(false);
      SupabaseService.updateSessionPeer(targetSessionId, localDeviceInfo, "connected");
      const signaling = new SignalingClient({
        onJoined: (_sid, hostInfo) => {
          if (hostInfo) setPeerDeviceInfo(hostInfo);
          setConnectionState("connecting");
        },
        onOffer: async (sdp) => {
          const rtc = getOrCreateWebRTC(false);
          await rtc.initializePeerConnection(false);
          await rtc.handleReceivedOffer(sdp);
          for (const cand of pendingCandidatesRef.current) {
            await rtc.handleReceivedIceCandidate(cand);
          }
          pendingCandidatesRef.current = [];
        },
        onIceCandidate: async (candidate) => {
          if (webrtcManagerRef.current) {
            await webrtcManagerRef.current.handleReceivedIceCandidate(candidate);
          } else {
            pendingCandidatesRef.current.push(candidate);
          }
        },
        onCloudTransferOffer: async (offer) => {
          const item = {
            id: offer.id,
            name: offer.name,
            size: offer.size,
            type: offer.type,
            lastModified: Date.now(),
            progress: 30,
            transferredBytes: Math.round(offer.size * 0.3),
            speed: 0,
            eta: 0,
            state: "transferring",
            isIncoming: true
          };
          setFiles((prev) => [item, ...prev.filter((f) => f.id !== item.id)]);
          try {
            const res = await fetch(offer.url);
            const blob = await res.blob();
            const blobUrl = URL.createObjectURL(blob);
            const completedItem = {
              ...item,
              progress: 100,
              transferredBytes: offer.size,
              state: "completed",
              blobUrl,
              endTime: Date.now()
            };
            setFiles((prev) => prev.map((f) => f.id === offer.id ? completedItem : f));
            SupabaseService.recordTransfer(completedItem, targetSessionId, "supabase_storage").catch(() => {
            });
            await autoSaveReceivedFile(completedItem);
          } catch (err) {
            setFiles(
              (prev) => prev.map((f) => f.id === offer.id ? { ...f, state: "failed", error: err.message } : f)
            );
          }
        },
        onPeerDisconnected: () => {
          setConnectionState("disconnected");
        },
        onPeerLeft: () => {
          setConnectionState("disconnected");
        },
        onSessionExpired: () => {
          handleEndSession();
        },
        onError: (err) => {
          console.warn("Signaling message:", err);
        }
      });
      signalingClientRef.current = signaling;
      try {
        await signaling.connect(targetSessionId, "joiner");
        signaling.joinSession(targetSessionId, targetToken, localDeviceInfo);
      } catch {
        setConnectionState("connecting");
      }
    } catch (err) {
      console.warn(err);
      setConnectionState("idle");
    }
  };
  useEffect5(() => {
    if (!currentUser) return;
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    const joinToken = params.get("join");
    if (code) {
      handleJoinSession(code, joinToken || void 0).catch(() => {
      });
    } else if (joinToken) {
      handleJoinSession(joinToken).catch(() => {
      });
    } else {
      try {
        const saved = sessionStorage.getItem("quickdrop_active_host_session");
        if (saved) {
          const sessionObj = JSON.parse(saved);
          if (sessionObj && sessionObj.sessionId && sessionObj.expiresAt > Date.now() + 15e3) {
            setSession(sessionObj);
            const signaling = new SignalingClient({
              onRegistered: () => setConnectionState("waiting"),
              onPeerJoined: async (peerInfo) => {
                if (peerInfo) {
                  setPeerDeviceInfo(peerInfo);
                  SupabaseService.updateSessionPeer(sessionObj.sessionId, peerInfo, "connected");
                }
                setConnectionState("connecting");
                const rtc = getOrCreateWebRTC(true);
                await rtc.initializePeerConnection(true);
                for (const cand of pendingCandidatesRef.current) {
                  await rtc.handleReceivedIceCandidate(cand);
                }
                pendingCandidatesRef.current = [];
              },
              onAnswer: async (sdp) => {
                await webrtcManagerRef.current?.handleReceivedAnswer(sdp);
              },
              onIceCandidate: async (candidate) => {
                if (webrtcManagerRef.current) {
                  await webrtcManagerRef.current.handleReceivedIceCandidate(candidate);
                } else {
                  pendingCandidatesRef.current.push(candidate);
                }
              },
              onCloudTransferOffer: async (offer) => {
                const item = {
                  id: offer.id,
                  name: offer.name,
                  size: offer.size,
                  type: offer.type,
                  lastModified: Date.now(),
                  progress: 30,
                  transferredBytes: Math.round(offer.size * 0.3),
                  speed: 0,
                  eta: 0,
                  state: "transferring",
                  isIncoming: true
                };
                setFiles((prev) => [item, ...prev.filter((f) => f.id !== item.id)]);
                try {
                  const res = await fetch(offer.url);
                  const blob = await res.blob();
                  const blobUrl = URL.createObjectURL(blob);
                  const completedItem = {
                    ...item,
                    progress: 100,
                    transferredBytes: offer.size,
                    state: "completed",
                    blobUrl,
                    endTime: Date.now()
                  };
                  setFiles((prev) => prev.map((f) => f.id === offer.id ? completedItem : f));
                  await autoSaveReceivedFile(completedItem);
                } catch (err) {
                  setFiles(
                    (prev) => prev.map((f) => f.id === offer.id ? { ...f, state: "failed", error: err.message } : f)
                  );
                }
              },
              onPeerDisconnected: () => setConnectionState("disconnected"),
              onPeerLeft: () => setConnectionState("disconnected"),
              onSessionExpired: () => handleEndSession(),
              onError: (err) => console.warn("Signaling message:", err)
            });
            signalingClientRef.current = signaling;
            signaling.connect(sessionObj.sessionId, "host").then(() => {
              signaling.registerHost(sessionObj.sessionId, sessionObj.token, localDeviceInfo);
            });
            return;
          } else {
            sessionStorage.removeItem("quickdrop_active_host_session");
          }
        }
      } catch {
      }
    }
  }, [currentUser]);
  const handleEndSession = () => {
    if (session?.sessionId) {
      SupabaseService.updateSessionPeer(session.sessionId, localDeviceInfo, "expired");
    }
    try {
      sessionStorage.removeItem("quickdrop_active_host_session");
    } catch {
    }
    signalingClientRef.current?.leave();
    signalingClientRef.current = null;
    webrtcManagerRef.current?.close();
    webrtcManagerRef.current = null;
    setSession(null);
    setPeerDeviceInfo(void 0);
    setConnectionState("idle");
    setIncomingOffer(null);
    if (window.location.search) {
      window.history.replaceState({}, "", window.location.pathname);
    }
  };
  const handleSendFiles = (fileList) => {
    if (!webrtcManagerRef.current) return;
    const filesArray = Array.from(fileList);
    for (const file of filesArray) {
      const item = webrtcManagerRef.current.offerFileToSend(file);
      setFiles((prev) => [item, ...prev]);
      if (session?.sessionId) {
        SupabaseService.recordTransfer(item, session.sessionId, "webrtc_p2p").catch(() => {
        });
      }
    }
  };
  const handleCloudUploadFallback = async (file) => {
    if (!session?.sessionId) return;
    const tempId = `cloud-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const cloudItem = {
      id: tempId,
      name: file.name,
      size: file.size,
      type: file.type || "application/octet-stream",
      lastModified: file.lastModified,
      progress: 15,
      transferredBytes: Math.round(file.size * 0.15),
      speed: 0,
      eta: 0,
      state: "transferring",
      isIncoming: false
    };
    setFiles((prev) => [cloudItem, ...prev]);
    const res = await SupabaseService.uploadToStorageFallback(file, session.sessionId, (pct) => {
      setFiles(
        (prev) => prev.map(
          (f) => f.id === tempId ? {
            ...f,
            progress: pct,
            transferredBytes: Math.round(pct / 100 * file.size)
          } : f
        )
      );
    });
    if (res.success && res.url) {
      const completedItem = {
        ...cloudItem,
        progress: 100,
        transferredBytes: file.size,
        state: "completed",
        blobUrl: res.url,
        endTime: Date.now()
      };
      setFiles((prev) => prev.map((f) => f.id === tempId ? completedItem : f));
      signalingClientRef.current?.sendCloudTransferOffer({
        id: tempId,
        name: file.name,
        size: file.size,
        type: file.type,
        url: res.url
      });
      SupabaseService.recordTransfer(completedItem, session.sessionId, "supabase_storage", res.path).catch(() => {
      });
    } else {
      setFiles(
        (prev) => prev.map(
          (f) => f.id === tempId ? {
            ...f,
            state: "failed",
            error: res.error || "\u0641\u0634\u0644 \u0627\u0644\u0631\u0641\u0639 \u0625\u0644\u0649 Supabase Storage"
          } : f
        )
      );
    }
  };
  const handleSendText = (text) => {
    if (!webrtcManagerRef.current) return;
    const item = webrtcManagerRef.current.sendTextMessage(text);
    setTexts((prev) => [item, ...prev]);
  };
  const handleAcceptFile = (item) => {
    setIncomingOffer(null);
    webrtcManagerRef.current?.acceptIncomingFile(item);
  };
  const handleRejectFile = (itemId) => {
    setIncomingOffer(null);
    webrtcManagerRef.current?.rejectIncomingFile(itemId);
    setFiles(
      (prev) => prev.map((f) => f.id === itemId ? { ...f, state: "cancelled" } : f)
    );
  };
  const handleCancelTransfer = (itemId) => {
    webrtcManagerRef.current?.cancelTransfer(itemId);
  };
  const handleClearHistory = () => {
    setFiles((prev) => prev.filter((f) => f.state === "transferring" || f.state === "preparing"));
  };
  if (isAuthLoading) {
    return /* @__PURE__ */ jsx12("div", { className: "min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950", children: /* @__PURE__ */ jsx12("div", { className: "w-8 h-8 border-3 border-blue-600/30 border-t-blue-600 rounded-full animate-spin" }) });
  }
  if (!currentUser) {
    return /* @__PURE__ */ jsxs12("div", { className: "min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 selection:bg-blue-500 selection:text-white antialiased", children: [
      /* @__PURE__ */ jsx12(
        Navbar,
        {
          currentTab: "transfer",
          onTabChange: () => {
          },
          connectionState: "disconnected",
          theme,
          onToggleTheme: toggleTheme,
          hasActiveSession: false,
          currentUser: null
        }
      ),
      /* @__PURE__ */ jsx12("main", { className: "flex-1 flex items-center justify-center", children: /* @__PURE__ */ jsx12(AuthView, { onAuthSuccess: (user) => {
        setCurrentUser(user);
        setCurrentTab("transfer");
      } }) })
    ] });
  }
  return /* @__PURE__ */ jsxs12("div", { className: "min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 selection:bg-blue-500 selection:text-white antialiased", children: [
    /* @__PURE__ */ jsx12(
      Navbar,
      {
        currentTab,
        onTabChange: setCurrentTab,
        connectionState,
        peerDeviceInfo,
        sessionExpiresAt: session?.expiresAt,
        theme,
        onToggleTheme: toggleTheme,
        onEndSession: session ? handleEndSession : void 0,
        hasActiveSession: !!session,
        currentUser,
        onLogout: handleLogout
      }
    ),
    /* @__PURE__ */ jsx12("main", { className: "flex-1 pb-16", children: currentTab === "profile" ? /* @__PURE__ */ jsx12(
      ProfileView,
      {
        user: currentUser,
        onUpdateUser: setCurrentUser,
        onLogout: handleLogout
      }
    ) : currentTab === "history" ? /* @__PURE__ */ jsx12(
      HistoryView,
      {
        files,
        onClearHistory: handleClearHistory
      }
    ) : currentTab === "privacy" ? /* @__PURE__ */ jsx12(PrivacyView, {}) : currentTab === "help" ? /* @__PURE__ */ jsx12(HelpView, {}) : (
      /* Transfer Tab */
      /* @__PURE__ */ jsxs12("div", { children: [
        connectionState === "idle" && /* @__PURE__ */ jsx12(
          LandingView,
          {
            onStartSession: handleStartSession,
            onOpenJoin: () => setIsScannerOpen(true),
            localDeviceInfo,
            isCreating: isCreatingSession
          }
        ),
        (connectionState === "waiting" || connectionState === "creating" && session) && session && /* @__PURE__ */ jsx12("div", { className: "px-4 py-8", children: /* @__PURE__ */ jsx12(
          PairingCard,
          {
            session,
            onRefresh: handleStartSession,
            onCancel: handleEndSession,
            theme
          }
        ) }),
        connectionState === "connecting" && /* @__PURE__ */ jsxs12("div", { className: "max-w-md mx-auto px-4 py-20 text-center space-y-4", children: [
          /* @__PURE__ */ jsx12("div", { className: "w-16 h-16 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 mx-auto flex items-center justify-center", children: /* @__PURE__ */ jsx12("div", { className: "w-8 h-8 border-3 border-blue-600/30 border-t-blue-600 rounded-full animate-spin" }) }),
          /* @__PURE__ */ jsx12("h3", { className: "text-xl font-bold text-zinc-900 dark:text-zinc-100", children: "Establishing P2P WebRTC Connection..." }),
          /* @__PURE__ */ jsxs12("p", { className: "text-xs text-zinc-500 dark:text-zinc-400 max-w-xs mx-auto", children: [
            "Negotiating direct DataChannel with ",
            peerDeviceInfo?.name || "peer"
          ] })
        ] }),
        connectionState === "connected" && /* @__PURE__ */ jsx12(
          TransferDashboard,
          {
            localDeviceInfo,
            peerDeviceInfo,
            files,
            texts,
            incomingOffer,
            onSendFiles: handleSendFiles,
            onSendText: handleSendText,
            onAcceptFile: handleAcceptFile,
            onRejectFile: handleRejectFile,
            onCancelTransfer: handleCancelTransfer,
            autoAccept,
            onToggleAutoAccept: handleToggleAutoAccept,
            sessionRole: session?.role,
            onUploadCloudFallback: handleCloudUploadFallback
          }
        ),
        connectionState === "disconnected" && /* @__PURE__ */ jsxs12("div", { className: "max-w-md mx-auto px-4 py-16 text-center space-y-4", children: [
          /* @__PURE__ */ jsx12("div", { className: "w-14 h-14 rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400 mx-auto flex items-center justify-center", children: /* @__PURE__ */ jsx12("div", { className: "w-6 h-6 border-2 border-rose-600 rounded-full" }) }),
          /* @__PURE__ */ jsx12("h3", { className: "text-lg font-bold text-zinc-900 dark:text-zinc-100", children: "Peer Connection Lost" }),
          /* @__PURE__ */ jsx12("p", { className: "text-xs text-zinc-500 dark:text-zinc-400 max-w-xs mx-auto", children: "The remote device closed or refreshed their session." }),
          /* @__PURE__ */ jsx12(
            "button",
            {
              onClick: handleEndSession,
              className: "px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs shadow-sm transition-colors cursor-pointer",
              id: "restart-after-disconnect-btn",
              children: "Start New Session"
            }
          )
        ] })
      ] })
    ) }),
    /* @__PURE__ */ jsx12(
      QrScannerModal,
      {
        isOpen: isScannerOpen,
        onClose: () => setIsScannerOpen(false),
        onScanSuccess: (codeOrToken) => {
          handleJoinSession(codeOrToken).catch(() => {
          });
        },
        onSwitchToManual: () => {
          setIsScannerOpen(false);
          setIsManualJoinOpen(true);
        }
      }
    ),
    /* @__PURE__ */ jsx12(
      ManualJoinModal,
      {
        isOpen: isManualJoinOpen,
        onClose: () => setIsManualJoinOpen(false),
        onSubmit: handleJoinSession,
        onSwitchToCamera: () => {
          setIsManualJoinOpen(false);
          setIsScannerOpen(true);
        }
      }
    )
  ] });
}

// src/main.tsx
import { jsx as jsx13 } from "react/jsx-runtime";
createRoot(document.getElementById("root")).render(
  /* @__PURE__ */ jsx13(StrictMode, { children: /* @__PURE__ */ jsx13(App, {}) })
);
