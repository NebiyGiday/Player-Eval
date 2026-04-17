import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function calcOverall(
  technical: number,
  gameIq: number,
  physical: number,
  mental: number
): number {
  return Math.round(((technical + gameIq + physical + mental) / 4) * 10) / 10;
}

export function getScoreColor(score: number): string {
  if (score >= 8) return "text-brand-green";
  if (score >= 6) return "text-brand-amber";
  return "text-brand-coral";
}

export function getScoreBg(score: number): string {
  if (score >= 8) return "bg-brand-green-light text-brand-green-dark";
  if (score >= 6) return "bg-brand-amber-light text-amber-800";
  return "bg-brand-coral-light text-red-800";
}

export const DRILLS = [
  {
    id: "1",
    title: "First Touch Drill",
    category: "technical" as const,
    duration_minutes: 8,
    description: "Wall passes focusing on cushioned first touch control",
    location: "Wall or partner",
    video_url: "https://youtube.com",
  },
  {
    id: "2",
    title: "Awareness Rondo",
    category: "tactical" as const,
    duration_minutes: 12,
    description: "4v1 rondo to build scanning habits and quick decision making",
    location: "4+ players",
    video_url: "https://youtube.com",
  },
  {
    id: "3",
    title: "Acceleration Sprint",
    category: "physical" as const,
    duration_minutes: 10,
    description: "Short burst sprints with direction changes to build first step speed",
    location: "Park or garden",
    video_url: "https://youtube.com",
  },
  {
    id: "4",
    title: "Wall Pass Reps",
    category: "technical" as const,
    duration_minutes: 5,
    description: "Quick one-two passes against a wall to build combination play",
    location: "Wall only",
    video_url: "https://youtube.com",
  },
  {
    id: "5",
    title: "Pressure Receiving",
    category: "technical" as const,
    duration_minutes: 10,
    description: "Receive passes under simulated pressure, focus on body shape",
    location: "Partner drill",
    video_url: "https://youtube.com",
  },
  {
    id: "6",
    title: "Mental Focus Sets",
    category: "mental" as const,
    duration_minutes: 6,
    description: "Visualisation and reset routines for composure under pressure",
    location: "Anywhere",
    video_url: "https://youtube.com",
  },
];
