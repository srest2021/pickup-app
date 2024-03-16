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
import { TamaguiProvider } from "tamagui";
import appConfig from "../../../tamagui.config";

describe("Accepted/NonAccepted Player", () => {
  jest.mock("../../../src/hooks/use-mutation-game", () => ({
    removePlayerById: jest.fn(),
    acceptJoinRequestById: jest.fn(),
    rejectJoinRequestById: jest.fn(),
  }));

  test("renders Accepted player button and username", async () => {
    const user = { id: "1", username: "TestUser" };
    const gameId = "gameId";
    const { getByText, getByTestId } = render(
      <TamaguiProvider config={appConfig}>
        <AcceptedPlayer user={user} gameId={gameId} isOrganizer={true} />
      </TamaguiProvider>,
    );

    const usernameElement = getByText("@TestUser");
    expect(usernameElement).toBeTruthy();

    const removeButton = await getByTestId("remove-button");
    expect(removeButton).toBeTruthy();

    act(async () => {
      fireEvent.press(removeButton);
      await waitFor(() => {
        expect(removePlayerById).toHaveBeenCalled();
      });
    });
  });

  test("renders non-Accepted player button and username", async () => {
    const user = { id: "1", username: "TestUser" };
    const gameId = "gameId";
    const maxPlayers = 4;
    const currentPlayers = 2;
    const { getByText, getByTestId } = render(
      <NonAcceptedPlayer
        user={user}
        gameId={gameId}
        maxPlayers={maxPlayers}
        currentPlayers={currentPlayers}
      />,
    );

    const usernameElement = getByText("@TestUser");
    expect(usernameElement).toBeTruthy();

    const rejectButton = await getByTestId("reject-button");
    expect(rejectButton).toBeTruthy();

    const acceptButton = await getByTestId("accept-button");
    expect(acceptButton).toBeTruthy();
  });

  test("reject button calls correct function", async () => {
    const user = { id: "1", username: "TestUser" };
    const gameId = "gameId";
    const maxPlayers = 4;
    const currentPlayers = 2;
    const { getByTestId } = render(
      <NonAcceptedPlayer
        user={user}
        gameId={gameId}
        maxPlayers={maxPlayers}
        currentPlayers={currentPlayers}
      />,
    );
    const rejectButton = await getByTestId("reject-button");
    act(async () => {
      fireEvent.press(rejectButton);
      await waitFor(() => {
        expect(rejectJoinRequestById).toHaveBeenCalled();
      });
    });
  });

  test("accept button won't accept past limit", async () => {
    const user = { id: "1", username: "TestUser" };
    const gameId = "gameId";
    const maxPlayers = 4;
    const currentPlayers = 4;
    const { getByTestId } = render(
      <NonAcceptedPlayer
        user={user}
        gameId={gameId}
        maxPlayers={maxPlayers}
        currentPlayers={currentPlayers}
      />,
    );
    const acceptButton = await getByTestId("accept-button");
    jest.spyOn(Alert, "alert").mockImplementation();
    act(async () => {
      fireEvent.press(acceptButton);
      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith("This game is already full!");
      });
    });
  });

  test("can accept a player if game is below limit", async () => {
    const user = { id: "1", username: "TestUser" };
    const gameId = "gameId";
    const maxPlayers = 4;
    const currentPlayers = 1;
    const { getByTestId } = render(
      <NonAcceptedPlayer
        user={user}
        gameId={gameId}
        maxPlayers={maxPlayers}
        currentPlayers={currentPlayers}
      />,
    );
    const acceptButton = await getByTestId("accept-button");
    act(async () => {
      fireEvent.press(acceptButton);
      await waitFor(() => {
        expect(acceptJoinRequestById).toHaveBeenCalled();
      });
    });
  });
});
