import type { ProgressItem, Rating } from "../progress/progressTypes";

const INTERVAL_LADDER_DAYS = [0, 1, 3, 7, 14, 30] as const;
const SAME_SESSION_REQUEUE_STEP = 0;

export interface ReviewScheduleResult {
  intervalStep: number;
  intervalDays: number;
  correctStreak: number;
  sameDayRequeueCount: number;
  nextDueAt: Date;
  shouldRequeueInSession: boolean;
}

function clampStep(step: number): number {
  return Math.min(Math.max(step, 0), INTERVAL_LADDER_DAYS.length - 1);
}

function addDays(date: Date, days: number): Date {
  const copy = new Date(date);
  copy.setDate(copy.getDate() + days);
  return copy;
}

function isWeakCard(progress?: ProgressItem | null): boolean {
  if (!progress) return true;
  return (progress.interval_step ?? 0) <= 1 || progress.correct_streak < 2;
}

export function getIntervalLadderDays(): readonly number[] {
  return INTERVAL_LADDER_DAYS;
}

export function computeNextReview(progress: ProgressItem | null | undefined, rating: Rating, now = new Date()): ReviewScheduleResult {
  const currentStep = clampStep(progress?.interval_step ?? 0);
  const currentRequeueCount = progress?.same_day_requeue_count ?? 0;

  if (rating === "hard") {
    const shouldRequeueInSession = isWeakCard(progress);
    const intervalStep = shouldRequeueInSession ? SAME_SESSION_REQUEUE_STEP : clampStep(currentStep - 1);
    const intervalDays = INTERVAL_LADDER_DAYS[intervalStep];

    return {
      intervalStep,
      intervalDays,
      correctStreak: 0,
      sameDayRequeueCount: shouldRequeueInSession ? currentRequeueCount + 1 : 0,
      nextDueAt: intervalDays === 0 ? now : addDays(now, intervalDays),
      shouldRequeueInSession,
    };
  }

  const stepAdvance = rating === "easy" ? 2 : 1;
  const intervalStep = clampStep(currentStep + stepAdvance);
  const intervalDays = INTERVAL_LADDER_DAYS[intervalStep];

  return {
    intervalStep,
    intervalDays,
    correctStreak: (progress?.correct_streak ?? 0) + 1,
    sameDayRequeueCount: 0,
    nextDueAt: intervalDays === 0 ? now : addDays(now, intervalDays),
    shouldRequeueInSession: false,
  };
}

export function computeNextDueDate(rating: Rating, now = new Date(), progress?: ProgressItem | null): Date {
  return computeNextReview(progress, rating, now).nextDueAt;
}
