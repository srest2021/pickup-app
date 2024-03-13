export type User = {
  id: string;
  username: string;
  displayName: string;
  bio: string;
  avatarUrl: string;
  sports: UserSport[];
};

export interface Sport {
  name: string;
  skillLevel: SkillLevel;
}

// displayed on user profile
export type UserSport = Sport & { id: string };

// displayed on games
export type GameSport = Sport;

export enum SkillLevel {
  Beginner = 0,
  Intermediate = 1,
  Advanced = 2,
}

export function getSkillLevelString(skillLevel: SkillLevel): string {
  switch (skillLevel) {
    case SkillLevel.Beginner:
      return "Beginner";
    case SkillLevel.Intermediate:
      return "Intermediate";
    case SkillLevel.Advanced:
      return "Advanced";
    default:
      return "Unknown";
  }
}

export function getSkillLevelColors(skillLevel: SkillLevel) {
  switch (skillLevel) {
    case SkillLevel.Beginner:
      return ["green", "white", "white"];
    case SkillLevel.Intermediate:
      return ["orange", "orange", "white"];
    case SkillLevel.Advanced:
      return ["red", "red", "red"];
    default:
      return ["white", "white", "white"];
  }
}

export type Address = {
  street: string;
  city: string;
  state: string;
  zip: string;
};

export interface Game {
  id: string;
  organizerId: string;
  title: string;
  description: string;
  datetime: Date;
  sport: GameSport;
  maxPlayers: number;
  currentPlayers: number;
  isPublic: boolean;
  distanceAway: number | string;
}

export type MyGame = Game & {
  address: Address;
  joinRequests: User[];
  acceptedPlayers: User[];
};

export type JoinedGame = Game & {
  address: Address;
  acceptedPlayers: User[];
  organizer: User;
};

export type FeedGame = Game & {
  hasRequested: boolean;
  acceptedPlayers: User[];
  organizer: User;
};

export const sports = [
  {
    name: "soccer",
    image:
      "https://png.pngtree.com/png-clipart/20230109/original/pngtree-cartoon-soccer-ball-png-image_8891769.png",
  },
  {
    name: "basketball",
    image:
      "https://static.vecteezy.com/system/resources/previews/010/171/336/original/basketball-ball-is-sports-equipment-file-free-png.png",
  },
  {
    name: "tennis",
    image:
      "https://www.pngall.com/wp-content/uploads/4/Tennis-Ball-Background-PNG-Image.png",
  },
  {
    name: "football",
    image:
      "https://static.vecteezy.com/system/resources/previews/009/858/266/original/football-clip-art-free-png.png",
  },
  {
    name: "volleyball",
    image:
      "https://i.pinimg.com/originals/8f/75/05/8f7505cd0a85092003023c5958e2a0fd.png",
  },
];
