import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import AddGame from "../../../src/components/game/AddGame";
import { TamaguiProvider } from "tamagui";
import appConfig from "../../../tamagui.config";


jest.mock("../../../src/lib/store", () => ({
    useStore: jest.fn(() => [false, { user: { id: "mockUserId" } }]),
  }));
// Mock useMutationGame hook
jest.mock("../../../src/hooks/use-mutation-game", () => () => ({
  createGame: jest.fn(),
}));

describe("AddGame", () => {
  it("should create a new game and navigate to 'MyGames' when 'Publish' button is pressed", async () => {
    const navigation = { navigate: jest.fn() };

    const { getByPlaceholderText, getByText } = render(
      <TamaguiProvider config={appConfig}>
        <AddGame navigation={navigation} />
      </TamaguiProvider>
    );

    // Simulate user input changes
    fireEvent.changeText(getByPlaceholderText("Title"), "New Game Title");
    //fireEvent.changeText(getByPlaceholderText("Time"), "Sun Mar 13 2025 15:42:33 GMT+0000 (Coordinated Universal Time)");
    fireEvent.changeText(getByPlaceholderText("Address"), "3339 North Charles Street");
    fireEvent.changeText(getByPlaceholderText("City"), "Baltimore");
    fireEvent.changeText(getByPlaceholderText("State"), "MD");
    fireEvent.changeText(getByPlaceholderText("ZIP code"), "21218");

    // Simulate other required user inputs

    // Simulate button press to create a new game
    fireEvent.press(getByText("Publish"));

    // Wait for the createGame function to be called
    await waitFor(() => () => {
      expect(createGame).toHaveBeenCalledWith(
        "New Game Title", // Ensure that the correct title is passed
        expect.any(Date),
        "3339 North Charles Street",
        "Baltimore",
        "MD",
        "21218"

        // Add more arguments as needed
      );
      // Ensure navigation to 'MyGames' is triggered after creating the game
      expect(navigation.navigate).toHaveBeenCalledWith("MyGames");
    });

    
  });
});
