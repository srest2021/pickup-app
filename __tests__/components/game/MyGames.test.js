import {
    render,
    screen,
    fireEvent,
    getByText,
  } from "@testing-library/react-native";
import GameThumbnail from "../../../src/components/game/GameThumbnail";
import MyGames from "../../../src/components/game/MyGames";
import { TamaguiProvider } from "tamagui";
import appConfig from "../../../tamagui.config";
import '@testing-library/jest-dom'

  // describe("MyGames", ()=>{
  //   test('renders MyGames component without crashing', () => {
  //       const navigation = {}; // Mock navigation object
  //       render(<MyGames navigation={navigation} />);
  //     });
      
  //     jest.mock("../../../src/hooks/use-query-games", () => ({
  //       __esModule: true,
  //       default: () => ({
  //         myGames: [],
  //         fetchMyGames: jest.fn(),
  //         fetchAllGames: jest.fn(),
  //       }),
  //     }));

  //     test('toggles between My Games and Joined Games tabs', () => {
  //       const navigation = {}; // Mock navigation object
  //       const { getByText } = render(<MyGames navigation={navigation} />);
        
  //       const joinedGamesTab = getByText('Joined Games');
  //       fireEvent.press(joinedGamesTab);

  //       const myGamesTab = getByText('My Games');
  //       fireEvent.press(myGamesTab);
  //       expect(fetchMyGames).toHaveBeenCalled();
        
  //     });

  //     jest.mock("../../../src/components/game/MyGames", () => ({
  //       __esModule: true,
  //       default: () => ({
  //         refreshing: true
  //       }),
  //     }));

  //     test('Spinner displays properly on refresh', () => {
  //       const navigation = {}; // Mock navigation object
  //       const { getByTestId } = render(<MyGames navigation={navigation} />);
  //       const spinner = getByTestId('spinner');
  //       expect(spinner).toBeTruthy();
  //     });

  // });
