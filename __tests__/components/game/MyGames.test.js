import {
  render,
  screen,
  fireEvent,
  getByText,
  waitFor,
  renderHook,
  act,
} from "@testing-library/react-native";
import MyGames from "../../../src/components/MyGames";
import { TamaguiProvider } from "tamagui";
import appConfig from "../../../tamagui.config";
import "@testing-library/jest-dom";

describe("MyGames", () => {
  test("renders MyGames component without crashing", async () => {
    const navigation = {}; // Mock navigation object
    const { root } = render(
      <TamaguiProvider config={appConfig}>
        <MyGames navigation={navigation} />
      </TamaguiProvider>,
    );
    await waitFor(() => {
      expect(root).toBeTruthy();
    });
  });

  jest.mock("../../../src/hooks/use-query-games", () => ({
    __esModule: true,
    default: () => ({
      myGames: [],
      fetchMyGames: jest.fn(),
      fetchAllGames: jest.fn(),
    }),
  }));

  test("toggles between My Games and Joined Games tabs", async () => {
    const navigation = {}; // Mock navigation object
    const { root } = render(
      <TamaguiProvider config={appConfig}>
        <MyGames navigation={navigation} />
      </TamaguiProvider>,
    );

    const joinedGamesTab = screen.getByTestId("joined-games"); //getByText("Joined Games");
    const myGamesTab = screen.getByTestId("my-games"); //getByText("Joined Games");

    act(() => {
      fireEvent.press(joinedGamesTab);
      fireEvent.press(myGamesTab);
    });
  });

  jest.mock("../../../src/components/game/MyGames", () => ({
    __esModule: true,
    default: () => ({
      refreshing: true,
    }),
  }));

  test("Spinner displays properly on refresh", () => {
    const navigation = {}; // Mock navigation object
    const { root } = render(
      <TamaguiProvider config={appConfig}>
        <MyGames navigation={navigation} />
      </TamaguiProvider>,
    );
    const spinner = screen.getByTestId("spinner");
    expect(spinner).toBeTruthy();
  });
});
