import React from 'react';
import AppNavigation from './navigation/AppNavigation';
import { StatusBar } from 'react-native';
export default function App() {
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <AppNavigation />
    </>
  );
} 