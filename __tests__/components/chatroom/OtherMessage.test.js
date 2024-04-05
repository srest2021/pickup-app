import { render } from "@testing-library/react-native";
import OtherMessage from "../../../src/components/chatroom/OtherMessage";
import { TamaguiProvider } from "tamagui";
import appConfig from "../../../tamagui.config";

describe("OtherMessage component", () => {
  it("renders message content and sentAt correctly", () => {
    const message = {
      id: "1",
      roomCode: "testcode",
      content: "Test message",
      sentAt: new Date("2024-04-03T12:34:56Z"),
      user: { username: 'testusername'},
    };

    const { getByText } = render(
      <TamaguiProvider config={appConfig}>
        <OtherMessage message={message} />
      </TamaguiProvider>,
    );
    const contentElement = getByText("Test message");
    expect(contentElement).toBeTruthy();
    const sentAtElement = getByText("Wed, 4/3, 8:34 AM");
    expect(sentAtElement).toBeTruthy();
  });
});
