import {
    render,
    screen,
    fireEvent,
    getByText,
    findByTestId,
    waitFor,
    renderHook,
    act,
  } from "@testing-library/react-native";
  import MyGames from "../../../src/components/MyGames";
  import { TamaguiProvider } from "tamagui";
  import appConfig from "../../../tamagui.config";
  import "@testing-library/jest-dom";
  import { ToastProvider } from "@tamagui/toast";
  import { ToastViewport } from "@tamagui/toast";
import GamePlayers from "../../../src/components/game/GamePlayers";


  describe("GamePlayers", () => {
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
    test('renders accepted players correctly', async ()=> {
      const { findByTestId } = render(
            <TamaguiProvider config={appConfig}>
              <ToastProvider>
            <GamePlayers navigation={1}/>
            </ToastProvider>
            </TamaguiProvider>
      );

      const acceptedPlayersContainer = await findByTestId('accepted-players-container');
      expect(acceptedPlayersContainer).toBeInTheDocument();

      const player1 = await getByText('Player 1');
      expect(player1).toBeInTheDocument();

      const player2 = await getByText('Player 2');
      expect(player2).toBeInTheDocument();

      const playerCount = await getByText('2/4');
      expect(playerCount).toBeInTheDocument();
    }); 

    test('render join request correctly', async ()=>{
      const { getByTestId } = render(
        <TamaguiProvider config={appConfig}>
              <ToastProvider>
            <GamePlayers navigation={1}/>
            </ToastProvider>
        </TamaguiProvider>
      );
      const joinRequestsContainer = await getByTestId('join-requests-container');
      expect(joinRequestsContainer).toBeInTheDocument();

      const player3 = await getByText('Player 3');
      expect(player3).toBeInTheDocument();

      const player4 = await getByText('Player 4');
      expect(player4).toBeInTheDocument();
    });

  });