"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { TreesIcon, User } from "lucide-react";

const activeColor = "oklch(95% 0.052 163.051)";

const BottomNavBar: React.FC = () => {
  const pathname = usePathname();

  return (
    <nav className="sticky bottom-0 left-0 right-0 min-h-[80px] w-full bg-[oklch(27.7%_0.046_192.524)] shadow-[0_-2px_10px_rgba(0,0,0,0.15)] flex justify-around items-center z-40">
      <Link
        href="/"
        className="flex flex-col items-center py-2"
        style={{ textDecoration: "none" }}
      >
        <TreesIcon
          size={28}
          color={pathname === "/" ? activeColor : "white"}
          fill={pathname === "/" ? activeColor : "transparent"}
          strokeWidth={pathname === "/" ? 1.5 : 1}
        />
        <span
          className={`mt-1 text-sm ${pathname === "/" ? "font-medium" : ""}`}
          style={{
            color: pathname === "/" ? activeColor : "white",
            textDecoration: "none",
          }}
        >
          Your Garden
        </span>
      </Link>

      <Link
        href="/profile"
        className="flex flex-col items-center py-2"
        style={{ textDecoration: "none" }}
      >
        <User
          size={28}
          color={pathname === "/profile" ? activeColor : "white"}
          fill={pathname === "/profile" ? activeColor : "transparent"}
          strokeWidth={pathname === "/profile" ? 1.5 : 1}
        />
        <span
          className={`mt-1 text-sm ${
            pathname === "/profile" ? "font-medium" : ""
          }`}
          style={{
            color: pathname === "/profile" ? activeColor : "white",
            textDecoration: "none",
          }}
        >
          Profile
        </span>
      </Link>
    </nav>
  );
};

export default BottomNavBar;
