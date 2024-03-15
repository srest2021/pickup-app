import {
    render,
    screen,
    fireEvent,
    getByText,
    waitFor,
    renderHook,
    act,
  } from "@testing-library/react-native";
  import MyGames from "../../../src/components/MyGames";
  import { TamaguiProvider } from "tamagui";
  import appConfig from "../../../tamagui.config";
  import "@testing-library/jest-dom";
import GamePlayers from "../../../src/components/game/GamePlayers";

  describe("JoinRequests", () => {
    jest.mock("../../../src/lib/store", () => ({
      useStore: jest.fn(() => [
        {loading: false,
          session:{userId:'mockUserId1'},
        user: { id: "mockUserId1" }, 
        selectedMyGame: {
        id: 'game_1',
      organizerId: 'user_1',
      title: 'test_game',
      description: 'T',
      datetime: new Date(),
      sport: {name:'soccer',skillLevel:1},
      maxPlayers: 4,
      currentPlayers: 2,
      isPublic: true,
      distanceAway: 5,
      address: null,
      acceptedPlayers: [
        { id: 'user_1', username: 'Player 1' },
        { id: 'user_2', username: 'Player 2' },
      ],
      joinRequests: [
        { id: 'user_3', name: 'Player 3' },
        { id: 'user_4', name: 'Player 4' },
      ],
      }
    },
    ]),
    }));
    test('renders accepted players correctly', ()=> {
      const navigation = {};
      const { root } = render(
        <TamaguiProvider config={appConfig}>
          <ToastProvider>
            <GamePlayers navigation={navigation}/>
          </ToastProvider>
        </TamaguiProvider>,
      );

      const acceptedPlayersHeader = screen.getByText(/Accepted Players/i);
      expect(acceptedPlayersHeader).toBeInTheDocument();

      const player1 = screen.getByText(/Player 1/i);
      expect(player1).toBeInTheDocument();

      const player2 = screen.getByText(/Player 2/i);
      expect(player2).toBeInTheDocument();

      const playerCount = screen.getByText(/2\/4/i);
      expect(playerCount).toBeInTheDocument();
    }); 

    test('render join request correctly', ()=>{
      const navigation = {};
      const { root } = render(
        <TamaguiProvider config={appConfig}>
          <ToastProvider>
            <GamePlayers navigation={navigation}/>
          </ToastProvider>
        </TamaguiProvider>,
      );
      const joinRequestsHeader = screen.getByText(/Join Requests/i);
      expect(joinRequestsHeader).toBeInTheDocument();

      const player3 = screen.getByText(/Player 3/i);
      expect(player3).toBeInTheDocument();

      const player4 = screen.getByText(/Player 4/i);
      expect(player4).toBeInTheDocument();
    });
  });