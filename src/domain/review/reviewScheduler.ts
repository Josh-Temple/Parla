import { addDays } from "@/lib/dates";
import type { Rating } from "../progress/progressTypes";

export function computeNextDueDate(rating: Rating, now = new Date()): Date {
  if (rating === "easy") return addDays(now, 4);
  if (rating === "close") return addDays(now, 2);
  return addDays(now, 1);
}
