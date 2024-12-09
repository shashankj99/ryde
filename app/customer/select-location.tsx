import Ionicons from "@expo/vector-icons/Ionicons";
import CustomText from "@/components/shared/CustomText";
import LocationInput from "@/components/customer/LocationInput";
import { commonStyles } from "@/styles/commonStyles";
import { homeStyles } from "@/styles/homeStyles";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "@/utils/Constants";
import { uiStyles } from "@/styles/uiStyles";
import { useState } from "react";
import { getPlacesSuggestions } from "@/utils/mapUtils";

const SelectLocation = () => {
  const [pickup, setPickup] = useState<string>("");
  const [drop, setDrop] = useState<string>("");
  const [pickupCoords, setPickupCoords] = useState<any>(null);
  const [dropCoords, setDropCoords] = useState<any>(null);
  const [location, SelectLocation] = useState([]);
  const [focusedInput, setFocusedInput] = useState<string>("drop");

  const fetchLocations = async (query: string) => {
    if (query?.length > 4) {
      const data = await getPlacesSuggestions(query);
      SelectLocation(data);
    }
  };

  return (
    <View style={homeStyles.container}>
      <StatusBar
        style="light"
        backgroundColor={Colors.text}
        translucent={false}
      />
      <SafeAreaView />
      <TouchableOpacity
        style={commonStyles.flexRow}
        onPress={() => router.back()}
      >
        <Ionicons
          name="chevron-back"
          size={RFValue(18)}
          color={Colors.iosColor}
        />
        <CustomText fontFamily="Regular" style={{ color: Colors.iosColor }}>
          Back
        </CustomText>
      </TouchableOpacity>
      <View style={uiStyles.locationInputs}>
        <LocationInput
          placeholder="Search Pickup Location"
          type="pickup"
          value={pickup}
          onChangeText={(text) => {
            setPickup(text);
            fetchLocations(text);
          }}
          onFocus={() => setFocusedInput("pickup")}
        />
        <LocationInput
          placeholder="Search Drop Location"
          type="drop"
          value={drop}
          onChangeText={(text) => {
            setDrop(text);
            fetchLocations(text);
          }}
          onFocus={() => setFocusedInput("drop")}
        />
        <CustomText
          fontFamily="Medium"
          fontSize={10}
          style={uiStyles.suggestionText}
        >
          {focusedInput} suggestions
        </CustomText>
      </View>
    </View>
  );
};

export default SelectLocation;

const styles = StyleSheet.create({});
