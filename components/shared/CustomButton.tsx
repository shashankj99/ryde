import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { Colors } from "@/utils/Constants";
import CustomText from "./CustomText";
import { RFValue } from "react-native-responsive-fontsize";

const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  disabled,
  loading,
  onPress,
}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.8}
        style={[
          styles.container,
          {
            backgroundColor: disabled ? Colors.secondary : Colors.text,
          },
        ]}
      >
        {loading ? (
          <ActivityIndicator color={Colors.primary} size={"small"} />
        ) : (
          <CustomText
            fontFamily="SemiBold"
            style={{
              fontSize: RFValue(12),
              color: disabled ? Colors.background : Colors.primary,
            }}
          >
            {title}
          </CustomText>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default CustomButton;

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    margin: 10,
    padding: 10,
    height: 45,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
});
