import { render, fireEvent, screen } from "@testing-library/react-native";
import { TamaguiProvider } from "tamagui";
import appConfig from "../../../tamagui.config";
import "@testing-library/jest-dom";
import React from "react";
import SearchProfiles from "../../../src/components/user/SearchProfiles";
import { AlignVerticalJustifyCenter } from "@tamagui/lucide-icons";
import OtherUserThumbnail from "../../../src/components/user/OtherUserThumbnail";

describe("OtherUserThumbnail component", () => {
  jest.mock("../../../src/hooks/use-query-users", () => ({
    __esModule: true,
    default: jest.fn(),
  }));
  jest.mock("../../../src/hooks/use-mutation-user", () => ({
    __esModule: true,
    default: jest.fn(),
  }));
  jest.mock("../../../src/lib/store", () => ({
    useStore: jest.fn(),
  }));

  test("renders correctly", () => {
    const navigation = {};
    const user = {
      id: 1,
      username: "testuser",
      displayName: "Test User",
      bio: "Test bio",
    };
    const { getByText, getByTestId } = render(
      <OtherUserThumbnail
        navigation={navigation}
        user={user}
        isFriend={false}
        isSearch={false}
      />,
    );

    expect(getByText("Test User")).toBeInTheDocument();
    expect(getByText("@testuser")).toBeInTheDocument();
    expect(getByText("Test bio")).toBeInTheDocument();
    expect(getByTestId("accept-button")).toBeInTheDocument();
    expect(getByTestId("reject-button")).toBeInTheDocument();

    test("clicking accept button triggers acceptFriendRequestById", async () => {
      const acceptFriendRequestById = jest.fn().mockResolvedValue();
      const navigation = {};
      const user = {
        id: 1,
        username: "testuser",
        displayName: "Test User",
        bio: "Test bio",
      };
      useMutationUser.mockReturnValue({ acceptFriendRequestById });

      const { getByTestId } = render(
        <OtherUserThumbnail
          navigation={navigation}
          user={user}
          isFriend={false}
          isSearch={false}
        />,
      );
      const acceptButton = getByTestId("accept-button");

      fireEvent.click(acceptButton);

      await waitFor(() => {
        expect(acceptFriendRequestById).toHaveBeenCalledWith(1);
      });
    });
  });
});
