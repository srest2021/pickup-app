import { renderHook } from "@testing-library/react-native";
import useQueryGames from "../../src/hooks/use-query-games";
import { useStore } from "../../src/lib/store";
import { supabase } from "../../src/lib/supabase";
import { Alert } from "react-native";

jest.mock("../../src/lib/store");
jest.mock("../../src/lib/supabase");

describe("useQueryGames", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should fetch my games successfully", async () => {
    const mockMyGames = [
      { id: 1, title: "Game 1" },
      { id: 2, title: "Game 2" },
    ];
    const setMyGamesMock = jest.fn();
    const setLoadingMock = jest.fn();
    const clearMyGamesMock = jest.fn();
    useStore.mockReturnValue([
      null,
      setLoadingMock,
      mockMyGames,
      setMyGamesMock,
      clearMyGamesMock,
    ]);

    const { result, waitForNextUpdate } = renderHook(() => useQueryGames());
    await result.current.fetchMyGames();

    expect(setLoadingMock).toHaveBeenCalledWith(true);
    expect(supabase.rpc).toHaveBeenCalledWith("my_games", expect.any(Object));
    expect(setMyGamesMock).toHaveBeenCalledWith(mockMyGames);
    expect(setLoadingMock).toHaveBeenCalledWith(false);
  });

  it("should handle error when fetching my games", async () => {
    const setLoadingMock = jest.fn();
    const clearMyGamesMock = jest.fn();
    const useStoreMock = jest.fn(() => [
      null,
      setLoadingMock,
      [],
      jest.fn(),
      clearMyGamesMock,
    ]);
    useStore.mockImplementation(useStoreMock);

    const errorMock = new Error("Failed to fetch my games");
    supabase.rpc.mockRejectedValue(errorMock);

    const { result, waitForNextUpdate } = renderHook(() => useQueryGames());
    await result.current.fetchMyGames();

    expect(setLoadingMock).toHaveBeenCalledWith(true);
    expect(supabase.rpc).toHaveBeenCalledWith("my_games", expect.any(Object));
    expect(Alert.alert).toHaveBeenCalledWith(errorMock.message);
    expect(clearMyGamesMock).toHaveBeenCalled();
    expect(setLoadingMock).toHaveBeenCalledWith(false);
  });
  it("should fetch joined games successfully", async () => {
    const mockJoinedGames = [
      { id: 1, title: "Joined Game 1" },
      { id: 2, title: "Joined Game 2" },
    ];
    const setJoinedGamesMock = jest.fn();
    const setLoadingMock = jest.fn();
    const clearJoinedGamesMock = jest.fn();
    useStore.mockReturnValue([
      { user: { id: 1 } }, // Mock session with user ID
      setLoadingMock,
      [],
      jest.fn(),
      clearJoinedGamesMock,
    ]);

    supabase.rpc.mockResolvedValue({ data: mockJoinedGames });

    const { result } = renderHook(() => useQueryGames());
    await result.current.fetchJoinedGames();

    expect(setLoadingMock).toHaveBeenCalledWith(true);
    expect(supabase.rpc).toHaveBeenCalledWith(
      "joined_games",
      expect.any(Object),
    );
    expect(setJoinedGamesMock).toHaveBeenCalledWith(mockJoinedGames);
    expect(setLoadingMock).toHaveBeenCalledWith(false);
  });

  it("should handle error when fetching joined games", async () => {
    const setLoadingMock = jest.fn();
    const clearJoinedGamesMock = jest.fn();
    useStore.mockReturnValue([
      { user: { id: 1 } }, // Mock session with user ID
      setLoadingMock,
      [],
      jest.fn(),
      clearJoinedGamesMock,
    ]);

    const errorMock = new Error("Failed to fetch joined games");
    supabase.rpc.mockRejectedValue(errorMock);

    const { result } = renderHook(() => useQueryGames());
    await result.current.fetchJoinedGames();

    expect(setLoadingMock).toHaveBeenCalledWith(true);
    expect(supabase.rpc).toHaveBeenCalledWith(
      "joined_games",
      expect.any(Object),
    );
    expect(Alert.alert).toHaveBeenCalledWith(errorMock.message);
    expect(clearJoinedGamesMock).toHaveBeenCalled();
    expect(setLoadingMock).toHaveBeenCalledWith(false);
  });

  // Add more test cases for other functions in useQueryGames if needed
  it("should fetch feed games successfully", async () => {
    const mockFeedGames = [
      { id: 1, title: "Feed Game 1" },
      { id: 2, title: "Feed Game 2" },
    ];
    const setFeedGamesMock = jest.fn();
    const setLoadingMock = jest.fn();
    const clearFeedGamesMock = jest.fn();
    const clearFeedGamesFriendsOnlyMock = jest.fn();
    useStore.mockReturnValue([
      { user: { id: 1 } }, // Mock session with user ID
      setLoadingMock,
      [],
      jest.fn(),
      jest.fn(),
      setFeedGamesMock,
      clearFeedGamesMock,
      jest.fn(),
      clearFeedGamesFriendsOnlyMock,
      jest.fn(),
      jest.fn(),
      jest.fn(),
      jest.fn(),
      jest.fn(),
      jest.fn(),
    ]);

    supabase.rpc.mockResolvedValue({ data: mockFeedGames });

    const { result } = renderHook(() => useQueryGames());
    await result.current.fetchFeedGames(false, 0); // Non-friends only, offset 0

    expect(setLoadingMock).toHaveBeenCalledWith(true);
    expect(supabase.rpc).toHaveBeenCalledWith(
      "nearby_games",
      expect.any(Object),
    );
    expect(setFeedGamesMock).toHaveBeenCalledWith(mockFeedGames);
    expect(clearFeedGamesMock).toHaveBeenCalled();
    expect(setLoadingMock).toHaveBeenCalledWith(false);
  });

  it("should handle error when fetching feed games", async () => {
    const setLoadingMock = jest.fn();
    const clearFeedGamesMock = jest.fn();
    const clearFeedGamesFriendsOnlyMock = jest.fn();
    useStore.mockReturnValue([
      { user: { id: 1 } }, // Mock session with user ID
      setLoadingMock,
      [],
      jest.fn(),
      jest.fn(),
      jest.fn(),
      clearFeedGamesMock,
      jest.fn(),
      clearFeedGamesFriendsOnlyMock,
      jest.fn(),
      jest.fn(),
      jest.fn(),
      jest.fn(),
      jest.fn(),
      jest.fn(),
    ]);

    const errorMock = new Error("Failed to fetch feed games");
    supabase.rpc.mockRejectedValue(errorMock);

    const { result } = renderHook(() => useQueryGames());
    await result.current.fetchFeedGames(true, 10); // Friends only, offset 10

    expect(setLoadingMock).toHaveBeenCalledWith(true);
    expect(supabase.rpc).toHaveBeenCalledWith(
      "friends_only_games",
      expect.any(Object),
    );
    expect(Alert.alert).toHaveBeenCalledWith(errorMock.message);
    expect(clearFeedGamesFriendsOnlyMock).toHaveBeenCalled();
    expect(setLoadingMock).toHaveBeenCalledWith(false);
  });
});
