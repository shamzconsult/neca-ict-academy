"use client";

import { NECA_ICT_ACADEMY_LOGO } from "@/const";
import React from "react";

export const AdminLogo = ({ compact = false }: { compact?: boolean }) => {
  return (
    <div className={compact ? "relative" : "relative m-4"}>
      <img
        src={NECA_ICT_ACADEMY_LOGO}
        alt='Neca ict academy logo'
        className={compact ? "h-8 w-auto" : undefined}
      />
    </div>
  );
};
