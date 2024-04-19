import Feed from '../../../src/components/Feed';
import appConfig from "../../../tamagui.config";
import { render, fireEvent, waitFor, act, useState } from '@testing-library/react-native';
import { TamaguiProvider } from 'tamagui';
import "@testing-library/jest-dom";
jest.useFakeTimers();





//just do a normal spyOn() as you did before somewhere in your test:
/*

    jest.mock("../../../src/hooks/use-query-games", () => ({
        __esModule: true,
        default: () => ({
        myGames: [],
        fetchMyGames: jest.fn(),
        fetchAllGames: jest.fn(),
        fetchJoinedGames: jest.fn(),
        }),
    }));
  */
 

  
  
  
  // mock user
  const mockUser = {
    id: "testid",
    username: "testusername",
    displayName: "test display name",
    bio: "test bio",
    avatarUrl: "test avatar url",
    sports: [],
  };
  
  // mock session with user object
  const mockSession = {
    access_token: "access_token_test_string",
    refresh_token: "refresh_token_test_string",
    expires_in: 90000000,
    token_type: "token_type_test",
    user: mockUser,
  };
  
  // mock useMutationUser hook
  
  // mock store
  jest.mock("../../../src/lib/store", () => ({
      
    useStore: jest.fn(() => [{
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
        }}, [], []]),
    
  }));
  /*
  // mock useQueryGames hook
  jest.mock("../../../src/hooks/use-query-games", () => ({
    __esModule: true,
    default: () => ({
      fetchMyGames: jest.fn(),
      fetchJoinedGames: jest.fn(),
    }),
  }));
  */


describe('Feed component', () => {
    it('should render successfully', async () => {
        const navigation = {}; // Mock navigation object
    const { root } = render(
      <TamaguiProvider config={appConfig}>
        <Feed navigation={navigation} />
      </TamaguiProvider>,
    );
        await act(async () => {
        await waitFor(() => {
            expect(root).toBeTruthy();
        });
        });
      });
    
     
      describe('Feed button', () => {
        it('should render loading state when session is not available', async () => {
          let loadingText;
          const navigation = {}; // Mock navigation object
            const { getByText } = render(
              <TamaguiProvider config={appConfig}>
                <Feed session={false} />
              </TamaguiProvider>,
            );
            loadingText = getByText('Loading...');
          
          await act(async () => {
          expect(loadingText).toBeTruthy();
            });
        });

        it('should render location permissions message when session is available but location permission is not granted', async () => {
            
            const navigation = {}; // Mock navigation object
        
          
              // Mocking Feed component
              /*
              jest.spyOn(React, 'useState').mockImplementation((initialValue) => [
                mockComponentState[initialValue],
                jest.fn(), // Mock the setState function
              ]);
              */
        
        
            let locationPermissionText;
        
            const { getByText } = render(
              <TamaguiProvider config={appConfig}>
                <Feed navigation={navigation} session={true} hasLocation={false} />
              </TamaguiProvider>
            );
        
            locationPermissionText = getByText(
              'Allow location permissions to view games near you!'
            );
        
            await act(async () => {
              expect(locationPermissionText).toBeTruthy();
            });
          });
        });
        
       
    });
    
        it('should render games list when session is available and location permission is granted', async () => {
            const navigation = {}; // Mock navigation object
        
            
          let allGamesText;
          const session = { user: { id: 1, name: 'Test User' } };
          
            const { getByText } = render(
              <TamaguiProvider config={appConfig}>
                <Feed session={session} hasLocation={true} />
              </TamaguiProvider>,
            );
            allGamesText = getByText('All Games');
            await act(async () => {
                expect(allGamesText).toBeTruthy();
              });
          });
          
    
        it('should handle refresh button click', async () => {
            
            const navigation = {}; // Mock navigation object
        
          let refreshButton;
          const handleRefreshMock = jest.fn();
          
            const { getByText } = render(
              <TamaguiProvider config={appConfig}>
                <Feed handleRefresh={handleRefreshMock} />
              </TamaguiProvider>,
            );
            refreshButton = getByText('Click to Refresh');
            fireEvent.press(refreshButton);
            await act(async () => {
            await waitFor(() => {
              expect(handleRefreshMock).toHaveBeenCalledTimes(1);
            });
          });
        });
     
