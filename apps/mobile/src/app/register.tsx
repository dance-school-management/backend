import { Link } from 'expo-router';
import React from 'react';
import { Button, Text, View } from 'react-native';

export default function Page() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 30 }}>Register Form</Text>
      <Link href={'/'} asChild>
        <Button title="Login" />
      </Link>
      <Link href={'/(drawer)/(tabs)/feed'} asChild>
        <Button title="Go to App" />
      </Link>
    </View>
  );
}
