import { commonStyles } from "@/styles/commonStyles";
import { locationStyles } from "@/styles/locationStyles";
import { uiStyles } from "@/styles/uiStyles";
import { FC } from "react";
import { Image, TouchableOpacity, View } from "react-native";
import CustomText from "../shared/CustomText";
import { MapItem } from "@/utils/types";

const LocationItem: FC<{
  item: MapItem;
  onPress: () => void;
}> = ({ item, onPress }) => {
  return (
    <TouchableOpacity
      style={[commonStyles.flexRowBetween, locationStyles.container]}
      onPress={onPress}
    >
      <View style={[commonStyles.flexRow, { width: "90%" }]}>
        <Image
          source={require("@/assets/icons/map_pin2.png")}
          style={uiStyles.mapPinIcon}
        />
        <CustomText fontFamily="Medium" fontSize={12}>
          {item.title}
        </CustomText>
      </View>
    </TouchableOpacity>
  );
};

export default LocationItem;
