import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import "@/global.css";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { AuthProvider } from '../contexts/AuthContext.js';

import { useColorScheme } from '@/hooks/useColorScheme';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <AuthProvider>
    <GluestackUIProvider mode="light">
    <ThemeProvider value={colorScheme != 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
        <Stack.Screen name="index" options={{ headerShown:false }} />
        <Stack.Screen name="station/[id]" options={{ headerShown:false}} />
        <Stack.Screen name="vendor/[vendor_id]" options={{ headerShown:false}} />
        <Stack.Screen name="vndor_cardlog/[vendor_card_login]" options={{ headerShown:false}} />
        <Stack.Screen name="Login_page" options={{ headerShown:false}} />
        <Stack.Screen name="cities" options={{ headerShown:false}} />
        <Stack.Screen name="Admin" options={{ headerShown:false}} />
        <Stack.Screen name="Approval" options={{ headerShown:false}} />
        <Stack.Screen name="city/[city_id]" options={{ headerShown:false}} />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
      </GluestackUIProvider>
      </AuthProvider>
  );
}
