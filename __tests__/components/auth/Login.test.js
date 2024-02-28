//import renderer from "react-test-renderer";
import { render } from "@testing-library/react-native";
import { TamaguiProvider } from "tamagui";
import appConfig from "../../../tamagui.config";
import Login from "../../../src/components/auth/Login";

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

// describe("Login", () => {
//   it("should have 1 child", () => {
//     const { root } = render(
//       <TamaguiProvider config={appConfig}>
//         <Login />
//       </TamaguiProvider>,
//     );
//     expect(root.children.length).toBe(1);
//   });
// });
