export type Rating = "easy" | "close" | "hard";

export interface ProgressItem {
  card_id: string;
  last_reviewed_at: string;
  rating: Rating;
  review_count: number;
  correct_streak: number;
  next_due_at: string;
  favorite: boolean;
  want_to_use: boolean;
  confusing: boolean;
  hidden: boolean;
}
