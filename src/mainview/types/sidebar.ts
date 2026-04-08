import type { LucideIcon } from "lucide-react";

export type NavMainItem = {
  key: string;
  title: string;
  url?: string;
  icon?: LucideIcon;
  isActive?: boolean;
  items?: {
    title: string;
    url?: string;
    onClick?: () => void;
  }[];
  onClick?: () => void;
};
