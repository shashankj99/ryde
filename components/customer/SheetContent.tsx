import { uiStyles } from "@/styles/uiStyles";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { View, Text, TouchableOpacity } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import CustomText from "../shared/CustomText";
import { commonStyles } from "@/styles/commonStyles";
import { Image } from "react-native";

const cubes = [
  {
    name: "Bike",
    imgaeUri: require("@/assets/icons/bike.png"),
  },
  {
    name: "Auto",
    imgaeUri: require("@/assets/icons/auto.png"),
  },
  {
    name: "Cab Economy",
    imgaeUri: require("@/assets/icons/cab.png"),
  },
  {
    name: "Parcel",
    imgaeUri: require("@/assets/icons/parcel.png"),
  },
  {
    name: "Cab Premium",
    imgaeUri: require("@/assets/icons/cab_premium.png"),
  },
];

const SheetContent = () => {
  return (
    <View>
      <TouchableOpacity
        style={uiStyles.searchBarContainer}
        onPress={() => router.navigate("/customer/select-location")}
      >
        <Ionicons name="search-outline" size={RFValue(16)} color="black" />
        <CustomText fontFamily="Medium" fontSize={11}>
          Where are you going?
        </CustomText>
      </TouchableOpacity>

      <View style={commonStyles.flexRowBetween}>
        <CustomText fontFamily="Medium" fontSize={11}>
          Explore
        </CustomText>

        <TouchableOpacity style={commonStyles.flexRow}>
          <CustomText fontFamily="Regular" fontSize={10}>
            View All
          </CustomText>
          <Ionicons name="chevron-forward" size={RFValue(14)} color={"black"} />
        </TouchableOpacity>
      </View>
      <View style={uiStyles.cubes}>
        {cubes?.slice(0, 4).map((c) => (
          <TouchableOpacity
            key={c.name}
            style={uiStyles.cubeContainer}
            onPress={() => router.navigate("/customer/select-location")}
          >
            <View style={uiStyles.cubeIconContainer}>
              <Image
                source={c.imgaeUri}
                resizeMode="contain"
                style={uiStyles.cubeIcon}
              />
            </View>
            <CustomText fontFamily="Medium" fontSize={9.5}>
              {c.name}
            </CustomText>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default SheetContent;
<Text>SheetContent</Text>;
