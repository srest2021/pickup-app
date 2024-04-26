import React from "react";
import { render } from "@testing-library/react-native";
import ChatWindow from "../../../src/components/chatroom/ChatWindow";

// Mock the useStore, useQueryMessages, useQueryAvatars, and supabase functions
jest.mock("../../../src/lib/store", () => ({
    useStore: jest.fn(() => [{
        user: "testuser",
        messages: [],
        setMessages: jest.fn(),
    }]),
  __esModule: true,
  default: jest.fn(() => ({
    user: {
      id: "user_id",
    },
    messages: [],
    setMessages: jest.fn(),
  })),
}));
jest.mock("../../../src/hooks/use-query-messages", () => ({
  __esModule: true,
  default: jest.fn(() => ({
    getChatroomMessages: jest.fn(),
    getChatroomUsers: jest.fn(() => Promise.resolve([])),
  })),
}));
jest.mock("../../../src/hooks/use-query-avatars", () => ({
  __esModule: true,
  default: jest.fn(() => ({
    fetchAvatar: jest.fn(),
  })),
}));
jest.mock("../../../src/lib/supabase", () => ({
  supabase: {},
}));

describe("ChatWindow component", () => {
  test("renders 'No messages yet' when messages array is empty", () => {
    const { getByText } = render(<ChatWindow navigation={{}} />);
    const noMessagesText = getByText("No messages yet");
    expect(noMessagesText).toBeTruthy();
  });

  test("renders messages when messages array is not empty", () => {
    const { getByText } = render(
      <ChatWindow
        navigation={{
          navigate: jest.fn(),
        }}
      />,
    );

    // Assuming messages are available
    const messageText = getByText("Hello, this is a message");
    expect(messageText).toBeTruthy();
  });

  test("renders MyMessage component for user's own messages", () => {
    const { getByText } = render(
      <ChatWindow
        navigation={{
          navigate: jest.fn(),
        }}
      />,
    );

    // Assuming the user has sent a message
    const myMessageText = getByText("This is my message");
    expect(myMessageText).toBeTruthy();
  });

  test("renders OtherMessage component for messages from other users", () => {
    const { getByText } = render(
      <ChatWindow
        navigation={{
          navigate: jest.fn(),
        }}
      />,
    );

    // Assuming there's a message from another user
    const otherMessageText = getByText("Hello from another user");
    expect(otherMessageText).toBeTruthy();
  });

});
