import { render, fireEvent, screen } from "@testing-library/react-native";
import { TamaguiProvider } from "tamagui";
import appConfig from "../../../tamagui.config";
import "@testing-library/jest-dom";
import React from "react";
import SearchProfiles from "../../../src/components/user/SearchProfiles";

describe("SearchProfiles component", () => {
  jest.mock("../../../src/hooks/use-query-users", () => ({
    __esModule: true,
    default: jest.fn(),
  }));
  jest.mock("@tamagui/lucide-icons", () => ({
    UserSearch: jest.fn(),
  }));
  jest.mock("../../lib/store", () => ({
    useStore: jest.fn(),
  }));

  test("updates input value correctly", () => {
    const { getByPlaceholderText } = render(<SearchProfiles />);
    const inputElement = getByPlaceholderText("Search by username");

    fireEvent.change(inputElement, { target: { value: "test" } });

    expect(inputElement.value).toBe("test");
  });

  test('displays "No Search Results" message when no results', () => {
    const { getByText } = render(<SearchProfiles />);
    const noResultsMessage = getByText("No Search Yet");

    expect(noResultsMessage).toBeInTheDocument();
  });

  test("triggers search when search button is clicked", async () => {
    const { getByPlaceholderText, getByTestId } = render(<SearchProfiles />);
    const inputElement = getByPlaceholderText("Search by username");
    const searchButton = getByTestId("search-button");

    fireEvent.change(inputElement, { target: { value: "test" } });
    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(useQueryUsers).toHaveBeenCalledWith();
    });
  });

  test("returns search results when searched", async () => {
    const mockResults = [{ id: 1, name: "Test User" }];
    const mockSearchByUsername = jest.fn().mockResolvedValue(mockResults);
    useQueryUsers.mockReturnValue({ searchByUsername: mockSearchByUsername });

    const { getByPlaceholderText, getByTestId } = render(<SearchProfiles />);
    const inputElement = getByPlaceholderText("Search by username");
    const searchButton = getByTestId("search-button");

    fireEvent.change(inputElement, { target: { value: "test" } });
    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(mockSearchByUsername).toHaveBeenCalledWith("test");
      expect(getByText("Test User")).toBeInTheDocument();
    });
  });
});
