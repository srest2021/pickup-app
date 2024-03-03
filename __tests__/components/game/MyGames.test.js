import {
  render,
  screen,
  fireEvent,
  getByText,
  waitFor,
} from "@testing-library/react-native";
import MyGames from "../../../src/components/game/MyGames";
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

  test("toggles between My Games and Joined Games tabs", () => {
    const navigation = {}; // Mock navigation object
    const { getByText } = render(<MyGames navigation={navigation} />);

    const joinedGamesTab = getByText("Joined Games");

    console.log(joinedGamesTab);
    fireEvent.press(joinedGamesTab);

    const myGamesTab = getByText("Joined Games");
    fireEvent.press(myGamesTab);
    expect(fetchMyGames).toHaveBeenCalled();
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
