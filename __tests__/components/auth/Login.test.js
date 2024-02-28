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

// jest.mock('@supabase/supabase-js', () => ({
//   supabase: {
//     auth: {
//       signInWithPassword: jest.fn().mockResolvedValue({ data: {user: null, session: null}, error: null}),
//     },
//   },
// }));

describe("Login", () => {
  it("should render successfully", () => {
    const { root } = render(
      <TamaguiProvider config={appConfig}>
        <Login />
      </TamaguiProvider>,
    );
    expect(root).toBeTruthy();
  });
});

describe("Login button", () => {
  beforeEach(() => {
    jest
      .spyOn(supabase.auth, "signInWithPassword")
      .mockResolvedValueOnce({
        data: { user: null, session: null },
        error: null,
      });
  });

  it("should sign in when clicked", async () => {
    const { root } = render(
      <TamaguiProvider config={appConfig}>
        <Login />
      </TamaguiProvider>,
    );

    const email = "test@example.com";
    const password = "password";

    const emailInput = screen.getByTestId("email-input");
    const passwordInput = screen.getByTestId("password-input");
    fireEvent.changeText(emailInput, email);
    fireEvent.changeText(passwordInput, password);

    const signInBtn = screen.getByTestId("signin-button");
    fireEvent.press(signInBtn);
    await waitFor(() => {
      expect(supabase.auth.signInWithPassword).toHaveBeenCalledTimes(1);
      expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email,
        password,
      });
    });
  });
});

// describe("Register button", () => {
  
// });
