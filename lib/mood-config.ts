export type MoodType = "tired" | "stressed" | "balanced" | "energized" | "motivated" | "creative" | null;

export interface MoodConfig {
  id: MoodType;
  label: string;
  recommendedCategories: string[];
  recommendedDurations: number[];
  recommendedTags: string[];
  headline: string;
  subtitle: string;
  studioSubtitle: string;
}

export const moodConfigs: Record<NonNullable<MoodType>, MoodConfig> = {
  tired: {
    id: "tired",
    label: "Tired",
    recommendedCategories: ["yoga", "pilates", "barre"],
    recommendedDurations: [45, 55, 60, 75],
    recommendedTags: ["relaxing", "restorative", "low-impact", "gentle", "evening"],
    headline: "Gentle Movement Awaits",
    subtitle: "Low-impact classes to restore your energy",
    studioSubtitle: "Calm spaces for restorative practice",
  },
  stressed: {
    id: "stressed",
    label: "Stressed",
    recommendedCategories: ["yoga", "boxing", "cycling"],
    recommendedDurations: [40, 45, 50, 60],
    recommendedTags: ["stress-relief", "breath-focused", "technique", "music-driven"],
    headline: "Release & Reset",
    subtitle: "Classes to help you unwind and let go",
    studioSubtitle: "Studios focused on mindful movement",
  },
  balanced: {
    id: "balanced",
    label: "Balanced",
    recommendedCategories: ["yoga", "pilates", "barre", "cycling"],
    recommendedDurations: [45, 50, 55, 60],
    recommendedTags: ["breath-focused", "sculpting", "core", "technique"],
    headline: "Maintain Your Flow",
    subtitle: "Classes to keep you feeling great",
    studioSubtitle: "Top-rated studios near you",
  },
  energized: {
    id: "energized",
    label: "Energized",
    recommendedCategories: ["cycling", "hiit", "boxing", "dance"],
    recommendedDurations: [40, 45, 50],
    recommendedTags: ["high-energy", "cardio", "music-driven", "intense"],
    headline: "Channel That Energy",
    subtitle: "High-intensity classes to match your vibe",
    studioSubtitle: "Studios that bring the energy",
  },
  motivated: {
    id: "motivated",
    label: "Motivated",
    recommendedCategories: ["hiit", "strength", "boxing", "cycling"],
    recommendedDurations: [40, 45, 50],
    recommendedTags: ["intense", "fat-burning", "full-body", "cardio"],
    headline: "Push Your Limits",
    subtitle: "Challenge yourself with these intense sessions",
    studioSubtitle: "Studios built for results",
  },
  creative: {
    id: "creative",
    label: "Creative",
    recommendedCategories: ["dance", "barre", "yoga"],
    recommendedDurations: [45, 50, 60],
    recommendedTags: ["music-driven", "expressive", "fun", "technique"],
    headline: "Express Yourself",
    subtitle: "Flow and move with creative freedom",
    studioSubtitle: "Studios that inspire movement",
  },
};

export const defaultConfig: Omit<MoodConfig, "id" | "label"> = {
  recommendedCategories: [],
  recommendedDurations: [],
  recommendedTags: [],
  headline: "Recommended For You",
  subtitle: "Based on your preferences",
  studioSubtitle: "Top-rated in your area",
};

export function getMoodConfig(mood: MoodType): Omit<MoodConfig, "id" | "label"> {
  if (!mood) return defaultConfig;
  return moodConfigs[mood];
}
