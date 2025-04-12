"use client";

import { HandCoinsIcon, TreesIcon, User } from "lucide-react";
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

      <S.NavItem
        href="/add-new-plant"
        isSelected={pathname == "/add-new-plant"}
      >
        <HandCoinsIcon />
        Add Plant
      </S.NavItem>

      <S.NavItem href="/profile" isSelected={pathname == "/profile"}>
        <User />
        Profile
      </S.NavItem>
    </S.NavWrapper>
  );
}
