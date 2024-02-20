# Software Requirement Specification

## Problem Statement
It can be difficult for people to organize future pick-up games or find live pick-up games. Organizers must communicate and coordinate with players through traditional methods such as texting, while players must have prior connections or friends or physically see the pick-up game in order to know it is happening.

## Proposed Solution
Our app allows users to organize, find, and join pick-up games in a convenient and streamlined manner. Users have access to nearby games that fit their skill level and match the desired sport, while organizers can share and coordinate games with their friends or anyone nearby. Organizers can control game visibility (public vs. private), accept or reject user requests to join a game, and invite specific users to join, allowing full control over who has access to the game location and details. Organizers can coordinate user responsibilities for bringing gear, equipment, and more. Users can add friends and communicate easily with each other through game-specific chatrooms.

## Potential Clients
Individuals who organize or want to organize pick-up games with their friends. Individuals looking to find and join pick-up games easily.

## Functional Requirements
### Must have:
- As a user, I want to register for the app and login using my credentials.
- As a user, I want to view and edit my profile, including my username, display name, avatar, bio, sports that I’m interested in, and my skill level in each sport.
- As a user, I want to request to add a friend, so that we can view each other’s friends-only games in our feeds.
- As a user, I want to accept a friend request, so that we can view each other’s friends-only games in our feeds.
- As a user, I want to reject a friend request, so that they can’t see my friends-only games in their feed.
- As an organizer, I want to create a pick-up game so that others can join it.
- As an organizer, I want to edit a game’s details, including the title, location, date, time, sport and required skill level(s), so that these details are visible to users who have joined.
- As an organizer, I want to accept or reject user requests to join, so that I can control who can join the game.
- As an organizer, I want to set a game’s maximum number of players, so that more people don’t join past the maximum capacity.
- As an organizer, I want to remove an accepted user from my game, so that they no longer have access to the game location or details.
- As an organizer, I want to change my game’s visibility to public or friends-only, so that I can control who can view and request to join the game.
- As an organizer, I want to create a public game, so that any other users in my area can request to join the game.
- As an organizer, I want to create a friends-only game, so that my friends can request to join the game. 
- As an organizer, I want accepted users to see my game’s location and non-accepted users to see the distance of my game’s location to their location.
- As an organizer, I want to see a list of the games that I’ve organized, so that I can keep track of my upcoming games.
- As an organizer, I want to be warned if there is another event going on in the same location and time that I am setting up my event.
- As a player, I want to set a distance limit on game proximities so that I can view games in my nearby area.
- As a player, I want to see a feed of games in my area so that I know which games I could join.
- As a player, I want to filter through games in my feed by skill level and sport type, so that I can join games relevant to me.
- As a player, I want to request to join a game so that I can see the game details.
- As a player, I want to leave a game that I have already joined, so that I no longer receive game details or notifications.
- As a player, I want to see a list of my accepted games, so that I can quickly access game details.
- As a player, I want games I’ve previously attended to no longer show up on my accepted games feed, so that I can clearly keep track of my current events.

### Nice to have:
- As a player, I want to review a game after it ends, so that I can report any issues with the game or other players. 
- As a player, I want to join a pickup game through an invite shared with me by an organizer, so that I can see game details.
- As a player, I want to be notified when one of my friends creates a game visible to me, so that I can join it.
- As an organizer, I want to send notifications to my friends when I create an event, so that they are aware and can join.
- As a player, I want to bring a +1 to a game, so that they can come too while keeping the number of players below maximum capacity.
- As a user, I want to communicate with other accepted users through a game-specific chatroom, so that we can coordinate or discuss the game.
- As an organizer, I want to assign responsibilities to players (for example, providing gear or equipment), so that we can coordinate logistics.
- As an organizer, I want to delegate organizer rights to other users who have joined my game, so that they can edit game details and invite other users.
- As an event organizer, I want the option to either display the location of the game to everyone or only display it to people accepted to the game.
- As an organizer, I want to navigate a map interface of any nearby games with locations visible to me. 
- As an organizer, I want to be rejected from creating an event if there is another game going on at the same time in the same area.

## Software Architecture & Technology Stack
**Type of Application**: Mobile Application

**Architecture**: Expo with React Native

**Front end**: 
- **Framework**: Expo with React Native
- **Navigation**: React Navigation
- **UI library**: Tamagui with NativeWind CSS

**Back end**: 
- **Database and Authentication**: Supabase Database
- **Storage**: Supabase Storage
- **Cloud Functions**: Supabase Cloud Functions

**Deployment**:
- **Distribution**: Expo's tools to build and publish updates to the Apple App Store and Google Play Store
- **CI/CD**: GitHub Actions

**Additional technologies**:
- **Version Control**: Git and GitHub
- **Testing Frameworks**: Jest and Detox

## Similar Existing Apps
- Meetup: While Meetup is broadly focused on creating, finding, and joining all different kinds of events, our app focuses specifically on pick-up games, allowing us to better tailor app features. Meetup also does not allow the same degree of privacy protection and security for groups or events as our app does for games. For example, private Meetup events are still visible to group nonmembers, and some private group details are still visible to all users. Our games’ visibility and privacy settings allow organizers to control who can see a game’s details. Additionally, while Meetup is group- and membership-oriented, our app will allow users to play games with both friends and strangers.
- Facebook Groups: Facebook Groups is focused on creating communities within an area, which could also pertain to local sports (e.g. soccer players of Baltimore, etc.). However, Facebook Groups does not actually streamline the organization of events such as sports games, instead users must communicate solely by making posts and commenting. Users become limited in their abilities to organize games because their posts will always be viewed by the whole group, and sometimes attempts to plan games get buried by other posts, such as memes or general posts about the sport. Additionally, our app being location based would make it more accessible to people who enjoy sports but travel a lot, as they would not have to continually search for the appropriate Facebook Group each time they are in a new location.