import { render, getByText } from "@testing-library/react-native";
import { TamaguiProvider } from "tamagui";
import appConfig from "../../../tamagui.config";
import "@testing-library/jest-dom";
import GamePlayers from "../../../src/components/game/GamePlayers";

// mock user
const mockUser = {
  id: "testid",
  username: "testusername",
  displayName: "test display name",
  bio: "test bio",
  avatarUrl: "test avatar url",
  sports: [],
};

// mock session with user object
const mockSession = {
  access_token: "access_token_test_string",
  refresh_token: "refresh_token_test_string",
  expires_in: 90000000,
  token_type: "token_type_test",
  user: mockUser,
};

// mock useMutationUser hook
jest.mock("../../../src/hooks/use-mutation-user", () => ({
  __esModule: true,
  default: jest.fn(() => ({
    session: mockSession,
    setSession: jest.fn(),
    user: mockUser,
  })),
}));

describe("GamePlayers", () => {
  beforeEach(() => {
    mockFeedGame = {
      id: "game_1",
      organizerId: "user_1",
      title: "test_game",
      description: "T",
      datetime: new Date(),
      sport: { name: "soccer", skillLevel: 1 },
      maxPlayers: 4,
      currentPlayers: 2,
      isPublic: true,
      distanceAway: 5,
      address: null,
      acceptedPlayers: [
        { id: "user_1", username: "Player 1" },
        { id: "user_2", username: "Player 2" },
      ],
      organizer: {
        id: "user_1",
        username: "test_username",
        displayName: "test",
        bio: "test",
        avatarUrl: "test",
      },
    };
  });

  test("renders accepted players correctly", async () => {
    const { findByTestId } = render(
      <TamaguiProvider config={appConfig}>
        <GamePlayers navigation={1} game={mockFeedGame} gametype="feed" />
      </TamaguiProvider>,
    );

    const acceptedPlayersContainer = await findByTestId(
      "accepted-players-container",
    );
    expect(acceptedPlayersContainer).toBeInTheDocument();

    const player1 = await getByText("Player 1");
    expect(player1).toBeInTheDocument();

    const player2 = await getByText("Player 2");
    expect(player2).toBeInTheDocument();

    const playerCount = await getByText("2/4");
    expect(playerCount).toBeInTheDocument();
  });
});
