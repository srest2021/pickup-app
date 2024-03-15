import {
  render,
  screen,
  fireEvent,
  getByText,
  waitFor,
  renderHook,
  act,
} from "@testing-library/react-native";
import MyGames from "../../../src/components/MyGames";
import { TamaguiProvider } from "tamagui";
import appConfig from "../../../tamagui.config";
import "@testing-library/jest-dom";
import { useState } from "react";

jest.mock("../../../src/hooks/use-query-games", () => ({
  __esModule: true,
  default: () => ({
    myGames: [],
    fetchMyGames: jest.fn(),
    fetchAllGames: jest.fn(),
    fetchJoinedGames: jest.fn(),
  }),
}));

jest.mock('react', () => ({
  ...jest.requireActual('react'), // Preserve all other exports from 'react'
  useState: jest.fn(), // Mock the useState hook
}));

/*jest.mock("../../../src/components/MyGames", () => ({
  __esModule: true,
  default: () => ({
    refreshing: true,
  }),
}));*/

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
  const { getByTestId } = render(
    <TamaguiProvider config={appConfig}>
      <MyGames navigation={navigation} />
    </TamaguiProvider>,
  );

  const joinedGamesTab = getByTestId("joined-games");
  const myGamesTab = getByTestId("my-games");

  act(() => {
    fireEvent.press(joinedGamesTab);
    fireEvent.press(myGamesTab);
  });

  const { fetchMyGames, fetchJoinedGames } = require("../../../src/hooks/use-query-games");

  expect(fetchJoinedGames).toHaveBeenCalled();
  expect(fetchMyGames).toHaveBeenCalled();

  test("Spinner displays properly on refresh", async () => {
    const navigation = {}; // Mock navigation object
    const { root } = render(
      <TamaguiProvider config={appConfig}>
        <MyGames navigation={navigation} />
      </TamaguiProvider>,
    );
    useState.mockImplementationOnce(() => [true, jest.fn()]);
    await act(async() => {
      const spinner = screen.getByTestId("spinner");
      expect(spinner).toBeTruthy();
    });
    
  });
})});
