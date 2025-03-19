import { useRouter } from 'expo-router';
import {
  ChevronRight,
  Home,
  LogOut,
  type LucideIcon,
  PhoneIcon,
  ShoppingCart,
  StarIcon,
  User,
  Wallet,
} from 'lucide-react-native';
import React from 'react';
import { Drawer } from 'react-native-drawer-layout';

import {
  Avatar,
  AvatarFallbackText,
  AvatarImage,
  Button,
  ButtonIcon,
  ButtonText,
  Text,
  VStack,
} from './ui';

interface DrawerButtonProps {
  icon: LucideIcon;
  text: string;
  onClick?: () => void;
}

export function GlobalDrawer({ children }: { children: React.ReactNode; }) {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();

  const DrawerButton = ({ icon, text, onClick }: DrawerButtonProps) => (
    <Button
      className="w-full rounded-md p-2"
      onPress={() => {
        onClick?.();
        setOpen(false);
      }}
    >
      <ButtonIcon className="px-4" as={icon} size="lg" />
      <ButtonText className="flex-1">{text}</ButtonText>
      <ButtonIcon as={ChevronRight} size="lg" />
    </Button>
  );

  const DrawerContent = () => (
    <VStack className="flex-1 p-4">
      <VStack className="mt-8 flex-col items-center gap-2 p-4">
        <Avatar size="xl">
          <AvatarFallbackText>User Image</AvatarFallbackText>
          <AvatarImage
            source={{
              uri: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80',
            }}
          />
        </Avatar>
        <Text size="xl">Eva Eshkere</Text>
        <Text size="sm">eshkere@gmail.com</Text>
      </VStack>
      <VStack className="flex-1">
        <VStack className="w-full flex-1 items-center gap-2">
          <DrawerButton
            icon={User}
            onClick={() => router.push('/settings/profile')}
            text="My Profile"
          />
          <DrawerButton icon={Home} text="Saved Address" />
          <DrawerButton icon={ShoppingCart} text="Orders" />
          <DrawerButton icon={Wallet} text="Saved Cards" />
          <DrawerButton icon={StarIcon} text="Review App" />
          <DrawerButton icon={PhoneIcon} text="Contact Us" />
          <VStack className="flex-1" />
          <DrawerButton
            icon={LogOut}
            text="Logout"
            onClick={() => console.log('Logging out...')}
          />
        </VStack>
      </VStack>
    </VStack>
  );

  return (
    <Drawer
      overlayStyle={{ flex: 1 }}
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      drawerStyle={{ backgroundColor: 'black', padding: 4 }}
      renderDrawerContent={() => <DrawerContent />}
    >
      {children}
    </Drawer>
  );
}
