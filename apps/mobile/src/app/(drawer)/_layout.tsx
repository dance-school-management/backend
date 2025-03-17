import { StyleSheet } from "react-native";
import React, { useEffect } from "react";
import { Drawer } from "expo-router/drawer";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import {
  HomeIcon,
  TicketsIcon,
  CalendarIcon,
  ChartColumnIcon,
  NotebookTextIcon
} from "lucide-react-native";
import { router, usePathname } from "expo-router";

import { Button, Text, View } from "@/components/ui";

const CustomDrawerContent = (props) => {
  const pathname = usePathname();

  useEffect(() => {
    console.log(pathname);
  }, [pathname]);

  return (
    <DrawerContentScrollView {...props}>
      <View style={styles.userInfoWrapper}>
        {/* <Image
          source={{ uri: "https://randomuser.me/api/portraits/women/26.jpg" }}
          width={80}
          height={80}
          style={styles.userImg}
        /> */}
        <View style={styles.userDetailsWrapper}>
          <Text style={styles.userName}>John Doe</Text>
          <Text style={styles.userEmail}>john@email.com</Text>
          <Button
            onPress={() => {
              router.push("/");
            }}><Text>Logout</Text></Button>
        </View>
      </View>
      <DrawerItem
        icon={({ size }) => (
          <HomeIcon
            size={size}
            color={pathname == "/feed" ? "#fff" : "#000"}
          />
        )}
        label="Home"
        labelStyle={[
          styles.navItemLabel,
          { color: pathname == "/feed" ? "#fff" : "#000" },
        ]}
        style={{ backgroundColor: pathname == "/feed" ? "#333" : "#fff" }}
        onPress={() => {
          router.push("/(drawer)/(tabs)/feed");
        }}
      />
      <DrawerItem
        icon={({ size }) => (
          <TicketsIcon
            size={size}
            color={pathname == "/tickets" ? "#fff" : "#000"}
          />
        )}
        label="My Tickets"
        labelStyle={[
          styles.navItemLabel,
          { color: pathname == "/tickets" ? "#fff" : "#000" },
        ]}
        style={{ backgroundColor: pathname == "/tickets" ? "#333" : "#fff" }}
        onPress={() => {
          router.push("/(drawer)/(tabs)/tickets");
        }}
      />
      <DrawerItem
        icon={({ color, size }) => (
          <CalendarIcon
            size={size}
            color={pathname == "/schedule" ? "#fff" : "#000"}
          />
        )}
        label={"Schedule"}
        labelStyle={[
          styles.navItemLabel,
          { color: pathname == "/schedule" ? "#fff" : "#000" },
        ]}
        style={{ backgroundColor: pathname == "/schedule" ? "#333" : "#fff" }}
        onPress={() => {
          router.push("/schedule");
        }}
      />
      <DrawerItem
        icon={({ size }) => (
          <ChartColumnIcon
            size={size}
            color={pathname == "/progress" ? "#fff" : "#000"}
          />
        )}
        label={"My progress"}
        labelStyle={[
          styles.navItemLabel,
          { color: pathname == "/progress" ? "#fff" : "#000" },
        ]}
        style={{ backgroundColor: pathname == "/progress" ? "#333" : "#fff" }}
        onPress={() => {
          router.push("/progress");
        }}
      />
      <DrawerItem
        icon={({ size }) => (
          <NotebookTextIcon
            size={size}
            color={pathname == "/contact" ? "#fff" : "#000"}
          />
        )}
        label={"Contact"}
        labelStyle={[
          styles.navItemLabel,
          { color: pathname == "/contact" ? "#fff" : "#000" },
        ]}
        style={{ backgroundColor: pathname == "/contact" ? "#333" : "#fff" }}
        onPress={() => {
          router.push("/contact");
        }}
      />
    </DrawerContentScrollView>
  );
};

export default function Layout() {
  return (
    <Drawer drawerContent={(props) => <CustomDrawerContent {...props} />} screenOptions={{ headerShown: false }}>
      <Drawer.Screen name="schedule" options={{ headerShown: true }} />
      <Drawer.Screen name="settings" options={{ headerShown: true }} />
      <Drawer.Screen name="progress" options={{ headerShown: true }} />
      <Drawer.Screen name="contact" options={{ headerShown: true }} />
      <Drawer.Screen name="tickets" options={{ headerShown: true }} />
    </Drawer>
  );
}

const styles = StyleSheet.create({
  navItemLabel: {
    fontSize: 18,
  },
  userInfoWrapper: {
    flexDirection: "row",
    paddingHorizontal: 10,
    paddingVertical: 20,
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
    marginBottom: 10,
  },
  userImg: {
    borderRadius: 40,
  },
  userDetailsWrapper: {
    marginTop: 25,
    marginLeft: 10,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  userEmail: {
    fontSize: 16,
    fontStyle: 'italic',
    textDecorationLine: 'underline',
  }
});
