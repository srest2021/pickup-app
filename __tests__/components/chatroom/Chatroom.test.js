import { render } from "@testing-library/react-native";
import Chatroom from "../../../src/components/chatroom/Chatroom";
import { TamaguiProvider } from "tamagui";
import appConfig from "../../../tamagui.config";

// mock user
const mockUser = {
  id: "testid",
  username: "testusername",
  displayName: "test display name",
  bio: "test bio",
  avatarUrl: "test avatar url",
  sports: [],
};

// mock session with user object
const mockSession = {
  access_token: "access_token_test_string",
  refresh_token: "refresh_token_test_string",
  expires_in: 90000000,
  token_type: "token_type_test",
  user: mockUser,
};

// mock store
export const mockUseStore = jest.fn(() => {
  return {
    session: mockSession,
    user: mockUser,
    roomCode: "testcode",
    clearMessages: jest.fn(),
  };
});

jest.mock("../../../src/lib/store", () => ({
  useStore: mockUseStore,
}));

describe("Chatroom component", () => {
  it("renders correctly", () => {
    const { root } = render(
      <TamaguiProvider config={appConfig}>
        <Chatroom navigation={{}} />
      </TamaguiProvider>,
    );
    expect(root).toBeTruthy();
  });

  it("calls clearMessages function on roomCode change", () => {
    const { rerender } = render(<Chatroom navigation={{}} />);
    rerender(<Chatroom navigation={{}} />);
    expect(mockUseStore().clearMessages).toHaveBeenCalledTimes(1); // Ensure clearMessages function is called again
  });
});
