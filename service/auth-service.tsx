import axios from "axios";
import { useCaptainStore } from "@/store/captainStore";
import { tokenStorage } from "@/store/storage";
import { useUserStore } from "@/store/userStore";
import { resetAndNavigate } from "@/utils/Helpers";
import { Alert } from "react-native";
import { BASE_URL } from "./config";

export const login = async (
  payload: {
    role: "customer" | "captain";
    phone: string;
  },
  updateAccessToken: () => void
) => {
  const { setUser } = useUserStore.getState();
  const { setUser: setCaptainUser } = useCaptainStore.getState();

  try {
    const response = await axios.post(`${BASE_URL}/auth/signin`, payload);
    await Promise.all([
      tokenStorage.setItem("access_token", response.data.access_token),
      tokenStorage.setItem("refresh_token", response.data.refresh_token),
    ]);
    if (response.data.user.role === "customer") {
      setUser(response.data.user);
      resetAndNavigate("/customer/home");
    } else {
      setCaptainUser(response.data.user);
      resetAndNavigate("/captain/home");
    }
    updateAccessToken();
  } catch (error: any) {
    Alert.alert("error", error.response?.data?.msg ?? "Error Logging in...");
  }
};

export const logout = async () => {
  const { clearData } = useUserStore.getState();
  const { clearCaptainData } = useCaptainStore.getState();

  await tokenStorage.clearAll();
  clearData();
  clearCaptainData();
  resetAndNavigate("/role");
};
