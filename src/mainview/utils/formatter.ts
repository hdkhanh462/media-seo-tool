import type { SizeUnit } from "@/types/formatter.types";

export const SIZE_UNITS: SizeUnit[] = ["Bytes", "KB", "MB", "GB", "TB", "PB"];

type BytesToSizeReturn = {
  value: number;
  unit: SizeUnit;
  label: string;
};

export const bytesToSize = (bytes: number, decimals = 2): BytesToSizeReturn => {
  if (bytes === 0) return { value: 0, unit: "Bytes", label: "0 Bytes" };

  const k = 1024;

  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const value = parseFloat((bytes / k ** i).toFixed(decimals));

  return {
    value,
    unit: SIZE_UNITS[i],
    label: `${value} ${SIZE_UNITS[i]}`,
  };
};

export const middleEllipsis = (str: string, maxLength = 20) => {
  if (str.length <= maxLength) return str;

  const half = Math.floor((maxLength - 3) / 2);
  return `${str.slice(0, half)}...${str.slice(-half)}`;
};
