import {
  render,
  fireEvent,
  waitFor,
  screen,
} from "@testing-library/react-native";
import AddGame from "../../../src/components/game/AddGame";
import { TamaguiProvider } from "tamagui";
import appConfig from "../../../tamagui.config";
import "@testing-library/jest-dom";
import { ToastProvider } from "@tamagui/toast";

// mock user
const mockUser = {
  id: "testid",
  username: "testusername",
  displayName: "test display name",
  bio: "test bio",
  avatarUrl: "test avatar url",
  sports: []
};

// mock session with user object
const mockSession = {
  access_token: "access_token_test_string",
  refresh_token: "refresh_token_test_string",
  expires_in: 90000000,
  token_type: "token_type_test",
  user: mockUser
};

// mock useMutationUser hook
jest.mock('../../../src/hooks/use-mutation-user', () => ({
  __esModule: true, 
  default: jest.fn(() => ({
    session: mockSession,
    setSession: jest.fn(),
    user: mockUser,
  })),
}));

// mock store
jest.mock("../../../src/lib/store", () => ({
  useStore: jest.fn(() => [false, { user: { id: "testid" } }]),
}));

// mock useMutationGame hook
const mockCreateGameById = jest.fn();
jest.mock("../../../src/hooks/use-mutation-game", () => () => ({
  createGame: mockCreateGameById,
}));

describe("AddGame", () => {
  test("Should render component successfully", () => {
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

    const visibilitySwitch = screen.getByTestId("visibilityInput");
    expect(visibilitySwitch).toBeTruthy();

    const streetInput = screen.getByTestId("streetInput");
    expect(streetInput).toBeTruthy();

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
  test("should create a new game and navigate to 'MyGames' when 'Publish' button is pressed", async () => {
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
    //fireEvent(screen.getByTestId("visibilityInput"), "onCheckedChange", true);
    fireEvent.changeText(screen.getByTestId("streetInput"),"Homewood");
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
    const publishButton = screen.getByTestId("addGameButton");
    fireEvent.press(publishButton);

    // Wait for the createGame function to be called
    await waitFor(() => () => {
      expect(createGame).toHaveBeenCalledWith(
        "New Game Title",
        expect.any(Date),
        "Homewood",
        "Baltimore",
        "MD",
        "21218",
        "basketball",
        1,
        "10",
        "Test Description",
        true
      );

      // Ensure navigation to 'MyGames' is triggered after creating the game
      expect(navigation.navigate).toHaveBeenCalledWith("MyGames");
    });
  });
});
