import { useStore } from "../../src/lib/store";

describe("useStore", () => {
  let store;

  beforeEach(() => {
    store = useStore.getState();
  });

  test("initial state should match initialState object", () => {
    expect(store).toEqual({
      session: null,
      loading: false,
      user: null,
      userSports: [],
      otherUser: null,
      myGames: [],
      selectedMyGame: null,
      feedGames: [],
      feedGamesFriendsOnly: [],
      selectedFeedGame: null,
      joinedGames: [],
      selectedJoinedGame: null,
      location: null,
      filterSport: null,
      filterDist: 15,
      filterLevel: null,
      messages: [],
      channel: undefined,
      roomCode: null,
      avatarUrls: [],
      friends: [],
      friendRequests: [],
      searchResults: null,
    });
  });

  test("setSession should update session state", () => {
    const newSession = { id: "session_id", token: "session_token" };
    store.setSession(newSession);
    expect(store.session).toEqual(newSession);
  });

  test("setLoading should update loading state", () => {
    store.setLoading(true);
    expect(store.loading).toBe(true);
  });

  test("setUser should update user state", () => {
    const newUser = { id: "user_id", name: "John Doe" };
    store.setUser(newUser);
    expect(store.user).toEqual(newUser);
  });

  test("addUserSport should add a new user sport to userSports array", () => {
    const newUserSport = { id: "sport_id", name: "Basketball" };
    store.addUserSport(newUserSport);
    expect(store.userSports).toContainEqual(newUserSport);
  });

  test("editUserSport should update an existing user sport in userSports array", () => {
    const newUserSport = { id: "sport_id", name: "Basketball" };
    store.addUserSport(newUserSport);
    const updatedUserSport = { ...newUserSport, name: "Football" };
    store.editUserSport(updatedUserSport);
    expect(store.userSports).toContainEqual(updatedUserSport);
    expect(store.userSports).not.toContainEqual(newUserSport);
  });

  // Add more tests for other actions and state mutations as needed
  test("setLocation should update location state", () => {
    const newLocation = {
      coords: { latitude: 40.7128, longitude: -74.006 },
      timestamp: 1648717800000,
    };
    store.setLocation(newLocation);
    expect(store.location).toEqual(newLocation);
  });
});
