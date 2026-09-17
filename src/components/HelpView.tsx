import React from 'react';
import { 
  HelpCircle, 
  QrCode, 
  Wifi, 
  Smartphone, 
  ShieldAlert, 
  HardDrive, 
  ChevronRight,
  ExternalLink
} from 'lucide-react';

export const HelpView: React.FC = () => {
  const faqItems = [
    {
      icon: <QrCode className="w-5 h-5 text-blue-500" />,
      title: "QR code won't scan",
      solution:
        "Increase the screen brightness on the displaying device and ensure there is no glare on the screen. If the camera still struggles to focus or permissions are denied, you can always click 'Join with Code' and enter the 8-character pairing code manually."
    },
    {
      icon: <Wifi className="w-5 h-5 text-emerald-500" />,
      title: "Devices won't establish connection",
      solution:
        "Both devices must be connected to the internet to perform the initial WebRTC signaling handshake. If you are on an enterprise, university, or hospital Wi-Fi network, strict firewall rules may block direct peer-to-peer UDP traffic. Switching one device to a cellular hotspot or enabling a TURN relay server resolves this."
    },
    {
      icon: <Smartphone className="w-5 h-5 text-purple-500" />,
      title: "How to save files on iPhone / iOS Safari",
      solution:
        "When an incoming file completes on iOS Safari, click 'Save'. iOS will present a download prompt or file preview. Tap the standard Share icon and choose 'Save to Files' (for documents, archives, or videos) or 'Save Image' (for photos)."
    },
    {
      icon: <HardDrive className="w-5 h-5 text-amber-500" />,
      title: "Transfer is interrupted or slows down",
      solution:
        "Modern mobile operating systems aggressively throttle or suspend background browser tabs. Keep the QuickDrop browser tab active in the foreground on both devices until the transfer reaches 100% and SHA-256 verification completes."
    },
    {
      icon: <ShieldAlert className="w-5 h-5 text-rose-500" />,
      title: "Are transfers really private and secure?",
      solution:
        "Yes. QuickDrop establishes a direct, encrypted WebRTC DataChannel between devices using DTLS. The signaling server coordinates connection setup only; your actual file contents never pass through or get saved on any server."
    }
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
      {/* Title */}
      <div className="space-y-2 text-center sm:text-left">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/80">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Troubleshooting & FAQ</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          Help & Frequently Asked Questions
        </h2>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
          Quick answers and solutions for common connection, transfer, and browser scenarios.
        </p>
      </div>

      {/* FAQ Items */}
      <div className="space-y-4">
        {faqItems.map((item, idx) => (
          <div
            key={idx}
            className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-2"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 shrink-0">
                {item.icon}
              </div>
              <h3 className="font-bold text-sm sm:text-base text-zinc-900 dark:text-zinc-100">
                {item.title}
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 pl-11 leading-relaxed">
              {item.solution}
            </p>
          </div>
        ))}
      </div>

      {/* STUN/TURN Note */}
      <div className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-500 dark:text-zinc-400 space-y-2">
        <div className="font-semibold text-zinc-800 dark:text-zinc-200">
          Advanced Network Information
        </div>
        <p className="leading-relaxed">
          QuickDrop uses standard Google STUN servers (<code className="font-mono text-[11px] bg-zinc-200 dark:bg-zinc-800 px-1 py-0.5 rounded">stun:stun.l.google.com:19302</code>) by default. If you are deploying in an enterprise environment with strict symmetric NATs, you can define custom <code className="font-mono text-[11px] bg-zinc-200 dark:bg-zinc-800 px-1 py-0.5 rounded">TURN_SERVER_URL</code>, <code className="font-mono text-[11px] bg-zinc-200 dark:bg-zinc-800 px-1 py-0.5 rounded">TURN_USERNAME</code>, and <code className="font-mono text-[11px] bg-zinc-200 dark:bg-zinc-800 px-1 py-0.5 rounded">TURN_CREDENTIAL</code> environment variables.
        </p>
      </div>
    </div>
  );
};
