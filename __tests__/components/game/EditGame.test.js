import {
    render,
    fireEvent,
    screen,
    waitFor,
  } from "@testing-library/react-native";
import EditGame from "../../../src/components/game/EditGame";
import { TamaguiProvider } from "tamagui";
import appConfig from "../../../tamagui.config";
import "@testing-library/jest-dom";
// import useMutationGame from "../../../src/hooks/use-mutation-game";

// Mock dependencies
jest.mock("../../../src/hooks/use-mutation-user", () => () => ({
  user: {}, // Mock user object as needed for the test
}));
const mockEditGameById = jest.fn();
jest.mock("../../../src/hooks/use-mutation-game", () => () => ({
  editGameById: mockEditGameById,
}));

const mockSport = {
  name: "Basketball",
  skillLevel: "Beginner"
}

const mockSelectedMyGame = {
  id: "gameId",
  title: "Test Title",
  datetime: new Date("Sun Mar 13 2025 15:42:33 GMT+0000 (Coordinated Universal Time)"),
  address: "3339 North Charles St",
  city: "Baltimore",
  state: "MD",
  zip: "21218",
  sport: mockSport,
  maxPlayers: 20,
  description: "Test Description",
};

// Mock Selected Game in Store
jest.mock('../../../src/lib/store', () => ({
  useStore: jest.fn(() => [{
     selectedMyGame: mockSelectedMyGame,
     loading: false, 
    }, jest.fn()]),
}));



describe('EditGame', () => {
  it('should call editGameById with updated attributes and navigate back when "Edit" button is pressed', async () => {
    const navigation = { goBack: jest.fn() };
    const route = { params: { gameId: "gameId" } };

    const { getByText, getByTestId } = render(
      <TamaguiProvider config={appConfig}>
        <EditGame navigation={navigation} route={route} />
      </TamaguiProvider>
    );
  
    // getByTestId to select the input field
    fireEvent.changeText(getByTestId("titleInput"), "New Title");
    const editButton = await getByText("Edit");
    fireEvent.press(editButton);
  
    await waitFor(() => {
      expect(mockEditGameById).toHaveBeenCalledWith(
        "gameId",
        "New Title", // only updating title
        expect.any(Date),
        mockSelectedMyGame.address,
        mockSelectedMyGame.city,
        mockSelectedMyGame.state,
        mockSelectedMyGame.zip,
        mockSelectedMyGame.sport.name,
        expect.any(Number), 
        mockSelectedMyGame.maxPlayers.toString(),
        mockSelectedMyGame.description,
      );
    });
  
    expect(navigation.goBack).toHaveBeenCalled();
  });
});
  


// describe("EditGame", () => {
//   it("should render successfully", () => {
//     const navigation = { goBack: jest.fn() };
//     const route = { params: { game: {
//         id: "gameId",
//         title: "Title",
//         description: "Description",
//         datetime: "Sun Mar 13 2025 15:42:33 GMT+0000 (Coordinated Universal Time)",
//         address: "3339 North Charles St, Baltimore, MD, 21218",
//         sport: {
//             name: "Basketball",
//             skillLevel: "Beginner",
//             },
//         maxPlayers: 20,
//     } } };

//     const { root } = render(
//         <TamaguiProvider config={appConfig}>
//           <EditGame navigation={navigation} route={route} />
//         </TamaguiProvider>,
//       );
//     // Add assertions to ensure the component renders successfully
//     // For example, check if a specific element is rendered
//     expect(root).toBeTruthy();
//   });

//   it("should update game attributes and navigate back when 'Edit' button is pressed", async () => {
//     const navigation = { goBack: jest.fn() };
//     const route = { params: { game: {
//         id: "gameId",
//         title: "Title",
//         description: "Description",
//         datetime: "Sun Mar 13 2025 15:42:33 GMT+0000 (Coordinated Universal Time)",
//         address: "3339 North Charles St, Baltimore, MD, 21218",
//         sport: {
//             name: "Basketball",
//             skillLevel: "Beginner",
//             },
//         maxPlayers: 20,
//     } } };
//     const { getByText, getByPlaceholderText } = render(
//         <TamaguiProvider config={appConfig}>
//         <EditGame navigation={navigation} route={route} />
//       </TamaguiProvider>,
//     );

//     // Simulate user input changes
//     fireEvent.changeText(getByPlaceholderText("Title"), "New Title");

//     // Simulate date and time changes
//     // Ensure you're using appropriate selectors to target date and time inputs
//     // fireEvent.[event](element, value) can be used to simulate user interactions
//     // You can simulate the selection of a date/time using fireEvent.changeText or fireEvent.press
//     // Example:
//     // fireEvent.changeText(getByPlaceholderText("Date"), "New Date");

//     // Simulate button press to trigger game edit
//     fireEvent.press(getByText("Edit"));

//     // Wait for the edit function to be called
//     await waitFor(() => {
//       expect(mockEditGameById).toHaveBeenCalledWith(
//         "gameId", // Ensure that the correct game ID is passed
//         expect.any(String), // Add more specific checks for other arguments as needed
//         expect.any(Date),
//         expect.any(String),
//         expect.any(String),
//         expect.any(String),
//         expect.any(String),
//         expect.any(String),
//         expect.any(Number),
//         expect.any(String),
//       );
//     });

//     // Ensure navigation.goBack() is called after successful edit
//     expect(navigation.goBack).toHaveBeenCalled();
//   });

//   // Add more specific tests for error handling, success feedback, etc. as needed
// });

