# Pickup!

Our app allows users to organize, find, and join pick-up games in a convenient and streamlined manner. Users have access to nearby games that fit their skill level and match the desired sport, while organizers can share and coordinate games with their friends or anyone nearby. Organizers can control game visibility (public vs. private), accept or reject user requests to join a game, and invite specific users to join, allowing full control over who has access to the game location and details. Organizers can coordinate user responsibilities for bringing gear, equipment, and more. Users can add friends and communicate easily with each other through game-specific chatrooms.

## Installing / Getting started

> A quick introduction of the minimal setup you need to get the app up & running on a local computer. For example, your advisor might use the instruction here to run the application locally.

1. Make sure you have these prerequisites installed: [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) and [Expo CLI](https://docs.expo.dev/get-started/installation/).  

2. Clone the repository and navigate to the root folder in the terminal.

3. Add a `.env` file in the root folder of this repository containing the fields in the`.env.example` file, and fill in the required environment variables.

4. Run `npm install` to install dependencies.

5. To use the Expo Go app: 

    a. Download the Expo Go app on your phone.

    b. Run `npx expo start --go`.
    
    c. Scan the QR code with the Expo Go app (Android) or the Camera app (iOS) and open the link.

6. To locally build the project:

    a. On iOS, to run the simulator on Xcode:

    ```shell
    expo prebuild --platform ios

    npx expo run:ios
    ```

    b. On Android (not tested yet):

    ```shell
    expo prebuild --platform android

    npx expo run:android
    ```

7. To login as a test user to the app, use the following credentials:

    ```shell
    email: admin@example.com
    password: password
    ```

## Developing

> Detailed and step-by-step documentation for setting up local development. For example, a new team member will use these instructions to start developing the project further. 

> You should include what is needed (e.g. all of the configurations) to set up the dev environment. For instance, global dependencies or any other tools (include download links), explaining what database (and version) has been used, etc. If there is any virtual environment, local server, ..., explain here. 

> Additionally, describe and show how to run the tests, explain your code style and show how to check it.

See the above instructions to install and run the Expo app locally.

If you are getting errors that involve  `Unable to resolve "@tamagui/themes` from `tamagui.config.ts` after running `pnpm install`, then run `pnpm add @tamagui/themes`.

### Jest tests

To run the Jest tests: `npm run test`.

### Code style and formatting

To run prettier: `npm run prettier`.

### Supabase local development setup

View the tutorial to set up Supabase local development [here](https://supabase.com/docs/guides/cli/local-development?access-method=postgres). Follow these steps to set up local development and deploy the changes to the remote database.

1. Login to Supabase using the team password: `npx supabase login`.
2. Make sure the Docker engine is running and initialize Supabase: `supabase init`.
3. Start the Supabase services: `npx supabase start` (similarly, `npx supabase stop` will stop the services). Once the command has finished running, navigate to `http://localhost:54323` to view the local dashboard.
4. Associate the project with the remote project and pull the remote schema. After running these commands, you should see the remote schema in `supabase/migrations/<timestamp>_remote_schema.sql`.

  ```
  npx supabase link --project-ref <project-id>
  # You can get <project-id> from your project's dashboard URL: 
  # https://supabase.com/dashboard/project/<project-id>

  npx supabase db pull
  ```

5. To create a new migration file: `npx supabase migration new <migration-name>`. To reset the local database and run the migration: `npx supabase db reset`.

6. To deploy a local database migration: `npx supabase db push`.

7. To run the unit tests: `npx supabase test db`.

### Create a development build

Follow the instructions to create a build [here](https://docs.expo.dev/build/setup/) and [here](https://docs.expo.dev/develop/development-builds/create-a-build/).

1. Prerequisites: install `expo-dev-client` (`npx expo install expo-dev-client`) and EAS CLI (`npm install -g eas-cli`). 
2. Login to your EAS account: `eas login`.
3. For iOS: run `eas build --profile development-simulator --platform ios`. For Android: run `eas build --profile development --platform android`.
4. Run `npx expo start --dev-client`.



ERD:

```mermaid 
erDiagram
    profiles ||--o{ sports : has
    profiles ||--o{ games : assigned_to
    friend_requests }o--|| profiles : associated_with_2
    friends }o--|| profiles: associated_with_2
    game_locations ||--|| games: associated_with
    game_requests }o--|| games: associated_with
    game_requests }o--|| profiles: associated_with
    joined_game }o--o{ profiles: associated_with
    messages }o--|| profiles: associated_with
    games ||--o{ messages: associated_with

    

    game_locations {
        uuid id PK
        uuid game_id FK
        string street
        string city
        string state
        string zip
        geography loc
    }
    friend_requests {
        uuid id PK
        timestampz created_at
        uuid request_sent_by
        uuid request_sent_to
    }
    friends {
        uuid id PK
        timestampz created_at 
        uuid player1_id FK
        uuid player2_id FK
    }
    game_requests {
        uuid id PK
        timestampz created_at
        uuid game_id FK
        uuid player_id FK
        bool plus_one 
    }
    games {
        uuid id PK
        uuid organizer_id FK
        string title
        string description
        timestampz created_at
        timestampz datetime
        string sport
        int skill_level
        int max_players
        int current_players
        bool is_public
    }
    joined_game {
        uuid id PK
        uuid player_id FK
        uuid game_id FK
        bool plus_one 
    }
    messages {
        uuid id PK
        timestampz sent_at
        uuid game_id FK
        uuid player_id FK
        string content 
    }
    sports {
        uuid id PK
        uuid user_id FK
        string name 
        int skill_level
    }
    profiles {
        uuid id PK
        timestampz updated_at
        string displaye_name
        string avatar_url
        string bio
        string username
        string email 
    }
```