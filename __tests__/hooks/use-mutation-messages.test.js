import { useEffect } from "react";
import useMutationMessages from "../../src/hooks/use-mutation-messages";
import { useStore } from "../../src/lib/store";
import { supabase } from "../../src/lib/supabase";
import { Alert } from "react-native";

// Mocking react-native Alert
jest.mock("react-native", () => ({
  Alert: {
    alert: jest.fn(),
  },
}));

// Mocking useEffect to run synchronously
//jest.spyOn(React, 'useEffect').mockImplementation((cb) => cb());

// Mocking supabase
const mockSupabase = {
  rpc: jest.fn(),
};
jest.mock("../../src/lib/supabase", () => ({
  supabase: mockSupabase,
}));

// Mocking useStore hook
jest.mock("../../src/lib/store", () => ({
  useStore: jest.fn(),
}));

describe("useMutationMessages", () => {
  let setLoading, channel, roomCode, addMessage;

  beforeEach(() => {
    // Reset mocks and setup initial state for each test
    jest.clearAllMocks();
    setLoading = jest.fn();
    channel = { send: jest.fn() };
    roomCode = "mockedRoomCode";
    addMessage = jest.fn();

    // Mocking useStore return values
    useStore.mockReturnValueOnce([
      null,
      setLoading,
      channel,
      roomCode,
      addMessage,
    ]);
  });

  describe("addChatroomMessage", () => {
    it("should add a chatroom message and broadcast it through the channel", async () => {
      const mockedContent = "Hello, world!";
      const mockedMessage = { id: "mockedMessageId", content: mockedContent };

      // Mocking the add_message RPC call
      mockSupabase.rpc.mockResolvedValueOnce({
        data: mockedMessage,
        error: null,
      });

      // Initialize the hook
      const mutationMessages = useMutationMessages();

      // Call the addChatroomMessage function
      await mutationMessages.addChatroomMessage(mockedContent);

      // Check if setLoading was called with true and then with false
      expect(setLoading).toHaveBeenNthCalledWith(1, true);
      expect(setLoading).toHaveBeenNthCalledWith(2, false);

      // Check if the add_message RPC call was made with the correct arguments
      expect(mockSupabase.rpc).toHaveBeenCalledWith("add_message", {
        game_id: roomCode,
        content: mockedContent,
      });

      // Check if channel.send was called with the correct message payload
      expect(channel.send).toHaveBeenCalledWith({
        type: "broadcast",
        event: "message",
        payload: mockedMessage,
      });

      // Check if addMessage was called with the correct message
      expect(addMessage).toHaveBeenCalledWith(mockedMessage);

      // Check if Alert.alert was not called (no error occurred)
      expect(Alert.alert).not.toHaveBeenCalled();
    });

    it("should display an alert when there is an error adding a message", async () => {
      const mockedContent = "Hello, world!";
      const mockedError = new Error("Mocked error message");

      // Mocking the add_message RPC call to throw an error
      mockSupabase.rpc.mockResolvedValueOnce({
        data: null,
        error: mockedError,
      });

      // Initialize the hook
      const mutationMessages = useMutationMessages();

      // Call the addChatroomMessage function
      await mutationMessages.addChatroomMessage(mockedContent);

      // Check if setLoading was called with true and then with false
      expect(setLoading).toHaveBeenNthCalledWith(1, true);
      expect(setLoading).toHaveBeenNthCalledWith(2, false);

      // Check if the add_message RPC call was made with the correct arguments
      expect(mockSupabase.rpc).toHaveBeenCalledWith("add_message", {
        game_id: roomCode,
        content: mockedContent,
      });

      // Check if channel.send was not called (due to error)
      expect(channel.send).not.toHaveBeenCalled();

      // Check if addMessage was not called (due to error)
      expect(addMessage).not.toHaveBeenCalled();

      // Check if Alert.alert was called with the correct error message
      expect(Alert.alert).toHaveBeenCalledWith(mockedError.message);
    });
  });
});
