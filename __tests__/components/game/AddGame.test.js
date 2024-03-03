import { render, fireEvent, waitFor } from "@testing-library/react-native";
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

    const { getByTestId } = render(
      <TamaguiProvider config={appConfig}>
        <ToastProvider>
        <AddGame navigation={navigation} />
        </ToastProvider>
      </TamaguiProvider>
    );

    // Check form elements are rendered.  
    const titleInput = getByTestId("titleInput");
    expect(titleInput).toBeTruthy();

    const datePicker = getByTestId("dateInput");
    expect(datePicker).toBeTruthy();

    const timePicker = getByTestId("timeInput");
    expect(timePicker).toBeTruthy();

    const addressInput = getByTestId("addressInput");
    expect(addressInput).toBeTruthy();

    const cityInput = getByTestId("cityInput");
    expect(cityInput).toBeTruthy();

    const stateInput = getByTestId("stateInput");
    expect(stateInput).toBeTruthy();

    const zipInput = getByTestId("zipInput");
    expect(zipInput).toBeTruthy();

    const skillInput = getByTestId("skillInput");
    expect(skillInput).toBeTruthy();

    const maxPlayerInput = getByTestId("maxPlayerInput");
    expect(maxPlayerInput).toBeTruthy();

    const descriptionInput = getByTestId("descriptionInput");
    expect(descriptionInput).toBeTruthy();
    
    const publishButton = getByTestId("addGameButton");
    expect(publishButton).toBeTruthy();

    expect(root).toBeTruthy();
  });

describe("AddGame", () => {
  it("should create a new game and navigate to 'MyGames' when 'Publish' button is pressed", async () => {
    const navigation = { navigate: jest.fn() };

    const { getByTestId } = render(
      <TamaguiProvider config={appConfig}>
        <ToastProvider>
        <AddGame navigation={navigation} />
        </ToastProvider>
      </TamaguiProvider>
    );

    // Simulate user input changes
    fireEvent.changeText(getByTestId("titleInput"), "New Game Title");
    fireEvent.changeText(getByTestId("dateInput"), new Date());
    fireEvent.changeText(getByTestId("timeInput"), new Date());
    fireEvent.changeText(getByTestId("addressInput"), "3339 North Charles Street");
    fireEvent.changeText(getByTestId("cityInput"), "Baltimore");
    fireEvent.changeText(getByTestId("stateInput"), "MD");
    fireEvent.changeText(getByTestId("zipInput"), "21218");
    // Simulate changing the value of the Select component
    fireEvent(getByTestId("sportInput"), 'onValueChange', "Basketball");
    // Simulate changing the value of the RadioGroup component
    fireEvent(getByTestId("skillInput"), 'onValueChange', "1");
    fireEvent.changeText(getByTestId("maxPlayerInput"), "10");
    fireEvent.changeText(getByTestId("descriptionInput"), "Test Description");


    // Simulate button press to create a new game
    fireEvent.press(getByTestId("addGameButton"));

    // Wait for the createGame function to be called
    await waitFor(() => () => {
      expect(createGame).toHaveBeenCalledWith(
        "New Game Title",
        expect.any(Date),
        "3339 North Charles Street",
        "Baltimore",
        "MD",
        "21218",
        "Basketball",
        1,
        "10",
        "Test Description"
      );

      // Ensure navigation to 'MyGames' is triggered after creating the game
      expect(navigation.navigate).toHaveBeenCalledWith("MyGames");
    });

    
  });
});
