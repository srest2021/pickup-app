import { afterEach } from '@testing-library/react-native';
import { storeResetFns } from './__mocks__/src/lib/store';

jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock"),
);


