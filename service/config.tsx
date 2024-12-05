import { Platform } from "react-native";

export const BASE_URL = "http://192.168.1.69:3000";

export const SOCKET_URL =
  Platform.OS === "ios" ? "ws://192.168.1.69:3000" : "http://10.0.2.2:3000";
