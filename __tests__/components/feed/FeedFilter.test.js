import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import FeedFilter from "../../../src/components/FeedFilter";
import { TamaguiProvider } from "tamagui";
import appConfig from "../../../tamagui.config";
import "@testing-library/jest-dom";
jest.useFakeTimers();

// Mock the useStore hook
jest.mock("../../../src/lib/store", () => ({
  useStore: jest.fn(() => [
    {
      loading: false,
      setFilterSport: jest.fn(),
      setFilterDist: jest.fn(),
      setFilterLevel: jest.fn(),
      getFilterSport: jest.fn(),
      getFilterDist: jest.fn(),
      getFilterLevel: jest.fn(),
      session: {
        access_token: "access_token_test_string",
        refresh_token: "refresh_token_test_string",
        expires_in: 90000000,
        token_type: "token_type_test",
        user: "user",
      },
    },
    [],
    [],
  ]),
  __esModule: true,
  default: jest.fn(() => ({
    loading: false,
    setFilterSport: jest.fn(),
    setFilterDist: jest.fn(),
    setFilterLevel: jest.fn(),
    getFilterSport: jest.fn(() => null),
    getFilterDist: jest.fn(() => 10),
    getFilterLevel: jest.fn(() => null),
  })),
}));

describe("FeedFilter component", () => {
  test("renders correctly with default values", () => {
    const { root } = render(
      <TamaguiProvider config={appConfig}>
        <FeedFilter handleRefresh={() => {}} />
      </TamaguiProvider>,
    );

    // Check if the distance slider and its label are rendered with default value
    const distanceSlider = screen.getByLabelText(
      "Set the maximum distance away from you:",
    );
    expect(distanceSlider).toBeTruthy();
    expect(getByTestId("distanceLabel").props.children).toBe(10); // Assuming you set a testID for the label

    // Check if the sport select and its label are rendered with default value
    const sportSelect = getByLabelText("Select a sport:");
    expect(sportSelect).toBeTruthy();
    expect(getByTestId("sportSelect").props.value).toBe("any"); // Assuming you set a testID for the select component

    // Check if the skill level radio group and its label are rendered with default value
    const skillLevelRadioGroup = getByLabelText("Select a skill level:");
    expect(skillLevelRadioGroup).toBeTruthy();
    expect(getByTestId("skillLevelRadioGroup").props.value).toBe("-1"); // Assuming you set a testID for the radio group component
  });

  test("calls setFilterDist, setFilterSport, and setFilterLevel on Apply filter button press", () => {
    const setFilterDistMock = jest.fn();
    const setFilterSportMock = jest.fn();
    const setFilterLevelMock = jest.fn();

    const { root } = render(
      <TamaguiProvider config={appConfig}>
        <FeedFilter handleRefresh={() => {}} />
      </TamaguiProvider>,
    );

    // Simulate changing distance value
    const distanceSlider = screen.getByLabelText(
      "Set the maximum distance away from you:",
    );
    fireEvent(distanceSlider, "valueChange", 15);

    // Simulate changing sport value
    const sportSelect = screen.getByLabelText("Select a sport:");
    fireEvent(sportSelect, "valueChange", "football");

    // Simulate changing skill level value
    const skillLevelRadioGroup = screen.getByLabelText("Select a skill level:");
    fireEvent(skillLevelRadioGroup, "valueChange", "0");

    // Simulate pressing the Apply button
    const applyButton = screen.getByText("Apply");
    fireEvent.press(applyButton);

    // Expect setFilterDist, setFilterSport, and setFilterLevel to be called with the correct values
    expect(setFilterDistMock).toHaveBeenCalledWith(15);
    expect(setFilterSportMock).toHaveBeenCalledWith("football");
    expect(setFilterLevelMock).toHaveBeenCalledWith("0");
  });

  test("resets values on Cancel button press", () => {
    const { root } = render(
      <TamaguiProvider config={appConfig}>
        <FeedFilter handleRefresh={() => {}} />
      </TamaguiProvider>,
    );

    // Simulate changing distance value
    const distanceSlider = screen.getByLabelText(
      "Set the maximum distance away from you:",
    );
    fireEvent(distanceSlider, "valueChange", 20);

    // Simulate changing sport value
    const sportSelect = screen.getByLabelText("Select a sport:");
    fireEvent(sportSelect, "valueChange", "basketball");

    // Simulate changing skill level value
    const skillLevelRadioGroup = screen.getByLabelText("Select a skill level:");
    fireEvent(skillLevelRadioGroup, "valueChange", "1");

    // Simulate pressing the Cancel button
    const cancelButton = screen.getByText("Cancel");
    fireEvent.press(cancelButton);

    // Check if values are reset to default
    expect(
      screen.getByLabelText("Set the maximum distance away from you:"),
    ).toBeTruthy();
    expect(screen.getByLabelText("Select a sport:")).toBeTruthy();
    expect(screen.getByLabelText("Select a skill level:")).toBeTruthy();
  });
});
