import React from "react";
import CustomText from "./CustomText";
import { StyleSheet, TextInput, View } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

const PhoneInput: React.FC<PhoneInputProps> = ({ onChangeText, value }) => {
  return (
    <View style={styles.contatiner}>
      <CustomText fontFamily="Medium" style={styles.text}>
        🇳🇵 +977
      </CustomText>
      <TextInput
        placeholder="98xxxxxxxx"
        placeholderTextColor={"#ccc"}
        maxLength={10}
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        keyboardType="phone-pad"
      />
    </View>
  );
};

export default PhoneInput;

const styles = StyleSheet.create({
  contatiner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginVertical: 15,
    borderWidth: 1,
    borderColor: "#222",
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  input: {
    fontSize: RFValue(13),
    fontFamily: "Medium",
    height: 45,
    width: "90%",
  },
  text: {
    fontSize: RFValue(13),
    top: -1,
  },
});
