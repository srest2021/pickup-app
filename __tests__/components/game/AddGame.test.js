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
import { User } from "../../../src/lib/types";
import { Alert } from "react-native";
import { useStore } from "../../../src/lib/store";
jest.useFakeTimers();
// mock user

const user = {
  id: "testid",
  username: "testusername",
  displayName: "test display name",
  bio: "test bio",
  avatarUrl: "test avatar url",
  sports: [],
};

// mock session with user object
const session = {
  access_token: "access_token_test_string",
  refresh_token: "refresh_token_test_string",
  expires_in: 90000000,
  token_type: "token_type_test",
  user: {
    id: "testid",
    username: "testusername",
    displayName: "test display name",
    bio: "test bio",
    avatarUrl: "test avatar url",
    sports: [],
  },
};


/*
  // mock useMutationUser hook
    jest.mock("../../../src/hooks/use-mutation-user", () => ({
      __esModule: true,
      default: jest.fn(() => ({
        session: session,
        setSession: jest.fn(),
        user: user,
      })),
    }));
    */
  
    // mock store
  
    jest.mock("../../../src/lib/store", () => ({
      
      useStore: jest.fn(() => [false, null, {
        access_token: "access_token_test_string",
        refresh_token: "refresh_token_test_string",
        expires_in: 90000000,
        token_type: "token_type_test",
        user: {
          id: "testid",
          username: "testusername",
          displayName: "test display name",
          bio: "test bio",
          avatarUrl: "test avatar url",
          sports: [],
          }}]),
      //useStore: jest.fn(() => [false, {session},
      //   []]),
      //InitialState: [false, { user: { id: "testid"}},  session],
      //State: [false, { user: { id: "testid"}},  session],
      
      
    }));
  
  /*
    // mock useMutationGame hook
    const mockCreateGameById = jest.fn();
    jest.mock("../../../src/hooks/use-mutation-game", () => () => ({
      createGame: mockCreateGameById,
    }));
    */



describe("AddGame", () => {
  
  test("Should render component successfully", async () => {
  
    
    const navigation = { navigate: jest.fn() };
    //console.log(useStore());
    console.log(useStore()[1]); // This logs the second element of the array returned by useStore
    //console.log(useStore()[2].user); // Access session.user directly from the third element of the array returned by useStore
    console.log(session);
    console.log(user);
    
    const { root } = render(
      <TamaguiProvider config={appConfig}>
        <AddGame navigation={navigation} />
      </TamaguiProvider>,
    );
    
  
    
    await act(async () => {
    // Check form elements are rendered.
    //let titleInput;
    const titleInput = screen.getByTestId("titleInput");
    //console.log(titleInput);
 

    
    const datePicker = screen.getByTestId("dateInput");
    const timePicker = screen.getByTestId("timeInput");
    const visibilitySwitch = screen.getByTestId("visibilityInput");
    const streetInput = screen.getByTestId("streetInput");
    const cityInput = screen.getByTestId("cityInput");
    const stateInput = screen.getByTestId("stateInput");
    const zipInput = screen.getByTestId("zipInput");
    const skillInput = screen.getByTestId("skillInput");
    const maxPlayerInput = screen.getByTestId("maxPlayerInput");
    const descriptionInput = screen.getByTestId("descriptionInput");
    const publishButton = screen.getByTestId("addGameButton");
    








    //await act(async () => {
      
    //const titleInput = screen.getByTestId("titleInput");
     // expect(titleInput).toBeTruthy();

    //const datePicker = screen.getByTestId("dateInput");
    expect(datePicker).toBeTruthy();

    //const timePicker = screen.getByTestId("timeInput");
    expect(timePicker).toBeTruthy();

    //const visibilitySwitch = screen.getByTestId("visibilityInput");
    expect(visibilitySwitch).toBeTruthy();

    //const streetInput = screen.getByTestId("streetInput");
    expect(streetInput).toBeTruthy();

    //const cityInput = screen.getByTestId("cityInput");
    expect(cityInput).toBeTruthy();

    //const stateInput = screen.getByTestId("stateInput");
    expect(stateInput).toBeTruthy();

    //const zipInput = screen.getByTestId("zipInput");
    expect(zipInput).toBeTruthy();

    //const skillInput = screen.getByTestId("skillInput");
    expect(skillInput).toBeTruthy();

    //const maxPlayerInput = screen.getByTestId("maxPlayerInput");
    expect(maxPlayerInput).toBeTruthy();

    //const descriptionInput = screen.getByTestId("descriptionInput");
    expect(descriptionInput).toBeTruthy();

    //const publishButton = screen.getByTestId("addGameButton");
    expect(publishButton).toBeTruthy();

    expect(root).toBeTruthy();
    
  });
});
    //});
  
});
/*
describe("AddGame", () => {
  test("should create a new game and navigate to 'MyGames' when 'Publish' button is pressed", async () => {
    const navigation = { navigate: jest.fn() };

    const { root } = render(
      <TamaguiProvider config={appConfig}>
        <AddGame navigation={navigation} />
      </TamaguiProvider>,
    );

    // Simulate user input changes
    fireEvent.changeText(screen.getByTestId("titleInput"), "New Game Title");
    fireEvent.changeText(screen.getByTestId("dateInput"), new Date());
    fireEvent.changeText(screen.getByTestId("timeInput"), new Date());
    fireEvent.changeText(screen.getByTestId("streetInput"), "Homewood");
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
        true,
      );

      // Ensure navigation to 'MyGames' is triggered after creating the game
      expect(navigation.navigate).toHaveBeenCalledWith("MyGames");
    });
  });
});

describe("AddGame", () => {
  beforeEach(() => {
    jest.spyOn(Alert, "alert");
  });

  test("should alert the user when not all required fields are filled", async () => {
    const navigation = { navigate: jest.fn() };

    const { root } = render(
      <TamaguiProvider config={appConfig}>
        <AddGame navigation={navigation} />
      </TamaguiProvider>,
    );

    // Simulate user input changes
    //act(() => {
    //fireEvent.changeText(screen.getByTestId("titleInput"), "New Game Title");
    fireEvent.changeText(screen.getByTestId("dateInput"), new Date());
    fireEvent.changeText(screen.getByTestId("timeInput"), new Date());
    fireEvent.changeText(screen.getByTestId("streetInput"), "Homewood");
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
    //});

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        "Please fill out all required fields.",
      );
    });
  });
});
*/

