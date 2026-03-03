export function moodToBg(score: number): string {
  if (score === 0) return "bg-gray-800";
  if (score <= 1) return "bg-red-900/60";
  if (score <= 2) return "bg-orange-900/60";
  if (score <= 3) return "bg-yellow-900/60";
  if (score <= 4) return "bg-emerald-900/60";
  return "bg-emerald-600/80";
}

export function moodToText(score: number): string {
  if (score === 0) return "text-gray-600";
  if (score <= 1) return "text-red-400";
  if (score <= 2) return "text-orange-400";
  if (score <= 3) return "text-yellow-400";
  if (score <= 4) return "text-emerald-400";
  return "text-emerald-300";
}

export function moodToLabel(score: number): string {
  const labels: Record<number, string> = {
    1: "Very Low",
    2: "Low",
    3: "Okay",
    4: "Good",
    5: "Excellent",
  };
  return labels[score] ?? "—";
}

export const moodEmojis: Record<number, string> = {
  1: "😞",
  2: "😕",
  3: "😐",
  4: "😊",
  5: "😄",
};
