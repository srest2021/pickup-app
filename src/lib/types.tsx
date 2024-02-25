export type User = {
  username: string;
  displayName: string;
  bio: string;
  avatarUrl: string;
  sports: UserSport[];
};

// displayed on user profile
export type UserSport = {
  id: string;
  name: string;
  skillLevel: SkillLevel;
};

// displayed on games
export type GameSport = {
  name: string;
  skillLevel: SkillLevel;
};

export enum SkillLevel {
  Beginner = 0,
  Intermediate = 1,
  Advanced = 2,
}

export type Game = {
  title: string;
  description: string;
  datetime: Date;
  address: string;
  sport: GameSport;
  maxPlayers: number;
}

export const sports = [
  { name: "Soccer" },
  { name: "Basketball" },
  { name: "Tennis" },
  { name: "Football" },
  { name: "Volleyball" },
];
