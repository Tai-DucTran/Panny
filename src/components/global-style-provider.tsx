"use client";

import { GlobalStyle } from "@/styles/globals-style";
import React from "react";

export default function GlobalStyleProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        margin: "16px",
        marginBottom: "88px",
      }}
    >
      <GlobalStyle />
      {children}
    </div>
  );
}
