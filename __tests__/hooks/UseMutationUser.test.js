import useMutationUser from '../../src/hooks/use-mutation-user';
import { useStore } from '../../src/lib/store';
import { supabase } from '../../src/lib/supabase';
import { Alert } from 'react-native';
import {
  updateIsFriendInCache,
  updatehasRequestedInCache,
} from '../lib/upstash-redis';

jest.mock('../../src/lib/store');
jest.mock('../../src/lib/supabase');
jest.mock('react-native', () => ({
  Alert: {
    alert: jest.fn(),
  },
}));

describe('useMutationUser', () => {
  //const mockUseStore = useStore as jest.mock();
  //const mockSupabase = supabase as jest.fn();
  //const mockAlert = Alert.alert as jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getProfile', () => {
    it('should fetch user profile data', async () => {
      const mockSession = { user: { id: 'mockUserId' } };
      const mockData = {
        id: 'mockId',
        username: 'mockUsername',
        display_name: 'Mock Display Name',
        bio: 'Mock Bio',
        avatar_url: 'mock-avatar-url',
        sports: [{ id: '1', name: 'Basketball', skill_level: 1 }],
      };
      const mockReturnValue = {
        data: mockData,
        error: null,
        status: 200,
      };
      mockUseStore.mockReturnValueOnce([
        mockSession,
        mockData,
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
      ]);
      mockSupabase.from().select.mockResolvedValueOnce(mockReturnValue);

      const mutationUser = useMutationUser();
      await mutationUser.getProfile();

      expect(mockSupabase.from().select).toHaveBeenCalledWith(
        'id,username,display_name,bio,avatar_url,sports (id,name,skill_level)',
      );
      expect(mockUseStore).toHaveBeenCalledTimes(1);
      expect(mockUseStore).toHaveBeenCalledWith(expect.any(Function));
      expect(mockUseStore().setUser).toHaveBeenCalledWith(expect.any(Object));
      expect(mockUseStore().setUserSports).toHaveBeenCalledWith(expect.any(Array));
      expect(mockUseStore().addAvatarUrls).toHaveBeenCalledWith(expect.any(Array));
      expect(mockAlert).not.toHaveBeenCalled();
    });

    it('should handle error when fetching user profile data', async () => {
      const mockSession = { user: { id: 'mockUserId' } };
      const mockError = new Error('Error fetching profile data');
      const mockReturnValue = { data: null, error: mockError, status: 500 };
      mockUseStore.mockReturnValueOnce([
        mockSession,
        null,
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
      ]);
      mockSupabase.from().select.mockResolvedValueOnce(mockReturnValue);

      const mutationUser = useMutationUser();
      await mutationUser.getProfile();

      expect(mockSupabase.from().select).toHaveBeenCalledWith(
        'id,username,display_name,bio,avatar_url,sports (id,name,skill_level)',
      );
      expect(mockUseStore).toHaveBeenCalledTimes(1);
      expect(mockUseStore).toHaveBeenCalledWith(expect.any(Function));
      expect(mockAlert).toHaveBeenCalledWith(mockError.message);
    });

    it('should handle error status 406 when fetching user profile data', async () => {
      const mockSession = { user: { id: 'mockUserId' } };
      const mockError = new Error('Profile not found');
      const mockReturnValue = { data: null, error: mockError, status: 406 };
      mockUseStore.mockReturnValueOnce([
        mockSession,
        null,
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
      ]);
      mockSupabase.from().select.mockResolvedValueOnce(mockReturnValue);

      const mutationUser = useMutationUser();
      await mutationUser.getProfile();

      expect(mockSupabase.from().select).toHaveBeenCalledWith(
        'id,username,display_name,bio,avatar_url,sports (id,name,skill_level)',
      );
      expect(mockUseStore).toHaveBeenCalledTimes(1);
      expect(mockUseStore).toHaveBeenCalledWith(expect.any(Function));
      expect(mockAlert).not.toHaveBeenCalled();
    });
  });

  // Add more tests for other functions in useMutationUser if needed
});
