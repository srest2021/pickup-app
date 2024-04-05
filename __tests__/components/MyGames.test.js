import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react-native";
import MyGames from "../../src/components/MyGames";
import { TamaguiProvider } from "tamagui";
import appConfig from "../../tamagui.config";
import "@testing-library/jest-dom";
import { useState } from "react";

jest.mock("../../src/hooks/use-query-games", () => ({
  __esModule: true,
  default: () => ({
    myGames: [],
    fetchMyGames: jest.fn(),
    fetchAllGames: jest.fn(),
    fetchJoinedGames: jest.fn(),
  }),
}));

jest.mock("react", () => ({
  ...jest.requireActual("react"), // Preserve all other exports from 'react'
  useState: jest.fn(), // Mock the useState hook
}));

/*jest.mock("../../../src/components/MyGames", () => ({
  __esModule: true,
  default: () => ({
    refreshing: true,
  }),
}));*/

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

// mock useMutationUser hook
jest.mock("../../src/hooks/use-mutation-user", () => ({
  __esModule: true,
  default: jest.fn(() => ({
    session: mockSession,
    setSession: jest.fn(),
    user: mockUser,
  })),
}));

// mock store
jest.mock("../../src/lib/store", () => ({
  useStore: jest.fn(() => [{ session: mockSession }, [], []]),
}));

// mock useQueryGames hook
jest.mock("../../src/hooks/use-query-games", () => ({
  __esModule: true,
  default: () => ({
    fetchMyGames: jest.fn(),
    fetchJoinedGames: jest.fn(),
  }),
}));

describe("MyGames", () => {
  test("renders MyGames component without crashing", async () => {
    const navigation = {}; // Mock navigation object
    const { root } = render(
      <TamaguiProvider config={appConfig}>
        <MyGames navigation={navigation} />
      </TamaguiProvider>,
    );
    await act(async () => {
      await waitFor(() => {
        expect(root).toBeTruthy();
      });
    });
  });

  test("toggles between My Games and Joined Games tabs", async () => {
    const navigation = {}; // Mock navigation object
    const { root } = render(
      <TamaguiProvider config={appConfig}>
        <MyGames navigation={navigation} />
      </TamaguiProvider>,
    );
    useState.mockImplementationOnce(() => [true, jest.fn()]);
    await act(async () => {
      const spinner = screen.getByTestId("spinner");
      expect(spinner).toBeTruthy();
    });

    expect(fetchJoinedGames).toHaveBeenCalled();
    expect(fetchMyGames).toHaveBeenCalled();
  });

  test("Spinner displays properly on refresh", async () => {
    const navigation = {}; // Mock navigation object
    const { root } = render(
      <TamaguiProvider config={appConfig}>
        <MyGames navigation={navigation} />
      </TamaguiProvider>,
    );

    React.useState = jest.fn().mockReturnValue([true, jest.fn()]);
    await act(async () => {
      const spinner = screen.getByTestId("spinner");
      expect(spinner).toBeTruthy();
    });
  });
});
