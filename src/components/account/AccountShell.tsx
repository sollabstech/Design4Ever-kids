"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { Spinner } from "@/components/ui";
import { Avatar } from "@/components/account/Avatar";

const nav = [
  { href: "/account", label: "Dashboard", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
  { href: "/account/orders", label: "My Orders", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" },
  { href: "/account/wishlist", label: "Wishlist", icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" },
  { href: "/account/addresses", label: "Addresses", icon: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z" },
  { href: "/account/reviews", label: "Reviews", icon: "M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" },
  { href: "/account/profile", label: "Profile", icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" },
  { href: "/account/settings", label: "Settings", icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065zM15 12a3 3 0 11-6 0 3 3 0 016 0z" },
];

function NavIcon({ d }: { d: string }) {
  return (
    <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d={d} />
    </svg>
  );
}

export default function AccountShell({ children }: { children: React.ReactNode }) {
  const { ready, user, logout, orders } = useStore();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (ready && !user) router.replace(`/login?next=${encodeURIComponent(pathname)}`);
  }, [ready, user, pathname, router]);

  if (!ready || !user) return <Spinner label="Loading your account…" />;

  // Invoice is a print view without the account chrome.
  if (pathname.endsWith("/invoice")) return <>{children}</>;

  const isActive = (href: string) => (href === "/account" ? pathname === href : pathname.startsWith(href));
  const badge = orders.length >= 5 ? "Super Shopper" : orders.length > 0 ? "Happy Shopper" : "New Member";

  const doLogout = () => { router.push("/"); void logout(); };

  return (
    <div className="bg-gradient-to-b from-[#e0f4fb]/60 via-gray-50 to-gray-50 min-h-screen">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6 items-start">
        <aside className="bg-white rounded-3xl border border-gray-100 shadow-sm lg:sticky lg:top-32 overflow-hidden">
          <div className="flex items-center gap-4 p-5 bg-gradient-to-br from-[#fff0f7] to-white">
            <Avatar name={user.name} avatar={user.avatar} />
            <div className="min-w-0">
              <div className="font-black text-[#1a1a2e] text-lg truncate">Hi, {user.name.split(" ")[0]}! 👋</div>
              <div className="text-sm text-gray-500">Welcome back</div>
              <span className="inline-block mt-1 text-xs font-bold text-[#e91e8c] bg-[#fce4ec] px-2.5 py-1 rounded-lg">{badge}</span>
            </div>
          </div>
          <nav className="flex lg:flex-col gap-1 p-3 overflow-x-auto scrollbar-hide">
            {nav.map((n) => {
              const active = isActive(n.href);
              return (
                <Link key={n.href} href={n.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold whitespace-nowrap transition-colors relative ${
                    active ? "bg-[#fce4ec] text-[#e91e8c]" : "text-[#1a1a2e] hover:bg-gray-50"
                  }`}>
                  {active && <span className="hidden lg:block absolute -left-3 top-2 bottom-2 w-1 rounded-r-full bg-[#e91e8c]" />}
                  <NavIcon d={n.icon} />
                  {n.label}
                </Link>
              );
            })}
            <div className="hidden lg:block h-px bg-gray-100 my-2 mx-2" />
            <button onClick={doLogout} className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-[#1a1a2e] hover:bg-red-50 hover:text-red-500 whitespace-nowrap transition-colors">
              <NavIcon d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              Logout
            </button>
          </nav>
        </aside>
        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}
