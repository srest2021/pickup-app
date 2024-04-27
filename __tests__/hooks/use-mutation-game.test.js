import useMutationGame from '../../src/hooks/use-mutation-game';
import { Alert } from 'react-native';
import { supabase } from '../../src/lib/supabase';

jest.mock('react-native', () => ({
  Alert: {
    alert: jest.fn(),
  },
}));

jest.mock("../../src/lib/supabase", () => ({
  supabase: {
    rpc: jest.fn(),
    functions: {
      invoke: jest.fn(),
    },
    from: () => ({
      delete: () => ({
        eq: () => ({
          error: null,
        }),
      }),
      insert: () => ({
        select: () => ({
          data: null,
          error: null,
        }),
      }),
    }),
  },
}));

jest.mock("../../src/lib/store", () => ({
      
    useStore: jest.fn(() => [false, null, {
      access_token: "access_token_test_string",
      refresh_token: "refresh_token_test_string",
      expires_in: 90000000,
      token_type: "token_type_test",
      user: {
        id: "testid",
        username: "testusername",
        displayName: "test display name",
        bio: "test bio",
        avatarUrl: "test avatar url",
        sports: [],
        }},
    jest.fn(),
    jest.fn(),
    jest.fn(),
    jest.fn(),
    jest.fn(),
    jest.fn(),
    jest.fn(),
    jest.fn(),
    jest.fn(),
    jest.fn(),
]),
    
  }));


