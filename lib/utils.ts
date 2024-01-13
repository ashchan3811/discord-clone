import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatDate = (
  date: Date | string,
  formatString = "d MMM yyyy, HH:mm",
) => {
  if (typeof date === "string") {
    date = new Date(date);
  }

  return format(date, formatString);
};
