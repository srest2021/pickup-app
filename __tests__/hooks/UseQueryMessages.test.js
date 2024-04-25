import { renderHook } from "@testing-library/react-native";
import useQueryMessages from "../../src/hooks/use-query-messages";
import { useStore } from "../../src/lib/store";
import { supabase } from "../../src/lib/supabase";
import { redis } from "../../src/lib/upstash-redis";
import { Alert } from "react-native";

jest.mock("../../src/lib/supabase");
jest.mock("../../src/lib/store");
jest.mock("../../src/lib/upstash-redis");
jest.mock("react-native");

describe("useQueryMessages", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should fetch chatroom users successfully", async () => {
    const setLoadingMock = jest.fn();
    const addAvatarUrlsMock = jest.fn();
    const session = { user: { id: 1 } };
    const roomCode = "sampleRoom";
    useStore.mockReturnValue([
      session,
      jest.fn(),
      setLoadingMock,
      roomCode,
      jest.fn(),
      jest.fn(),
      jest.fn(),
      jest.fn(),
      addAvatarUrlsMock,
    ]);

    const mockUserProfiles = [
      { player_id: 1, profiles: { avatar_url: "avatar1.jpg" } },
      { player_id: 2, profiles: { avatar_url: "avatar2.jpg" } },
    ];
    supabase.from.mockReturnValue({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      then: jest.fn().mockImplementation((callback) => {
        callback({ data: mockUserProfiles });
      }),
    });

    const { result, waitForNextUpdate } = renderHook(() => useQueryMessages());
    await result.current.getChatroomUsers();

    expect(setLoadingMock).toHaveBeenCalledWith(true);
    expect(supabase.from).toHaveBeenCalledWith("joined_game");
    expect(supabase.from().select).toHaveBeenCalledWith("player_id, profiles");
    expect(supabase.from().eq).toHaveBeenCalledWith("game_id", roomCode);
    expect(addAvatarUrlsMock).toHaveBeenCalledWith([
      { userId: 1, avatarPath: "avatar1.jpg", avatarUrl: null },
      { userId: 2, avatarPath: "avatar2.jpg", avatarUrl: null },
    ]);
    expect(setLoadingMock).toHaveBeenCalledWith(false);
  });

  it("should handle error while fetching chatroom users", async () => {
    const setLoadingMock = jest.fn();
    const addAvatarUrlsMock = jest.fn();
    useStore.mockReturnValue([
      { user: { id: 1 } },
      jest.fn(),
      setLoadingMock,
      "sampleRoom",
      jest.fn(),
      jest.fn(),
      jest.fn(),
      jest.fn(),
      addAvatarUrlsMock,
    ]);

    const errorMock = new Error("Failed to fetch chatroom users");
    supabase.from.mockReturnValue({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      then: jest.fn().mockRejectedValue(errorMock),
    });

    const { result } = renderHook(() => useQueryMessages());
    await result.current.getChatroomUsers();

    expect(setLoadingMock).toHaveBeenCalledWith(true);
    expect(supabase.from).toHaveBeenCalledWith("joined_game");
    expect(supabase.from().select).toHaveBeenCalledWith("player_id, profiles");
    expect(supabase.from().eq).toHaveBeenCalledWith("game_id", "sampleRoom");
    expect(addAvatarUrlsMock).not.toHaveBeenCalled();
    expect(Alert.alert).toHaveBeenCalledWith(errorMock.message);
    expect(setLoadingMock).toHaveBeenCalledWith(false);
  });

  // Add more tests for other functions in the useQueryMessages hook if needed
});
