import NetInfo from '@react-native-community/netinfo';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { focusManager, onlineManager, QueryClientProvider } from '@tanstack/react-query';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { AppState, Platform, type AppStateStatus } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { useLanguageStore } from '../features/settings/store/languageStore';
import i18n from '../shared/i18n/i18n';
import { colors } from '../shared/theme/tokens';
import { RootNavigator } from './navigation/RootNavigator';
import { queryClient } from './query/queryClient';

const navigationTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.background,
    card: colors.surface,
    primary: colors.primary,
  },
};

export function AppRoot() {
  const locale = useLanguageStore(({ locale: value }) => value);

  useEffect(() => {
    void i18n.changeLanguage(locale);
  }, [locale]);

  useEffect(() => {
    onlineManager.setEventListener((setOnline) =>
      NetInfo.addEventListener((state) => setOnline(Boolean(state.isConnected))),
    );
    const onAppStateChange = (status: AppStateStatus) => {
      if (Platform.OS !== 'web') focusManager.setFocused(status === 'active');
    };
    const subscription = AppState.addEventListener('change', onAppStateChange);
    return () => subscription.remove();
  }, []);

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <NavigationContainer theme={navigationTheme}>
          <StatusBar style="dark" />
          <RootNavigator />
        </NavigationContainer>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
