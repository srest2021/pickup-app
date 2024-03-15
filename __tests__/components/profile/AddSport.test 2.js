import {
    render,
    fireEvent,
    screen,
    waitFor,
} from "@testing-library/react-native";
import { TamaguiProvider } from "tamagui";
import appConfig from "../../../tamagui.config";
import Login from "../../../src/components/auth/Login";
import { supabase } from "../../../src/lib/supabase";
import { NavigationContainer } from "@react-navigation/native";
import "@testing-library/jest-dom";
import React from 'react';
import AddSport from "../../../src/components/user/AddSport";

describe('AddSport component', () => {
    test('should call onSportSelect with the selected sport and skill level when Save button is pressed', async () => {
      // Mock the onSportSelect function
      const onSportSelectMock = jest.fn();
  
      // Render the AddSport component
      const { getByLabelText, getByText } = render(
        <AddSport onSportSelect={onSportSelectMock} />
      );
  
      // Select a sport and skill level
      fireEvent.changeText(getByLabelText('Select Sport'), 'Football');
      fireEvent.press(getByLabelText('Select Skill Level').parent);
      fireEvent.press(getByText('Beginner'));
  
      // Press the Save button
      fireEvent.press(getByText('Save'));
  
      // Check if onSportSelect was called with the correct parameters
      expect(onSportSelectMock).toHaveBeenCalledWith('football', 0);
    });
  });

