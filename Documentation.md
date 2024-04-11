# Technical Documentation

## Introduction

### 1.1 Purpose
It can be difficult for people to organize future pick-up games or find live pick-up games. Organizers must communicate and coordinate with players through traditional methods such as texting, while players must have prior connections or friends or physically see the pick-up game in order to know it is happening.

Our app allows users to organize, find, and join pick-up games in a convenient and streamlined manner. Users have access to nearby games that fit their skill level and match the desired sport, while organizers can share and coordinate games with their friends or anyone nearby. Organizers can control game visibility (public vs. private), accept or reject user requests to join a game, and invite specific users to join, allowing full control over who has access to the game location and details. Organizers can coordinate user responsibilities for bringing gear, equipment, and more. Users can add friends and communicate easily with each other through game-specific chatrooms.

### 1.2 Scope

### 1.3 Audience
Our potential users include individuals who organize or want to organize pick-up games with their friends, as well as individuals looking to find and join pick-up games easily.

## System Overview

### 2.1 Architecture
Our app utilizes the client-server architecture, where the client (or frontend) provides the UI and allows the user to interact with the app, and the server (or backend) receives and processes requests from the client. We use Expo with React Native for the frontend, and Supabase for the backend.

### 2.2 Technologies Used
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

### 2.3 Dependencies
**Development**:
- @babel/runtime: ^7.23.9
- @testing-library/jest-dom: ^6.4.2
- jest-expo: ~50.0.3

**Expo SDK**:
- expo: ^50.0.14
- expo-app-loading: ^2.1.1
- expo-dev-client: ~3.3.11
- expo-font: ~11.10.3
- expo-image-picker: ~14.7.1
- expo-location: ^16.5.5
- expo-status-bar: ~1.11.1
- expo-updates: ^0.24.11

**React Native**:
- react: 18.2.0
- react-native: 0.73.6
- react-native-community/datetimepicker: ^7.6.2
- react-native-reanimated: ~3.6.3
- react-native-safe-area-context: 4.8.2
- react-native-screens: ~3.29.0
- react-native-svg: ^14.1.0
- react-native-url-polyfill: ^2.0.0
- @react-navigation/bottom-tabs: ^6.5.14
- @react-navigation/native: ^6.1.12
- @react-navigation/native-stack: ^6.9.20
- react-native-css-interop: ^0.0.34
- react-native-elements: ^3.4.3

**Supabase**:
- @supabase/supabase-js: ^2.39.7

**Upstash Redis**:
- @upstash/redis: ^1.29.0

**State Management**:
- zustand: ^4.5.1
- immer: ^10.0.3

**Tamagui**:
- @tamagui/card: ^1.90.9
- @tamagui/config: ^1.90.7
- @tamagui/font-inter: ^1.90.7
- @tamagui/lucide-icons: ^1.90.7
- @tamagui/slider: ^1.91.4
- @tamagui/toast: ^1.90.7

**Other**:
- burnt: ^0.12.2
- nativewind: ^4.0.36

## Installation Guide

### 3.1 Prerequisites

### 3.2 System Requirements

### 3.3 Installation Steps

## Configuration Guide

### 4.1 Configuration Parameters

### 4.2 Environment Setup

### 4.3 External Services Integration

## Usage Guide

### 5.1 User Interface Overview

### 5.2 User Authentication
Our app uses Supabase to authenticate and authorize our users. Users may register by entering an email, password, and unique username. They must click on the confirmation link sent to their email address. Users can sign in using their email and password.

### 5.3 Core Functionality

### 5.4 Advanced Features

### 5.5 Troubleshooting

## API Documentation

### 6.1 Endpoints

### 6.2 Request and Response Formats

### 6.3 Authentication and Authorization

## Database Schema

### 7.1 Entity-Relationship Diagram

### 7.2 Table Definitions

- `profiles`: contains publicly accessible profile information for each user. 

- `sports`: contains publicly accessible sports information for each user. Users may add multiple sports to their profile. 

- `games`: contains game information (except location and address) and visibility status for each created game.

- `game_locations`: contains game location and address location for each created game.

- `game_requests`: contains player join requests for each game.

- `joined_game`: contains joined players for each game.

- `friends`: contains all friend relationships between users.

- `friend_requests`: contains friend requests between players.

- `messages`: contains chatroom messages for each game chatroom.

### 7.3 Relationships and Constraints

## Testing

### 8.1 Test Plan

### 8.2 Test Cases

### 8.3 Test Results

## Deployment

### 9.1 Deployment Process

### 9.2 Release Notes

### 9.3 Known Issues and Limitations

## Support and Maintenance

### 10.1 Troubleshooting Guide

### 10.2 Frequently Asked Questions (FAQs)

### 10.3 Contact Information

## Change Log

### 11.1 Version History

### 11.2 Change Summary

## Glossary

### 12.1 Terms and Definitions