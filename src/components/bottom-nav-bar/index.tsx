"use client";

import { TreesIcon, User } from "lucide-react";
import * as S from "./index.sc";
import { usePathname } from "next/dist/client/components/navigation";

export default function BottomNavBar() {
  const pathname = usePathname();

  return (
    <S.NavWrapper>
      <S.NavItem href="/" isSelected={pathname == "/"}>
        <TreesIcon />
        Your Garden
      </S.NavItem>
      <S.NavItem href="/profile" isSelected={pathname == "/profile"}>
        <User />
        Profile
      </S.NavItem>
    </S.NavWrapper>
  );
}
