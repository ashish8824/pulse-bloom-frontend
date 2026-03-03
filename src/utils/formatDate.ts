import { format, formatDistanceToNow, parseISO } from "date-fns";

export const formatDate = (date: string) =>
  format(parseISO(date), "MMM d, yyyy");

export const formatDateTime = (date: string) =>
  format(parseISO(date), "MMM d, yyyy · h:mm a");

export const formatMonth = (date: string) =>
  format(parseISO(date + "-01"), "MMMM yyyy");

export const formatRelative = (date: string) =>
  formatDistanceToNow(parseISO(date), { addSuffix: true });

export const toMonthParam = (date: Date) => format(date, "yyyy-MM");
