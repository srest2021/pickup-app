import {
  render,
  fireEvent,
  waitFor,
  screen,
  act,
} from "@testing-library/react-native";
import AddGame from "../../../src/components/game/AddGame";
import { TamaguiProvider } from "tamagui";
import appConfig from "../../../tamagui.config";
import "@testing-library/jest-dom";
import { ToastProvider } from "@tamagui/toast";

jest.mock("../../../src/lib/store", () => ({
  useStore: jest.fn(() => [false, { user: { id: "mockUserId" } }]),
}));
// Mock useMutationGame hook
jest.mock("../../../src/hooks/use-mutation-game", () => () => ({
  createGame: jest.fn(),
}));

describe("AddGame", () => {
  it("Should render component successfully", () => {
    const navigation = { navigate: jest.fn() };

    const { root } = render(
      <TamaguiProvider config={appConfig}>
        <ToastProvider>
          <AddGame navigation={navigation} />
        </ToastProvider>
      </TamaguiProvider>,
    );

    // Check form elements are rendered.
    const titleInput = screen.getByTestId("titleInput");
    expect(titleInput).toBeTruthy();

    const datePicker = screen.getByTestId("dateInput");
    expect(datePicker).toBeTruthy();

    const timePicker = screen.getByTestId("timeInput");
    expect(timePicker).toBeTruthy();

    const addressInput = screen.getByTestId("addressInput");
    expect(addressInput).toBeTruthy();

    const cityInput = screen.getByTestId("cityInput");
    expect(cityInput).toBeTruthy();

    const stateInput = screen.getByTestId("stateInput");
    expect(stateInput).toBeTruthy();

    const zipInput = screen.getByTestId("zipInput");
    expect(zipInput).toBeTruthy();

    const skillInput = screen.getByTestId("skillInput");
    expect(skillInput).toBeTruthy();

    const maxPlayerInput = screen.getByTestId("maxPlayerInput");
    expect(maxPlayerInput).toBeTruthy();

    const descriptionInput = screen.getByTestId("descriptionInput");
    expect(descriptionInput).toBeTruthy();

    const publishButton = screen.getByTestId("addGameButton");
    expect(publishButton).toBeTruthy();

    expect(root).toBeTruthy();
  });
});

describe("AddGame", () => {
  it("should create a new game and navigate to 'MyGames' when 'Publish' button is pressed", async () => {
    const navigation = { navigate: jest.fn() };

    const { root } = render(
      <TamaguiProvider config={appConfig}>
        <ToastProvider>
          <AddGame navigation={navigation} />
        </ToastProvider>
      </TamaguiProvider>,
    );

    // Simulate user input changes
    fireEvent.changeText(screen.getByTestId("titleInput"), "New Game Title");
    fireEvent.changeText(screen.getByTestId("dateInput"), new Date());
    fireEvent.changeText(screen.getByTestId("timeInput"), new Date());
    fireEvent.changeText(
      screen.getByTestId("addressInput"),
      "3339 North Charles Street",
    );
    fireEvent.changeText(screen.getByTestId("cityInput"), "Baltimore");
    fireEvent.changeText(screen.getByTestId("stateInput"), "MD");
    fireEvent.changeText(screen.getByTestId("zipInput"), "21218");
    // Simulate changing the value of the Select component
    fireEvent(screen.getByTestId("sportInput"), "onValueChange", "basketball");
    // Simulate changing the value of the RadioGroup component
    fireEvent(screen.getByTestId("skillInput"), "onValueChange", "1");
    fireEvent.changeText(screen.getByTestId("maxPlayerInput"), "10");
    fireEvent.changeText(
      screen.getByTestId("descriptionInput"),
      "Test Description",
    );

    // Simulate button press to create a new game
    act(() => {
      fireEvent.press(screen.getByTestId("addGameButton"));
    });

    // Wait for the createGame function to be called
    await waitFor(() => () => {
      expect(createGame).toHaveBeenCalledWith(
        "New Game Title",
        expect.any(Date),
        "3339 North Charles Street",
        "Baltimore",
        "MD",
        "21218",
        "basketball",
        1,
        "10",
        "Test Description",
      );

      // Ensure navigation to 'MyGames' is triggered after creating the game
      expect(navigation.navigate).toHaveBeenCalledWith("MyGames");
    });
  });
});
