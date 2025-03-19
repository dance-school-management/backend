/* eslint-disable react/no-unstable-nested-components */
import { DrawerToggleButton } from '@react-navigation/drawer';
import { Link, Redirect, SplashScreen, Tabs } from 'expo-router';
import { Calendar, TicketsIcon } from 'lucide-react-native';
import React, { useCallback, useEffect } from 'react';

import { Pressable } from '@/components/ui/pressable';
import { Text } from '@/components/ui/text';
import { Home as HomeIcon } from '@/components/ui2/icons';
import { useAuth, useIsFirstTime } from '@/lib';

export default function TabLayout() {
  const status = useAuth.use.status();
  const [isFirstTime] = useIsFirstTime();
  const hideSplash = useCallback(async () => {
    await SplashScreen.hideAsync();
  }, []);
  useEffect(() => {
    if (status !== 'idle') {
      setTimeout(() => {
        hideSplash();
      }, 1000);
    }
  }, [hideSplash, status]);

  if (isFirstTime) {
    return <Redirect href="/onboarding" />;
  }
  if (status === 'signOut') {
    return <Redirect href="/login" />;
  }
  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarLabelPosition: 'beside-icon',
        tabBarItemStyle: {
          margin: 0,
          padding: 0,
        },
        tabBarStyle: {
          height: 70,
          paddingVertical: 0,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <HomeIcon color={color} />,
          headerRight: () => <CreateNewPostLink />,
          headerLeft: () => <DrawerToggleButton tintColor="white" />,
          tabBarButtonTestID: 'feed-tab',
        }}
      />
      <Tabs.Screen
        name="style"
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => <TicketsIcon color={color} />,
          tabBarButtonTestID: 'style-tab',
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => <Calendar color={color} />,
          tabBarButtonTestID: 'settings-tab',
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{ href: null, headerShown: false }}
      />
    </Tabs>
  );
}

const CreateNewPostLink = () => {
  return (
    <Link href="/feed/add-post" asChild>
      <Pressable>
        <Text className="px-3 text-primary-300">Create</Text>
      </Pressable>
    </Link>
  );
};
