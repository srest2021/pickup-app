import {
  render,
  fireEvent,
  screen,
  waitFor,
} from "@testing-library/react-native";
import { TamaguiProvider } from "tamagui";
import appConfig from "../../../tamagui.config";
import Register from "../../../src/components/auth/Register";
import { supabase } from "../../../src/lib/supabase";

describe("Register", () => {
  it("should render successfully", () => {
    const { root } = render(
      <TamaguiProvider config={appConfig}>
        <Register />
      </TamaguiProvider>,
    );
    expect(root).toBeTruthy();
  });
});

describe("Register button", () => {
  beforeEach(() => {
    jest.spyOn(supabase.auth, "signUp").mockResolvedValueOnce({
      data: { session: null },
      error: null,
    });
  });

  it("should register when clicked", async () => {
    const { root } = render(
      <TamaguiProvider config={appConfig}>
        <Register />
      </TamaguiProvider>,
    );

    const email = "test@example.com";
    const username = "test_username";
    const password = "password";

    const emailInput = screen.getByTestId("email-input");
    const usernameInput = screen.getByTestId("username-input");
    const passwordInput = screen.getByTestId("password-input");
    fireEvent.changeText(emailInput, email);
    fireEvent.changeText(usernameInput, username);
    fireEvent.changeText(passwordInput, password);

    const registerBtn = screen.getByTestId("register-button");
    fireEvent.press(registerBtn);
    await waitFor(() => {
      expect(supabase.auth.signUp).toHaveBeenCalledTimes(1);
      expect(supabase.auth.signUp).toHaveBeenCalledWith({
        email,
        password,
        options: {
          data: {
            username: username,
          },
        },
      });
    });
  });
});
