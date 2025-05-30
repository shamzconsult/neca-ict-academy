"use client";

import { createContext, useContext } from "react";

export interface SidebarContextType {
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
}

export const SidebarContext = createContext<SidebarContextType | undefined>(
  undefined
);

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarContext.Provider");
  }
  return context;
};
