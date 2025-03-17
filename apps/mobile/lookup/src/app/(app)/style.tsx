import * as React from 'react';

import { Text } from '@/components/ui';
import {
  FocusAwareStatusBar,
  SafeAreaView,
  ScrollView,
} from '@/components/ui2';

export default function Style() {
  return (
    <>
      <FocusAwareStatusBar />
      <ScrollView className="px-4">
        <SafeAreaView className="flex-1">
          <Text>Tickets</Text>
        </SafeAreaView>
      </ScrollView>
    </>
  );
}
