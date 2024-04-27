import { render, fireEvent, screen } from "@testing-library/react-native";
import { TamaguiProvider } from "tamagui";
import appConfig from "../../../tamagui.config";
import "@testing-library/jest-dom";
import React from "react";
import AddSport from "../../../src/components/user/AddSport";
import { ToastProvider } from "@tamagui/toast";

describe("AddSport component", () => {
  test("should call onSportSelect with the selected sport and skill level when Save button is pressed", async () => {
    // Mock the onSportSelect function
    const onSportSelectMock = jest.fn();

    // Render the AddSport component
    const { root } = render(
      <TamaguiProvider config={appConfig}>
        <ToastProvider>
          <AddSport navigation={onSportSelectMock} />
        </ToastProvider>
      </TamaguiProvider>,
    );

    // Select a sport and skill level
    fireEvent(screen.getByTestId("sportInput"), "onValueChange", "football");
    fireEvent(screen.getByTestId("skillInput"), "onValueChange", "0");

    // Press the Save button
    fireEvent.press(screen.getByTestId("save-btn"));

    // Check if onSportSelect was called with the correct parameters
    expect(onSportSelectMock).toHaveBeenCalledWith("football", 0);
  });
});
