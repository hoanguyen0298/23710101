// TH1 | 23710101 | NGUYEN HONG PHUC | #647760
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from '@contexts/ThemeContext';
import HomeScreen from '@screens/HomeScreen';

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <HomeScreen />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
