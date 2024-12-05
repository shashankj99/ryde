import { useWS } from "@/service/ws-provider";
import { useUserStore } from "@/store/userStore";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { uiStyles } from "@/styles/uiStyles";
import { SafeAreaView } from "react-native-safe-area-context";
import { RFValue } from "react-native-responsive-fontsize";
import { Colors } from "@/utils/Constants";
import IonIcons from "@expo/vector-icons/Ionicons";
import CustomText from "../shared/CustomText";
import { router } from "expo-router";

const LocationBar = () => {
  const { location } = useUserStore();
  const { disconnect } = useWS();
  return (
    <View style={uiStyles.absoluteTop}>
      <SafeAreaView>
        <View style={uiStyles.container}>
          <TouchableOpacity>
            <IonIcons
              name="menu-outline"
              size={RFValue(18)}
              color={Colors.text}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={uiStyles.locationBar}
            onPress={() => router.navigate("/customer/select-location")}
          >
            <View style={uiStyles.dot} />
            <CustomText numberOfLines={1} style={uiStyles.locationText}>
              {location?.address || "Getting address..."}
            </CustomText>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default LocationBar;

const styles = StyleSheet.create({});
