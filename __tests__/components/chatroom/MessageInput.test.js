import { render, fireEvent } from "@testing-library/react-native";
import MessageInput from "../../../src/components/chatroom/MessageInput";
import { TamaguiProvider } from "tamagui";
import appConfig from "../../../tamagui.config";

// mock useMutationMessages
const mockAddChatroomMessage = jest.fn();
jest.mock("../../../src/hooks/use-mutation-messages", () => () => ({
  addChatroomMessage: mockAddChatroomMessage,
}));

describe("MessageInput", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders correctly", () => {
    const { root } = render(
      <TamaguiProvider config={appConfig}>
        <MessageInput />
      </TamaguiProvider>,
    );
    expect(root).toBeTruthy();
  });

  it("calls sendMessage function on send", async () => {
    const { getByPlaceholderText, getByTestId } = render(
      <TamaguiProvider config={appConfig}>
        <MessageInput />
      </TamaguiProvider>,
    );
    const input = getByPlaceholderText("Enter your message");
    const button = getByTestId("send-button");

    fireEvent.changeText(input, "Test message");
    fireEvent.press(button);

    expect(mockAddChatroomMessage).toHaveBeenCalledWith("Test message");
  });

  it("clears message input after send", async () => {
    const { getByPlaceholderText, getByTestId } = render(
      <TamaguiProvider config={appConfig}>
        <MessageInput />
      </TamaguiProvider>,
    );
    const input = getByPlaceholderText("Enter your message");
    const button = getByTestId("send-button");

    fireEvent.changeText(input, "Test message");
    fireEvent.press(button);
    await waitFor(() => () => {
      expect(input.props.value).toEqual("");
    });
  });
});
