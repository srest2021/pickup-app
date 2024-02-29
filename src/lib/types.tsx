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
  id: string;
  title: string;
  description: string;
  datetime: Date;
  address: string;
  sport: GameSport;
  maxPlayers: number;
};

export const sports = [
  { name: "Soccer" , image: "https://png.pngtree.com/png-clipart/20230109/original/pngtree-cartoon-soccer-ball-png-image_8891769.png"},
  { name: "Basketball", image: "https://static.vecteezy.com/system/resources/previews/010/171/336/original/basketball-ball-is-sports-equipment-file-free-png.png" },
  { name: "Tennis", image: "https://www.pngall.com/wp-content/uploads/4/Tennis-Ball-Background-PNG-Image.png" },
  { name: "Football", image: "https://static.vecteezy.com/system/resources/previews/009/858/266/original/football-clip-art-free-png.png" },
  { name: "Volleyball", image: "https://i.pinimg.com/originals/8f/75/05/8f7505cd0a85092003023c5958e2a0fd.png" },
];
