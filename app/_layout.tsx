import { WSProvider } from "@/service/ws-provider";
import { Stack } from "expo-router";
import { gestureHandlerRootHOC } from "react-native-gesture-handler";

const Layout = () => {
  return (
    <WSProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="role" />
        <Stack.Screen name="customer/auth" />
        <Stack.Screen name="customer/home" />
        <Stack.Screen name="customer/select-location" />
        <Stack.Screen name="captain/auth" />
        <Stack.Screen name="captain/home" />
      </Stack>
    </WSProvider>
  );
};

export default gestureHandlerRootHOC(Layout);
