// when viewing my profile
export type User = {
  id: string;
  username: string;
  displayName: string;
  bio: string;
  avatarUrl: string;
  sports: UserSport[];
};

// when viewing another user's profile
export type OtherUser = User & {
  hasRequested: boolean;
  isFriend: boolean;
};

// this is the type used for:
// - organizer, accepted players, and join requests when querying games
// - friends and friend requests when querying list of friends or list of friend requests
// this will essentially lower our egress
// and we can query the entire user profile if the user navigates to the OtherProfile component
export type ThumbnailUser = {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string;
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
      return ["#05a579", "white", "white"];
    case SkillLevel.Intermediate:
      return ["#ff7403", "#ff7403", "white"];
    case SkillLevel.Advanced:
      return ["#e90d52", "#e90d52", "#e90d52"];
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
  joinRequests: ThumbnailUser[];
  acceptedPlayers: ThumbnailUser[];
};

export type JoinedGame = Game & {
  address: Address;
  acceptedPlayers: ThumbnailUser[];
  organizer: ThumbnailUser;
};

export type FeedGame = Game & {
  hasRequested: boolean;
  acceptedPlayers: ThumbnailUser[];
  organizer: ThumbnailUser;
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
