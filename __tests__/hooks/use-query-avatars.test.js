import { renderHook } from "@testing-library/react-native";
import { useStore } from "../../src/lib/store";
import { supabase } from "../../src/lib/supabase";
import useQueryAvatars from "../../src/hooks/use-query-avatars";

jest.mock("../../src/lib/store");
jest.mock("../../src/lib/supabase", () => ({
  storage: {
    from: jest.fn(() => ({
      download: jest.fn(),
    })),
  },
}));

describe("useQueryAvatars", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should fetch and add avatar URL when avatarPath is provided", async () => {
    const userId = "123";
    const avatarPath = "avatar.jpg";
    const mockAvatarUrl = "http://example.com/avatar.jpg";

    const addAvatarUrlMock = jest.fn();
    const useStoreMock = jest.fn(() => [[], addAvatarUrlMock]);
    useStore.mockImplementation(useStoreMock);

    const { result, waitForNextUpdate } = renderHook(() => useQueryAvatars());

    await result.current.fetchAvatar(userId, avatarPath);
    await waitForNextUpdate();

    expect(useStoreMock).toHaveBeenCalled();
    expect(supabase.storage.from("avatars").download).toHaveBeenCalledWith(
      avatarPath,
    );
    expect(addAvatarUrlMock).toHaveBeenCalledWith(userId, mockAvatarUrl);
  });

  it("should not fetch avatar URL if it already exists in the store", async () => {
    const userId = "123";
    const avatarPath = "avatar.jpg";
    const mockAvatarUrl = "http://example.com/avatar.jpg";

    const addAvatarUrlMock = jest.fn();
    const useStoreMock = jest.fn(() => [
      [{ userId, avatarUrl: mockAvatarUrl }],
      addAvatarUrlMock,
    ]);
    useStore.mockImplementation(useStoreMock);

    const { result, waitForNextUpdate } = renderHook(() => useQueryAvatars());

    await result.current.fetchAvatar(userId, avatarPath);
    await waitForNextUpdate();

    expect(useStoreMock).toHaveBeenCalled();
    expect(supabase.storage.from("avatars").download).not.toHaveBeenCalled();
    expect(addAvatarUrlMock).not.toHaveBeenCalled();
  });

  it("should handle errors when downloading avatars", async () => {
    const userId = "123";
    const avatarPath = "avatar.jpg";
    const errorMock = new Error("Failed to download image");

    const addAvatarUrlMock = jest.fn();
    const useStoreMock = jest.fn(() => [[], addAvatarUrlMock]);
    useStore.mockImplementation(useStoreMock);

    //supabase.storage.from("avatars").download.mockRejectedValue(errorMock);

    const { result, waitForNextUpdate } = renderHook(() => useQueryAvatars());

    await result.current.fetchAvatar(userId, avatarPath);
    //await waitForNextUpdate();

    expect(useStoreMock).toHaveBeenCalled();
    /*
    expect(supabase.storage.from("avatars").download).toHaveBeenCalledWith(
      avatarPath
    );
    */
    expect(addAvatarUrlMock).toHaveBeenCalledWith(userId, null);
  });
});
