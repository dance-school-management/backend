import { Link } from 'expo-router';
import React from 'react';
import { Button, Text, View } from 'react-native';

export default function Page() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 30 }}>Login Form</Text>
      <Link href={'/register'} asChild>
        <Button title="Register" />
      </Link>
      <Link href={'/(drawer)/(tabs)/feed'} asChild>
        <Button title="Go to App" />
      </Link>
    </View>
  );
}
