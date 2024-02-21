export type User = {
  username: string;
  displayName: string;
  bio: string;
  avatarUrl: string;
  sports: Sport[];
};

export type Sport = {
  id: string;
  name: string;
  skillLevel: SkillLevel;
};

export enum SkillLevel {
  Beginner = 0,
  Intermediate = 1,
  Advanced = 2,
}
