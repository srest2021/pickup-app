import {
  render,
  screen,
  waitFor,
  fireEvent,
} from "@testing-library/react-native";
import GameThumbnail from "../../../src/components/game/GameThumbnail";
import { TamaguiProvider } from "tamagui";
import appConfig from "../../../tamagui.config";
import "@testing-library/jest-dom";

describe("GamesThumbnail", () => {
  test("renders GameThumbnail component without crashing", () => {
    const navigation = {}; // Mock navigation object
    const game = {
      title: "Test Game",
      datetime: new Date(),
      sport: { name: "football", skillLevel: 0 },
      description: "Test description",
      maxPlayers: 10,
    }; // Mock game object
    const { root } = render(
      <TamaguiProvider config={appConfig}>
        <GameThumbnail navigation={navigation} game={game} gametype="my" />
      </TamaguiProvider>,
    );
    expect(root).toBeTruthy();
  });

  test("renders game details correctly", async () => {
    const navigation = {}; // Mock navigation object
    const game = {
      title: "Test Game",
      datetime: new Date("March 30, 2024 03:24:00"),
      sport: { name: "football", skillLevel: 0 },
      description: "Test description",
      maxPlayers: 10,
    }; // Mock game object
    const { root } = render(
      <TamaguiProvider config={appConfig}>
        <GameThumbnail navigation={navigation} game={game} gametype="my" />
      </TamaguiProvider>,
    );
    await waitFor(() => {
      expect(screen.getByTestId("game-title").props.children).toBe("Test Game");
      expect(screen.getByTestId("game-description").props.children).toBe(
        "Test description",
      );
      expect(screen.getByTestId("game-date").props.children).toBe("Sat, 3/30");
    });
  });

  test("navigates to MyGameView screen on button click", () => {
    const navigateMock = jest.fn();
    const navigation = { navigate: navigateMock }; // Mock navigation object
    const game = {
      id: "12345",
      title: "Test Game",
      datetime: new Date(),
      sport: { name: "football", skillLevel: 1 },
      description: "Test description",
      maxPlayers: 10,
    }; // Mock game object
    const { root } = render(
      <GameThumbnail navigation={navigation} game={game} gametype="my" />,
    );
    const viewButton = screen.getByTestId("view-button");
    fireEvent.press(viewButton);
    const gameId = game.id;
    expect(navigateMock).toHaveBeenCalledWith("MyGameView", { gameId });
  });

  test("displays image if image is provided", () => {
    const navigation = {}; // Mock navigation object
    const game = {
      title: "Test Game",
      datetime: new Date(),
      sport: { name: "football", skillLevel: 1 },
      description: "Test description",
      maxPlayers: 10,
    }; // Mock game object
    const { root } = render(
      <GameThumbnail navigation={navigation} game={game} gametype="my" />,
    );
    const imageComponent = screen.getByTestId("game-thumbnail-image");
    const expectedImageComponent = {
      source: {
        width: 170,
        height: 170,
        uri: "https://static.vecteezy.com/system/resources/previews/009/858/266/original/football-clip-art-free-png.png",
      },
      resizeMode: "contain",
      testID: "game-thumbnail-image",
      style: { opacity: 0.4 },
      children: undefined,
    };
    expect(imageComponent.props).toMatchObject(expectedImageComponent);
  });
});