describe('useMutationGame', () => {
  let mockedSession = null;
  let mockedUser = null;
  let mockedLocation = null;
  let mockedSetLoading = jest.fn();
  let mockedAddMyGame = jest.fn();
  let mockedRemoveMyGame = jest.fn();
  let mockedEditMyGame = jest.fn();
  let mockedClearSelectedMyGame = jest.fn();
  let mockedAcceptJoinRequest = jest.fn();
  let mockedRejectJoinRequest = jest.fn();
  let mockedRemovePlayer = jest.fn();
  let mockedUpdateHasRequestedFeedGame = jest.fn();
  let mockedRemoveJoinedGame = jest.fn();

  beforeEach(() => {
    mockedSession = {
      user: 'mockedUser',
    };
    mockedUser = {
      username: 'mockedUsername',
    };
    mockedLocation = {
      coords: {
        latitude: 39.3289357,
        longitude: -76.6172978,
      },
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a game', async () => {
    const mockedDatetime = new Date();
    const mockedTitle = 'Mocked Game';
    const mockedStreet = 'Mocked Street';
    const mockedCity = 'Mocked City';
    const mockedState = 'Mocked State';
    const mockedZip = 'Mocked Zip';
    const mockedSport = 'Mocked Sport';
    const mockedSkillLevel = 1;
    const mockedPlayerLimit = '10';
    const mockedDescription = 'Mocked Description';
    const mockedIsPublic = true;

    supabase.rpc.mockResolvedValueOnce({ data: { row: { f1: 'mockedId' } }, error: null });

    const mutationGame = useMutationGame();
    await mutationGame.createGame(
      mockedTitle,
      mockedDatetime,
      mockedStreet,
      mockedCity,
      mockedState,
      mockedZip,
      mockedSport,
      mockedSkillLevel,
      mockedPlayerLimit,
      mockedDescription,
      mockedIsPublic
    );

    //expect(supabase.rpc).toHaveBeenCalledWith('create_game', expect.any(Object));
    expect(mockedSetLoading).toHaveBeenCalledTimes(2); // Called in createGame and finally block
    expect(mockedAddMyGame).toHaveBeenCalledWith(expect.any(Object));
    expect(supabase.functions.invoke).toHaveBeenCalled();
  });

  // More test cases can be added for other functions in useMutationGame

  it('should edit a game by id', async () => {
    const mockedGameId = 'mockedGameId';
    const mockedTitle = 'Edited Game Title';
    const mockedDatetime = new Date();
    const mockedStreet = 'Edited Street';
    const mockedCity = 'Edited City';
    const mockedState = 'Edited State';
    const mockedZip = 'Edited Zip';
    const mockedSport = 'Edited Sport';
    const mockedSkillLevel = 2;
    const mockedPlayerLimit = '12';
    const mockedDescription = 'Edited Description';
    const mockedIsPublic = false;

    supabase.rpc.mockResolvedValueOnce({ data: { row: {} }, error: null });

    const mutationGame = useMutationGame();
    await mutationGame.editGameById(
      mockedGameId,
      mockedTitle,
      mockedDatetime,
      mockedStreet,
      mockedCity,
      mockedState,
      mockedZip,
      mockedSport,
      mockedSkillLevel,
      mockedPlayerLimit,
      mockedDescription,
      mockedIsPublic
    );

    expect(supabase.rpc).toHaveBeenCalledWith('edit_game', expect.any(Object));
    expect(mockedSetLoading).toHaveBeenCalledTimes(2); // Called in editGameById and finally block
    expect(mockedEditMyGame).toHaveBeenCalledWith(expect.any(String), expect.any(Object));
  });

  
  it('should accept a join request by game and player id', async () => {
    const mockedGameId = 'mockedGameId';
    const mockedPlayerId = 'mockedPlayerId';
    const mockedPlusOne = false;
  
    // Mocking the check_game_capacity RPC call
    supabase.rpc.mockResolvedValueOnce({ data: {}, error: null });
  
    // Mocking the accept_join_request RPC call
    supabase.rpc.mockResolvedValueOnce({ error: null });
  
    const mutationGame = useMutationGame();
    await mutationGame.acceptJoinRequestById(mockedGameId, mockedPlayerId, mockedPlusOne);
  
    // Checking if the check_game_capacity and accept_join_request RPC calls were made with the correct arguments
    expect(supabase.rpc).toHaveBeenCalledWith('check_game_capacity', expect.any(Object));
    expect(supabase.rpc).toHaveBeenCalledWith('accept_join_request', expect.any(Object));
    // Checking if the acceptJoinRequest function was called with the correct arguments
    expect(mockedAcceptJoinRequest).toHaveBeenCalledWith(mockedGameId, mockedPlayerId, mockedPlusOne);
    // Checking if setLoading was called twice (once in acceptJoinRequestById and once in finally block)
    expect(mockedSetLoading).toHaveBeenCalledTimes(2);
  });

  it('should leave a joined game by game and player id', async () => {
    const mockedGameId = 'mockedGameId';
    const mockedPlayerId = 'mockedPlayerId';
  
    // Mocking the remove_player RPC call
    supabase.rpc.mockResolvedValueOnce({ error: null });
  
    const mutationGame = useMutationGame();
    await mutationGame.leaveJoinedGameById(mockedGameId, mockedPlayerId);
  
    // Checking if the remove_player RPC call was made with the correct arguments
    expect(supabase.rpc).toHaveBeenCalledWith('remove_player', expect.any(Object));
    // Checking if the removeJoinedGame function was called with the correct argument
    expect(mockedRemoveJoinedGame).toHaveBeenCalledWith(mockedGameId);
    // Checking if setLoading was called twice (once in leaveJoinedGameById and once in finally block)
    expect(mockedSetLoading).toHaveBeenCalledTimes(2);
  });
  
  it('should check for game overlap', async () => {
    const mockedDatetime = new Date();
    const mockedStreet = 'Mocked Street';
    const mockedCity = 'Mocked City';
    const mockedState = 'Mocked State';
    const mockedZip = 'Mocked Zip';
  
    // Mocking the is_game_overlap RPC call
    supabase.rpc.mockResolvedValueOnce({ data: true, error: null });
  
    const mutationGame = useMutationGame();
    const result = await mutationGame.checkGameOverlap(
      mockedDatetime,
      mockedStreet,
      mockedCity,
      mockedState,
      mockedZip
    );
  
    // Checking if the is_game_overlap RPC call was made with the correct arguments
    expect(supabase.rpc).toHaveBeenCalledWith('is_game_overlap', expect.any(Object));
    // Checking if the checkGameOverlap function returns the correct result
    expect(result).toBe(true);
    // Checking if setLoading was called twice (once in checkGameOverlap and once in finally block)
    expect(mockedSetLoading).toHaveBeenCalledTimes(2);
  });

  it('should reject a join request by game and player id', async () => {
    const mockedGameId = 'mockedGameId';
    const mockedPlayerId = 'mockedPlayerId';
  
    // Mocking the reject_join_request RPC call
    supabase.rpc.mockResolvedValueOnce({ error: null });
  
    const mutationGame = useMutationGame();
    await mutationGame.rejectJoinRequestById(mockedGameId, mockedPlayerId);
  
    // Checking if the reject_join_request RPC call was made with the correct arguments
    expect(supabase.rpc).toHaveBeenCalledWith('reject_join_request', expect.any(Object));
    // Checking if the rejectJoinRequest function was called with the correct arguments
    expect(mockedRejectJoinRequest).toHaveBeenCalledWith(mockedGameId, mockedPlayerId);
    // Checking if setLoading was called twice (once in rejectJoinRequestById and once in finally block)
    expect(mockedSetLoading).toHaveBeenCalledTimes(2);
  });
  
  it('should remove a player from a game by game and player id', async () => {
    const mockedGameId = 'mockedGameId';
    const mockedPlayerId = 'mockedPlayerId';
    const mockedPlusOne = false;
  
    // Mocking the remove_player RPC call
    supabase.rpc.mockResolvedValueOnce({ error: null });
  
    const mutationGame = useMutationGame();
    await mutationGame.removePlayerById(mockedGameId, mockedPlayerId, mockedPlusOne);
  
    // Checking if the remove_player RPC call was made with the correct arguments
    expect(supabase.rpc).toHaveBeenCalledWith('remove_player', expect.any(Object));
    // Checking if the removePlayer function was called with the correct arguments
    expect(mockedRemovePlayer).toHaveBeenCalledWith(mockedGameId, mockedPlayerId, mockedPlusOne);
    // Checking if setLoading was called twice (once in removePlayerById and once in finally block)
    expect(mockedSetLoading).toHaveBeenCalledTimes(2);
  });
  
  it('should request to join a game by game and player id', async () => {
    const mockedGameId = 'mockedGameId';
    const mockedGameTitle = 'Mocked Game Title';
    const mockedOrganizerId = 'mockedOrganizerId';
    const mockedPlayerId = 'mockedPlayerId';
    const mockedPlusOne = false;
  
    // Mocking the check_game_capacity RPC call
    supabase.rpc.mockResolvedValueOnce({ data: true, error: null });
    // Mocking the insert game_requests call
    //supabase.from().insert().select().mockResolvedValueOnce({ data: {}, error: null });
    // Mocking the sendEmailForJoinRequest function
    //jest.spyOn(mutationGame, 'sendEmailForJoinRequest').mockResolvedValueOnce(null);
  
    const mutationGame = useMutationGame();
    mutationGame.useStore = jest.fn().mockReturnValue([
      { user: { username: 'mockedUsername' } },
      null,
      null,
      mockedSetLoading,
      null,
      null,
      null,
      null,
      mockedUpdateHasRequestedFeedGame,
      null,
      null,
      null,
      null,
    ]);
  
    const result = await mutationGame.requestToJoinById(
      mockedGameId,
      mockedGameTitle,
      mockedOrganizerId,
      mockedPlayerId,
      mockedPlusOne
    );
  
    // Checking if the check_game_capacity RPC call was made with the correct arguments
    expect(supabase.rpc).toHaveBeenCalledWith('check_game_capacity', expect.any(Object));
    // Checking if the insert game_requests call was made with the correct arguments
    expect(supabase.from().insert).toHaveBeenCalledWith([
      { game_id: mockedGameId, player_id: mockedPlayerId, plus_one: mockedPlusOne },
    ]);
    // Checking if the sendEmailForJoinRequest function was called with the correct arguments
    expect(mutationGame.sendEmailForJoinRequest).toHaveBeenCalledWith('mockedUsername', mockedGameTitle, mockedOrganizerId);
    // Checking if the requestToJoinById function returns the correct result
    expect(result).toBe(false);
    // Checking if the updateHasRequestedFeedGame function was called with the correct argument
    expect(mockedUpdateHasRequestedFeedGame).toHaveBeenCalledWith(mockedGameId);
    // Checking if setLoading was called twice (once in requestToJoinById and once in finally block)
    expect(mockedSetLoading).toHaveBeenCalledTimes(2);
  });

  it('should remove a game by its id', async () => {
    const mockedGameId = 'mockedGameId';
  
    // Mocking the session object
    const mockedSession = {
      user: 'mockedUser',
    };
  
    // Mocking the remove_player RPC call
    //supabase.from().delete().eq().mockResolvedValueOnce({ error: null });
  
    const mutationGame = useMutationGame();
    mutationGame.useStore = jest.fn().mockReturnValue([
      mockedSession,
      null,
      null,
      mockedSetLoading,
      null,
      null,
      null,
      mockedRemoveMyGame,
      mockedClearSelectedMyGame,
      null,
      null,
      null,
      null,
    ]);
  
    await mutationGame.removeMyGameById(mockedGameId);
  
    // Checking if the remove_player RPC call was made with the correct arguments
    expect(supabase.from().delete().eq).toHaveBeenCalledWith('id', mockedGameId);
    // Checking if the removeMyGame function was called with the correct argument
    expect(mockedRemoveMyGame).toHaveBeenCalledWith(mockedGameId);
    // Checking if the clearSelectedMyGame function was called
    expect(mockedClearSelectedMyGame).toHaveBeenCalled();
    // Checking if setLoading was called twice (once in removeMyGameById and once in finally block)
    expect(mockedSetLoading).toHaveBeenCalledTimes(2);
  });
  

  it('should send an email notification to friends', async () => {
    const mockedUsername = 'mockedUsername';
    const mockedTitle = 'Mocked Game Title';
    const mockedDatetime = new Date();
  
    // Mocking the get_friends_emails RPC call
    supabase.rpc.mockResolvedValueOnce({ data: [], error: null });
    // Mocking the functions.invoke call for sending an email
    supabase.functions.invoke.mockResolvedValueOnce({ data: {}, error: null });
  
    const mutationGame = useMutationGame();
    await mutationGame.sendEmailToFriends(mockedUsername, mockedTitle, mockedDatetime);
  
    // Checking if the get_friends_emails RPC call was made
    expect(supabase.rpc).toHaveBeenCalledWith('get_friends_emails', expect.any(Object));
    // Checking if the functions.invoke call for sending an email was made with the correct arguments
    expect(supabase.functions.invoke).toHaveBeenCalledWith('resend2', expect.any(Object));
    // Checking if setLoading was called twice (once in sendEmailToFriends and once in finally block)
    expect(mockedSetLoading).toHaveBeenCalledTimes(2);
  });
  
  
});
