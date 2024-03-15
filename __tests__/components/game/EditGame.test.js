import {
  render,
  fireEvent,
  waitFor,
  screen,
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
  skillLevel: "Beginner",
};

const mockAddress = {
  street: "3339 North Charles St",
    city: "Baltimore",
    state: "MD",
    zip: "21218",
}

const mockSelectedMyGame = {
  id: "gameId",
  organizerId: "organizerId",
  title: "Test Title",
  datetime: new Date(
    "Sun Mar 13 2025 15:42:33 GMT+0000 (Coordinated Universal Time)",
  ),
  address: mockAddress,
  sport: mockSport,
  maxPlayers: 20,
  currentPlayers: 1,
  isPublic: true,
  distanceAway: 1,
  description: "Test Description",
};

// Mock Selected Game in Store
jest.mock("../../../src/lib/store", () => ({
  useStore: jest.fn(() => [
    {
      selectedMyGame: mockSelectedMyGame,
      loading: false,
    },
    jest.fn(),
  ]),
}));

describe("EditGame", () => {
  it("Should render component successfully", () => {
    const navigation = { goBack: jest.fn() };
    const route = { params: { gameId: "gameId" } };

    const { root } = render(
      <TamaguiProvider config={appConfig}>
        <ToastProvider>
          <EditGame navigation={navigation} route={route} />
        </ToastProvider>
      </TamaguiProvider>,
    );

    // Check form elements are rendered.
    const titleInput = screen.getByTestId("titleInput");
    expect(titleInput).toBeTruthy();

    const datePicker = screen.getByTestId("datePicker");
    expect(datePicker).toBeTruthy();

    const timePicker = screen.getByTestId("timePicker");
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

    const editButton = screen.getByTestId("editButton");
    expect(editButton).toBeTruthy();

    expect(root).toBeTruthy();
  });

  describe("EditGame", () => {
    it('should call editGameById with updated title attribute and navigate back when "Edit" button is pressed', async () => {
      const navigation = { goBack: jest.fn() };
      const route = { params: { gameId: "gameId" } };

      const { root } = render(
        <TamaguiProvider config={appConfig}>
          <ToastProvider>
            <EditGame navigation={navigation} route={route} />
          </ToastProvider>
        </TamaguiProvider>,
      );

      // getByTestId to select the input field
      fireEvent.changeText(screen.getByTestId("titleInput"), "New Title");
      const editButton = screen.getByTestId("editButton");
      fireEvent.press(editButton);

      await waitFor(() => {
        expect(mockEditGameById).toHaveBeenCalledWith(
          "gameId",
          "New Title", // only updating title
          expect.any(Date),
          mockSelectedMyGame.address.street,
          mockSelectedMyGame.address.city,
          mockSelectedMyGame.address.state,
          mockSelectedMyGame.address.zip,
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
