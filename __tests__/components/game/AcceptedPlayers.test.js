import {
    render,
    screen,
    fireEvent,
    getByText,
    waitFor,
    renderHook,
    act,
  } from "@testing-library/react-native";
import NonAcceptedPlayer from "../../../src/components/game/NonAcceptedPlayers";
import AcceptedPlayer from "../../../src/components/game/AcceptedPlayer";
import { Alert } from "react-native";
  

describe("Accepted/NonAccepted Player",()=>{

    jest.mock("../../../src/hooks/use-mutation-game", () => ({
        __esModule: true,
        default: () => ({
          removePlayerById: jest.fn(),
          acceptJoinRequestById: jest.fn(),
          rejectJoinRequestById: jest.fn()
        }),
      }));

    test('renders Accepted player button and username', async()=>{
        const user = { id: '1', username: 'TestUser' };
        const gameId = 'gameId';
        const { getByText, getByTestId } = render(<AcceptedPlayer user={user} gameId={gameId} />);

        const usernameElement = getByText('TestUser');
        expect(usernameElement).toBeTruthy();

        const removeButton = getByTestId('remove-button');
        expect(removeButton).toBeTruthy();

        act(async ()=>{
            fireEvent.press(removeButton);
            await waitFor(() => {
                expect(removeUserById).toHaveBeenCalled();
              });
        });

    test('renders non-Accepted player button and username',async()=>{
        const user = { id: '1', username: 'TestUser' };
        const gameId = 'gameId';
        const maxPlayers = 4;
        const currentPlayers = 2;
        const { getByText, getByTestId } = render(<NonAcceptedPlayer user={user} gameId={gameId} maxPlayers={maxPlayers} currentPlayers={currentPlayers} />);

        const usernameElement = getByText('TestUser');
        expect(usernameElement).toBeTruthy();

        const rejectButton = getByTestId('reject-button');
        expect(rejectButton).toBeTruthy();

        const acceptButton = getByTestId('accept-button');
        expect(acceptButton).toBeTruthy();
    }
    );

    test('reject button calls correct function', async()=>{
        const user = { id: '1', username: 'TestUser' };
        const gameId = 'gameId';
        const maxPlayers = 4;
        const currentPlayers = 2;
        const { getByText, getByTestId } = render(<NonAcceptedPlayer 
            user={user} gameId={gameId} 
            maxPlayers={maxPlayers} 
            currentPlayers={currentPlayers} />);
        const rejectButton = getByTestId('reject-button');
        act(async ()=>{
            fireEvent.press(rejectButton);
            await waitFor(() => {
                expect(rejectJoinRequestById).toHaveBeenCalled();
              });
        });

    });

    test("accept button won't accept past limit", async() => {
        const user = { id: '1', username: 'TestUser' };
        const gameId = 'gameId';
        const maxPlayers = 4;
        const currentPlayers = 4;
        const { getByTestId } = render(<NonAcceptedPlayer 
            user={user} gameId={gameId} 
            maxPlayers={maxPlayers} 
            currentPlayers={currentPlayers} />);
        const acceptButton = getByTestId('accept-button');
        jest.spyOn(Alert, 'alert').mockImplementation();
        act(async ()=>{
            fireEvent.press(acceptButton);
            await waitFor(() => {
                expect(Alert.alert).toHaveBeenCalledWith("This game is already full!");
                });
        });
    });

    test("can accept a player if game is below limit", async()=>{
        const user = { id: '1', username: 'TestUser' };
        const gameId = 'gameId';
        const maxPlayers = 4;
        const currentPlayers = 1;
        const { getByTestId } = render(<NonAcceptedPlayer 
            user={user} gameId={gameId} 
            maxPlayers={maxPlayers} 
            currentPlayers={currentPlayers} />);
        const acceptButton = getByTestId('accept-button');
        act(async ()=>{
            fireEvent.press(acceptButton);
            await waitFor(() => {
                expect(acceptJoinRequestById).toHaveBeenCalled();
                });
        });
    });

    });
})