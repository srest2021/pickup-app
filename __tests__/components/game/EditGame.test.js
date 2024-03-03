import {
    render,
    fireEvent,
    waitFor,
  } from "@testing-library/react-native";
import EditGame from "../../../src/components/game/EditGame";
import { TamaguiProvider } from "tamagui";
import appConfig from "../../../tamagui.config";
import "@testing-library/jest-dom";
import { ToastProvider } from "@tamagui/toast";

// Mock dependencies
jest.mock("../../../src/hooks/use-mutation-user", () => () => ({
  user: {}, // Mock user object as needed for the test
}));
const mockEditGameById = jest.fn();
jest.mock("../../../src/hooks/use-mutation-game", () => () => ({
  editGameById: mockEditGameById,
}));

const mockSport = {
  name: "Basketball",
  skillLevel: "Beginner"
}

const mockSelectedMyGame = {
  id: "gameId",
  title: "Test Title",
  datetime: new Date("Sun Mar 13 2025 15:42:33 GMT+0000 (Coordinated Universal Time)"),
  address: "3339 North Charles St",
  city: "Baltimore",
  state: "MD",
  zip: "21218",
  sport: mockSport,
  maxPlayers: 20,
  description: "Test Description",
};

// Mock Selected Game in Store
jest.mock('../../../src/lib/store', () => ({
  useStore: jest.fn(() => [{
     selectedMyGame: mockSelectedMyGame,
     loading: false, 
    }, jest.fn()]),
}));


describe("EditGame", () => {
  it("Should render component successfully", () => {
    const navigation = { goBack: jest.fn() };
    const route = { params: { gameId: "gameId" } };

    const { root, getByTestId } = render(
        <TamaguiProvider config={appConfig}>
          <ToastProvider>
          <EditGame navigation={navigation} route={route} />
          </ToastProvider>
        </TamaguiProvider>,
      );

    // Check form elements are rendered.  
    const titleInput = getByTestId("titleInput");
    expect(titleInput).toBeTruthy();

    const datePicker = getByTestId("datePicker");
    expect(datePicker).toBeTruthy();

    const timePicker = getByTestId("timePicker");
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
    
    const editButton = getByTestId("editButton");
    expect(editButton).toBeTruthy();

    expect(root).toBeTruthy();
  });



describe('EditGame', () => {
  it('should call editGameById with updated title attribute and navigate back when "Edit" button is pressed', async () => {
    const navigation = { goBack: jest.fn() };
    const route = { params: { gameId: "gameId" } };

    const { getByTestId } = render(
      <TamaguiProvider config={appConfig}>
        <ToastProvider>
        <EditGame navigation={navigation} route={route} />
        </ToastProvider>
      </TamaguiProvider>
    );
  
    // getByTestId to select the input field
    fireEvent.changeText(getByTestId("titleInput"), "New Title");
    const editButton = getByTestId("editButton");
    fireEvent.press(editButton);
  
    await waitFor(() => {
      expect(mockEditGameById).toHaveBeenCalledWith(
        "gameId",
        "New Title", // only updating title
        expect.any(Date),
        mockSelectedMyGame.address,
        mockSelectedMyGame.city,
        mockSelectedMyGame.state,
        mockSelectedMyGame.zip,
        mockSelectedMyGame.sport.name,
        expect.any(Number), 
        mockSelectedMyGame.maxPlayers.toString(),
        mockSelectedMyGame.description,
      );
    });
  
    expect(navigation.goBack).toHaveBeenCalled();
  });
});

});

