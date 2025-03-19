import React from 'react';
import { Tabs } from 'expo-router';
import { HomeIcon, TicketsIcon, CalendarIcon, BellIcon } from 'lucide-react-native';
import { DrawerToggleButton } from '@react-navigation/drawer';

export default function _layout() {
  return (
    <Tabs screenOptions={{ headerLeft: () => <DrawerToggleButton tintColor='#000' />, headerRight: () => <BellIcon style={{ marginRight: 8 }} size={24} color='#000' /> }}>
      <Tabs.Screen name='feed' options={{
        tabBarIcon: ({ color }) => (
          <HomeIcon size={24} color={color} />
        ),
        tabBarLabel: 'Home',
        headerTitle: 'Home',
      }} />
      <Tabs.Screen name='tickets' options={{
        tabBarIcon: ({ color }) => (
          <TicketsIcon size={24} color={color} />
        ),
        tabBarLabel: 'My Tickets',
        headerTitle: 'My Tickets'
      }} />
      <Tabs.Screen name='schedule' options={{
        tabBarIcon: ({ color }) => (
          <CalendarIcon size={24} color={color} />
        ),
        tabBarLabel: 'Schedule',
        headerTitle: 'Schedule'
      }} />
    </Tabs>
  );
}