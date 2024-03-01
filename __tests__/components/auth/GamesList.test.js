import {
    render,
    fireEvent,
  } from "@testing-library/react-native";
import GameThumbnail from "../../../src/components/game/GameThumbnail";
import MyGames from "../../../src/components/MyGames";

describe("GamesThumbnail", () => {
    test('renders GameThumbnail component without crashing', () => {
        const navigation = {}; // Mock navigation object
        const game = { 
          title: 'Test Game', 
          datetime: new Date(), 
          sport: { name: 'Football', skillLevel:0 }, 
          description: 'Test description', 
          maxPlayers: 10 
        }; // Mock game object
        render(<GameThumbnail navigation={navigation} game={game} />);
      });

      test('renders game details correctly', () => {
        const navigation = {}; // Mock navigation object
        const game = { 
          title: 'Test Game', 
          datetime: new Date('March 30, 2024 03:24:00'), 
          sport: { name: 'Football', skillLevel:0 }, 
          description: 'Test description', 
          maxPlayers: 10 
        }; // Mock game object
        const { getByText } = render(<GameThumbnail navigation={navigation} game={game} />);
        expect(getByText('Test Game')).toBeInTheDocument();
        expect(getByText('Test description')).toBeInTheDocument();
        expect(getByText('Sat, 3/30').toBeInTheDocument());
      });

      test('navigates to MyGameView screen on button click', () => {
        const navigateMock = jest.fn();
        const navigation = { navigate: navigateMock }; // Mock navigation object
        const game = { 
          title: 'Test Game', 
          datetime: new Date(), 
          sport: { name: 'Football', skillLevel:1 }, 
          description: 'Test description', 
          maxPlayers: 10 
        }; // Mock game object
        const { getByText } = render(<GameThumbnail navigation={navigation} game={game} />);
        const viewButton = getByText('View');
        
        fireEvent.press(viewButton);
        
        expect(navigateMock).toHaveBeenCalledWith('MyGameView', { game });
      });

      test('displays image if image is provided', () => {
        const navigation = {}; // Mock navigation object
        const game = { 
          title: 'Test Game', 
          datetime: new Date(), 
          sport: { name: 'Football', skillLevel:1 }, 
          description: 'Test description', 
          maxPlayers: 10 
        }; // Mock game object
        const { getByTestId } = render(<GameThumbnail navigation={navigation} game={game} />);
        const imageComponent = getByTestId('game-thumbnail-image');
        expect(imageComponent).toBeInTheDocument();
      });
  });


  describe("MyGames", ()=>{
    test('renders MyGames component without crashing', () => {
        const navigation = {}; // Mock navigation object
        render(<MyGames navigation={navigation} />);
      });
      
      jest.mock('../hooks/use-query-games', () => ({
        __esModule: true,
        default: () => ({
          myGames: [],
          fetchMyGames: jest.fn(),
          fetchAllGames: jest.fn(),
        }),
      }));

      test('toggles between My Games and Joined Games tabs', () => {
        const navigation = {}; // Mock navigation object
        const { getByText } = render(<MyGames navigation={navigation} />);
        
        const joinedGamesTab = getByText('Joined Games');
        fireEvent.press(joinedGamesTab);

        const myGamesTab = getByText('My Games');
        fireEvent.press(myGamesTab);
        expect(fetchMyGames).toHaveBeenCalled();
        
      });

      jest.mock('../components/MyGames', () => ({
        __esModule: true,
        default: () => ({
          refreshing: true
        }),
      }));

      test('Spinner displays properly on refresh', () => {
        const navigation = {}; // Mock navigation object
        const { getByTestId } = render(<MyGames navigation={navigation} />);
        const spinner = getByTestId('spinner');
        expect(spinner).toBeTruthy();
      });

  });
