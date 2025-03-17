import { FlashList } from '@shopify/flash-list';
import React from 'react';
import { View } from 'react-native';

import { type Post, usePosts } from 'lookup/src/api';
import { PostCard } from '@/components/card';
import { EmptyList, FocusAwareStatusBar, Text } from '@/components/ui2';

export default function Feed() {
  const { data, isPending, isError } = usePosts();
  const renderItem = React.useCallback(
    ({ item }: { item: Post; }) => <PostCard {...item} />,
    []
  );

  if (isError) {
    return (
      <View>
        <Text> Error Loading data </Text>
      </View>
    );
  }
  return (
    <View className="flex-1 ">
      <FocusAwareStatusBar />
      <FlashList
        data={data}
        renderItem={renderItem}
        keyExtractor={(_, index) => `item-${index}`}
        ListEmptyComponent={<EmptyList isLoading={isPending} />}
        estimatedItemSize={300}
      />
    </View>
  );
}
