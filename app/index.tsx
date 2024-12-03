import { commonStyles } from "@/styles/commonStyles";
import { splashStyles } from "@/styles/splashStyles";
import { View, Image } from "react-native";
import { useFonts } from "expo-font";
import { useEffect, useState } from "react";
import { resetAndNavigate } from "@/utils/Helpers";

export default function Main() {
  const [loaded] = useFonts({
    Bold: require("@/assets/fonts/NotoSans-Bold.ttf"),
    SemiBold: require("@/assets/fonts/NotoSans-SemiBold.ttf"),
    Regular: require("@/assets/fonts/NotoSans-Regular.ttf"),
    Medium: require("@/assets/fonts/NotoSans-Medium.ttf"),
    Light: require("@/assets/fonts/NotoSans-Light.ttf"),
  });

  const [hasNavigated, setHasNavigated] = useState(false);

  const tokenCheck = async () => resetAndNavigate("/role");

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
