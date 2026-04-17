export type UserRole = "coach" | "parent";

export interface Player {
  id: string;
  name: string;
  position: string;
  age_group: string;
  jersey_number?: number;
  team_id: string;
  parent_user_id?: string;
  created_at: string;
}

export interface Evaluation {
  id: string;
  player_id: string;
  coach_user_id: string;
  technical: number;
  game_iq: number;
  physical: number;
  mental: number;
  overall: number;
  coach_note?: string;
  strengths: string[];
  focus_areas: string[];
  created_at: string;
}

export interface PlayerWithLatestEval extends Player {
  latest_evaluation?: Evaluation;
  eval_count: number;
}

export interface EvaluationFormData {
  player_id: string;
  technical: number;
  game_iq: number;
  physical: number;
  mental: number;
  coach_note?: string;
  strengths: string[];
  focus_areas: string[];
}

export interface DrillCard {
  id: string;
  title: string;
  category: "technical" | "tactical" | "physical" | "mental";
  duration_minutes: number;
  description: string;
  video_url?: string;
  location: string;
}

export const PRESET_COMMENTS = [
  "Great awareness today",
  "Improving confidence on the ball",
  "Strong effort throughout",
  "Next: first touch under pressure",
  "Excellent positioning",
  "Good communication with teammates",
  "Showing real improvement",
  "Composed under pressure",
];

export const STRENGTH_OPTIONS = [
  "Great awareness & positioning",
  "Strong mental composure",
  "Excellent first touch",
  "Good game reading",
  "Physical presence",
  "Team communication",
  "Work rate & effort",
  "Technical skill on the ball",
];

export const FOCUS_OPTIONS = [
  "First touch under pressure",
  "Acceleration off the ball",
  "Defensive positioning",
  "Decision making speed",
  "Aerial ability",
  "Weak foot development",
  "Set piece awareness",
  "Pressing triggers",
];
