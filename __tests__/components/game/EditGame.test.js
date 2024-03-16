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

// mock selected game
const mockAddress = { street: "Homewood", city: "Baltimore", state: "MD", zip: "21218" };
const mockSport = { name: "basketball", skillLevel: "Beginner" };
const mockSelectedMyGame = {
  id: "testid",
  title: "Test Title",
  datetime: new Date(),
  address: mockAddress,
  sport: mockSport,
  maxPlayers: 20,
  description: "Test Description",
  isPublic: true
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
  useStore: jest.fn(() => [false, { selectedMyGame: mockSelectedMyGame } ]),
}));

// mock useMutationGame hook
const mockEditGameById = jest.fn();
jest.mock("../../../src/hooks/use-mutation-game", () => () => ({
  //editGameById: mockEditGameById,
  default: jest.fn(() => ({
    editGameById: mockEditGameById,
  })),
}));

describe("EditGame", () => {
  test("Should render component successfully", () => {
    const navigation = { goBack: jest.fn() };
    const route = { params: { gameId: "testid" } };

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
});

describe("EditGame", () => {
  test('should call editGameById with updated title attribute and navigate back when "Edit" button is pressed', async () => {
    const navigation = { goBack: jest.fn() };
    const route = { params: { gameId: "testid" } };

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
        "testid",
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