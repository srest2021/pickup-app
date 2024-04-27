import useMutationSports from "../../src/hooks/use-mutation-sports";
import { useStore } from "../../src/lib/store";
import { supabase } from "../../src/lib/supabase";
import { Alert } from "react-native";
import { SkillLevel } from "../../src/lib/types";

// Mocking react-native Alert
jest.mock("react-native", () => ({
  Alert: {
    alert: jest.fn(),
  },
}));

// Mocking useEffect to run synchronously
//jest.spyOn(React, 'useEffect').mockImplementation((cb) => cb());

// Mocking supabase
const mockSupabase = {
  from: jest.fn(() => ({
    upsert: jest.fn(),
    insert: jest.fn(),
    select: jest.fn(),
  })),
};
jest.mock("../../src/lib/supabase", () => ({
  supabase: mockSupabase,
}));

// Mocking useStore hook
jest.mock("../../src/lib/store", () => ({
  useStore: jest.fn(),
}));

describe("useMutationSports", () => {
  let session, userSports, setLoading, addUserSport, editUserSport;

  beforeEach(() => {
    // Reset mocks and setup initial state for each test
    jest.clearAllMocks();
    session = { user: { id: "mockedUserId" } };
    userSports = [];
    setLoading = jest.fn();
    addUserSport = jest.fn();
    editUserSport = jest.fn();

    // Mocking useStore return values
    useStore.mockReturnValueOnce([
      session,
      userSports,
      setLoading,
      addUserSport,
      editUserSport,
    ]);
  });

  describe("setSport", () => {
    it("should add a new sport if it does not exist in userSports", async () => {
      const mockedSportName = "Basketball";
      const mockedSportSkillLevel = SkillLevel.Beginner;

      // Mocking the addSport function to return a userSport object
      const mockAddSport = jest.fn().mockResolvedValueOnce({
        id: "mockedSportId",
        name: mockedSportName,
        skillLevel: mockedSportSkillLevel,
      });

      // Initialize the hook
      const mutationSports = useMutationSports();
      mutationSports.addSport = mockAddSport;

      // Call the setSport function
      const result = await mutationSports.setSport(
        mockedSportName,
        mockedSportSkillLevel,
      );

      // Check if addSport was called with the correct arguments
      expect(mockAddSport).toHaveBeenCalledWith(
        mockedSportName,
        mockedSportSkillLevel,
      );

      // Check if setLoading was called with true and then with false
      expect(setLoading).toHaveBeenNthCalledWith(1, true);
      expect(setLoading).toHaveBeenNthCalledWith(2, false);

      // Check if result is the expected userSport object
      expect(result).toEqual({
        id: "mockedSportId",
        name: mockedSportName,
        skillLevel: mockedSportSkillLevel,
      });

      // Check if editUserSport was not called
      expect(editUserSport).not.toHaveBeenCalled();

      // Check if Alert.alert was not called (no error occurred)
      expect(Alert.alert).not.toHaveBeenCalled();
    });

    it("should edit an existing sport in userSports", async () => {
      const mockedSportName = "Basketball";
      const mockedSportSkillLevel = SkillLevel.Intermediate;
      const mockedUserSport = {
        id: "mockedSportId",
        name: mockedSportName,
        skillLevel: SkillLevel.Beginner,
      };
      userSports.push(mockedUserSport);

      // Mocking the editSport function to return a userSport object
      const mockEditSport = jest.fn().mockResolvedValueOnce({
        ...mockedUserSport,
        skillLevel: mockedSportSkillLevel,
      });

      // Initialize the hook
      const mutationSports = useMutationSports();
      mutationSports.editSport = mockEditSport;

      // Call the setSport function
      const result = await mutationSports.setSport(
        mockedSportName,
        mockedSportSkillLevel,
      );

      // Check if editSport was called with the correct arguments
      expect(mockEditSport).toHaveBeenCalledWith({
        ...mockedUserSport,
        skillLevel: mockedSportSkillLevel,
      });

      // Check if setLoading was called with true and then with false
      expect(setLoading).toHaveBeenNthCalledWith(1, true);
      expect(setLoading).toHaveBeenNthCalledWith(2, false);

      // Check if result is the expected userSport object with updated skill level
      expect(result).toEqual({
        id: "mockedSportId",
        name: mockedSportName,
        skillLevel: mockedSportSkillLevel,
      });

      // Check if addUserSport was not called
      expect(addUserSport).not.toHaveBeenCalled();

      // Check if Alert.alert was not called (no error occurred)
      expect(Alert.alert).not.toHaveBeenCalled();
    });

    it("should display an alert when there is no user session", async () => {
      // Mocking useStore hook to return null for session
      useStore.mockReturnValueOnce([
        null,
        userSports,
        setLoading,
        addUserSport,
        editUserSport,
      ]);

      // Initialize the hook
      const mutationSports = useMutationSports();

      // Call the setSport function
      await mutationSports.setSport("Basketball", SkillLevel.Intermediate);

      // Check if setLoading was called with true and then with false
      expect(setLoading).toHaveBeenNthCalledWith(1, true);
      expect(setLoading).toHaveBeenNthCalledWith(2, false);

      // Check if supabase functions were not called (due to no user session)
      expect(mockSupabase.from().upsert).not.toHaveBeenCalled();
      expect(mockSupabase.from().insert).not.toHaveBeenCalled();

      // Check if setLoading was called with false after Alert.alert
      expect(setLoading).toHaveBeenNthCalledWith(3, false);

      // Check if Alert.alert was called with the correct error message
      expect(Alert.alert).toHaveBeenCalledWith("No user on the session!");
    });
  });

  describe("addSport", () => {
    it("should add a new sport", async () => {
      const mockedSportName = "Basketball";
      const mockedSportSkillLevel = SkillLevel.Beginner;

      // Mocking the insert function of supabase to return data
      mockSupabase
        .from()
        .insert.mockResolvedValueOnce({ data: [{ id: "mockedSportId" }] });

      // Initialize the hook
      const mutationSports = useMutationSports();

      // Call the addSport function
      const result = await mutationSports.addSport(
        mockedSportName,
        mockedSportSkillLevel,
      );

      // Check if supabase.from().insert was called with the correct arguments
      expect(mockSupabase.from().insert).toHaveBeenCalledWith({
        user_id: "mockedUserId",
        name: mockedSportName,
        skill_level: mockedSportSkillLevel,
      });

      // Check if setLoading was called with true and then with false
      expect(setLoading).toHaveBeenNthCalledWith(1, true);
      expect(setLoading).toHaveBeenNthCalledWith(2, false);

      // Check if result is the expected userSport object
      expect(result).toEqual({
        id: "mockedSportId",
        name: mockedSportName,
        skillLevel: mockedSportSkillLevel,
      });

      // Check if addUserSport was called with the correct userSport object
      expect(addUserSport).toHaveBeenCalledWith(result);

      // Check if Alert.alert was not called (no error occurred)
      expect(Alert.alert).not.toHaveBeenCalled();
    });

    it("should display an alert when there is no user session", async () => {
      // Mocking useStore hook to return null for session
      useStore.mockReturnValueOnce([
        null,
        userSports,
        setLoading,
        addUserSport,
        editUserSport,
      ]);

      // Initialize the hook
      const mutationSports = useMutationSports();

      // Call the addSport function
      await mutationSports.addSport("Basketball", SkillLevel.Intermediate);

      // Check if setLoading was called with true and then with false
      expect(setLoading).toHaveBeenNthCalledWith(1, true);
      expect(setLoading).toHaveBeenNthCalledWith(2, false);

      // Check if supabase.from().insert was not called (due to no user session)
      expect(mockSupabase.from().insert).not.toHaveBeenCalled();

      // Check if Alert.alert was called with the correct error message
      expect(Alert.alert).toHaveBeenCalledWith("No user on the session!");
    });
  });

  describe("editSport", () => {
    it("should edit an existing sport", async () => {
      const mockedSport = {
        id: "mockedSportId",
        name: "Basketball",
        skillLevel: SkillLevel.Beginner,
      };

      // Mocking the upsert function of supabase to return data
      mockSupabase.from().upsert.mockResolvedValueOnce({ data: [mockedSport] });

      // Initialize the hook
      const mutationSports = useMutationSports();

      // Call the editSport function
      const result = await mutationSports.editSport(mockedSport);

      // Check if supabase.from().upsert was called with the correct arguments
      expect(mockSupabase.from().upsert).toHaveBeenCalledWith({
        id: mockedSport.id,
        user_id: session?.user.id,
        name: mockedSport.name,
        skill_level: mockedSport.skillLevel,
      });

      // Check if setLoading was called with true and then with false
      expect(setLoading).toHaveBeenNthCalledWith(1, true);
      expect(setLoading).toHaveBeenNthCalledWith(2, false);

      // Check if result is the expected userSport object
      expect(result).toEqual(mockedSport);

      // Check if editUserSport was called with the correct userSport object
      expect(editUserSport).toHaveBeenCalledWith(mockedSport);

      // Check if Alert.alert was not called (no error occurred)
      expect(Alert.alert).not.toHaveBeenCalled();
    });

    it("should display an alert when there is no user session", async () => {
      // Mocking useStore hook to return null for session
      useStore.mockReturnValueOnce([
        null,
        userSports,
        setLoading,
        addUserSport,
        editUserSport,
      ]);

      // Initialize the hook
      const mutationSports = useMutationSports();

      // Call the editSport function
      await mutationSports.editSport({
        id: "mockedSportId",
        name: "Basketball",
        skillLevel: SkillLevel.Beginner,
      });

      // Check if setLoading was called with true and then with false
      expect(setLoading).toHaveBeenNthCalledWith(1, true);
      expect(setLoading).toHaveBeenNthCalledWith(2, false);

      // Check if supabase.from().upsert was not called (due to no user session)
      expect(mockSupabase.from().upsert).not.toHaveBeenCalled();

      // Check if Alert.alert was called with the correct error message
      expect(Alert.alert).toHaveBeenCalledWith("No user on the session!");
    });
  });
});
