import { render } from '@testing-library/react-native';
import MyMessage from '../../../src/components/chatroom/MyMessage';
import { TamaguiProvider } from "tamagui";
import appConfig from "../../../tamagui.config";

describe('MyMessage component', () => {
  it('renders message content and sentAt correctly', () => {
    const message = {
      id: '1',
      roomCode: 'testcode',
      content: 'Test message',
      sentAt: new Date('2024-04-03T12:34:56Z'),
      user: {}
    };

    const { getByText } = render(<TamaguiProvider config={appConfig}><MyMessage message={message} /></TamaguiProvider>);
    const contentElement = getByText('Test message');
    expect(contentElement).toBeTruthy();
    const sentAtElement = getByText('Wed, 4/3, 8:34 AM');
    expect(sentAtElement).toBeTruthy();
  });
});
