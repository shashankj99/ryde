import { Colors } from "@/utils/Constants";
import React, { FC } from "react";
import { StyleSheet, Text } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

const FONT_SIZES = {
  h1: 24,
  h2: 22,
  h3: 20,
  h4: 18,
  h5: 16,
  h6: 14,
  h7: 10,
  h8: 9,
};

const CustomText: FC<CustomTextProps> = ({
  children,
  style,
  numberOfLines,
  fontSize,
  fontFamily = "Regular",
  variant = "h6",
}) => {
  return (
    <Text
      style={[
        styles.text,
        {
          fontSize: RFValue(fontSize ? fontSize : FONT_SIZES[variant]),
          fontFamily: `NotoSans-${fontFamily}`,
        },
        style,
      ]}
      numberOfLines={numberOfLines}
    >
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  text: { color: Colors.text, textAlign: "left" },
});

export default CustomText;
