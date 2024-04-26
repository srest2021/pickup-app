import { renderHook } from "@testing-library/react-native";
import useQueryUsers from "../../src/hooks/use-query-users";
import { useStore } from "../../src/lib/store";
import { supabase } from "../../src/lib/supabase";
import { Alert } from "react-native";

jest.mock("../../src/lib/store");
jest.mock("../../src/lib/supabase");
jest.mock("react-native", () => ({
  Alert: {
    alert: jest.fn(),
  },
}));

describe("useQueryUsers", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should fetch user profile successfully", async () => {
    const setLoadingMock = jest.fn();
    const setSearchResultsMock = jest.fn();
    const addAvatarUrlsMock = jest.fn();
    useStore.mockReturnValue([
      { user: { id: 1 } },
      setLoadingMock,
      jest.fn(),
      jest.fn(),
      jest.fn(),
      jest.fn(),
      setSearchResultsMock,
      addAvatarUrlsMock,
    ]);

    const mockUserData = [
      {
        id: 2,
        username: "testuser",
        display_name: "Test User",
        bio: "Test bio",
        avatar_url: "avatar.jpg",
      },
    ];
    supabase.from.mockReturnValue({
      select: jest.fn().mockReturnThis(),
      or: jest.fn().mockReturnThis(),
      not: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      then: jest.fn().mockImplementation((callback) => {
        callback({ data: mockUserData });
      }),
    });

    const { result } = renderHook(() => useQueryUsers());
    await result.current.searchByUsername("test");

    expect(setLoadingMock).toHaveBeenCalledWith(true);
    expect(supabase.from).toHaveBeenCalledWith("profiles");
    expect(supabase.from().select).toHaveBeenCalledWith(
      "id, username, display_name, bio, avatar_url"
    );
    expect(supabase.from().or).toHaveBeenCalledWith(
      `username.ilike.%test%, display_name.ilike.%test%`
    );
    expect(supabase.from().not).toHaveBeenCalledWith("id", "eq", 1);
    expect(setSearchResultsMock).toHaveBeenCalledWith([
      {
        id: 2,
        username: "testuser",
        displayName: "Test User",
        bio: "Test bio",
        avatarUrl: "avatar.jpg",
      },
    ]);
    expect(addAvatarUrlsMock).toHaveBeenCalledWith([
      { userId: 2, avatarPath: "avatar.jpg", avatarUrl: null },
    ]);
    expect(setLoadingMock).toHaveBeenCalledWith(false);
  });

  it("should handle error while fetching user profile", async () => {
    const setLoadingMock = jest.fn();
    useStore.mockReturnValue([{ user: { id: 1 } }, setLoadingMock]);

    const errorMock = new Error("Failed to fetch user profile");
    supabase.from.mockReturnValue({
      select: jest.fn().mockReturnThis(),
      or: jest.fn().mockReturnThis(),
      not: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      then: jest.fn().mockRejectedValue(errorMock),
    });

    const { result } = renderHook(() => useQueryUsers());
    await result.current.searchByUsername("test");

    expect(setLoadingMock).toHaveBeenCalledWith(true);
    expect(supabase.from).toHaveBeenCalledWith("profiles");
    expect(supabase.from().select).toHaveBeenCalledWith(
      "id, username, display_name, bio, avatar_url"
    );
    expect(supabase.from().or).toHaveBeenCalledWith(
      `username.ilike.%test%, display_name.ilike.%test%`
    );
    expect(supabase.from().not).toHaveBeenCalledWith("id", "eq", 1);
    expect(Alert.alert).toHaveBeenCalledWith(errorMock.message);
    expect(setLoadingMock).toHaveBeenCalledWith(false);
  });

  // Add more tests for other functions in the useQueryUsers hook if needed
});
