import { commonStyles } from "@/styles/commonStyles";
import { splashStyles } from "@/styles/splashStyles";
import { View, Image, Alert } from "react-native";
import { useFonts } from "expo-font";
import { useEffect, useState } from "react";
import { resetAndNavigate } from "@/utils/Helpers";
import { tokenStorage } from "@/store/storage";
import { jwtDecode } from "jwt-decode";
import { logout } from "@/service/auth-service";
import { refreshTokens } from "@/service/api-interceptor";
import { useUserStore } from "@/store/userStore";

interface DecodedToken {
  exp: number;
}

export default function Main() {
  const [loaded] = useFonts({
    Bold: require("@/assets/fonts/NotoSans-Bold.ttf"),
    SemiBold: require("@/assets/fonts/NotoSans-SemiBold.ttf"),
    Regular: require("@/assets/fonts/NotoSans-Regular.ttf"),
    Medium: require("@/assets/fonts/NotoSans-Medium.ttf"),
    Light: require("@/assets/fonts/NotoSans-Light.ttf"),
  });

  const { user } = useUserStore();

  const [hasNavigated, setHasNavigated] = useState(false);

  const tokenCheck = async () => {
    const [accessToken, refreshToken] = await Promise.all([
      tokenStorage.getItem("access_token"),
      tokenStorage.getItem("refresh_token"),
    ]);
    if (accessToken && refreshToken) {
      const decodedAccessToken = jwtDecode<DecodedToken>(accessToken);
      const decodedRefreshToken = jwtDecode<DecodedToken>(refreshToken);
      const currentTime = Date.now() / 1000;

      if (decodedRefreshToken.exp < currentTime) {
        logout();
        Alert.alert("Session expired! Please Log in to continue.");
      }

      if (decodedAccessToken.exp < currentTime) {
        try {
          await refreshTokens();
        } catch (error) {
          Alert.alert("ERROR REFRESING TOKEN");
        }
      }

      if (user) {
        resetAndNavigate("/customer/home");
      } else {
        resetAndNavigate("/captain/home");
      }

      return;
    }

    resetAndNavigate("/role");
  };

  useEffect(() => {
    if (loaded && !hasNavigated) {
      const timeout = setTimeout(async () => {
        await tokenCheck();
        setHasNavigated(true);
      }, 1000);
      return () => clearTimeout(timeout);
    }
  }, [loaded, hasNavigated]);

  return (
    <View style={commonStyles.container}>
      <Image
        source={require("@/assets/images/logo_t.png")}
        style={splashStyles.img}
      />
    </View>
  );
}
