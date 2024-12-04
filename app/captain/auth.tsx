import { authStyles } from "@/styles/authStyles";
import { commonStyles } from "@/styles/commonStyles";
import { Image, View, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import { resetAndNavigate } from "@/utils/Helpers";
import CustomText from "@/components/shared/CustomText";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import PhoneInput from "@/components/shared/PhoneInput";
import CustomButton from "@/components/shared/CustomButton";

const CaptainAuth = () => {
  const [phone, setPhone] = useState<string>("");

  const handleSubmit = () => {
    resetAndNavigate("/captain/home");
  };

  return (
    <SafeAreaView style={authStyles.container}>
      <ScrollView contentContainerStyle={authStyles.container}>
        <View style={commonStyles.flexRowBetween}>
          <Image
            source={require("@/assets/images/captain_logo.png")}
            style={authStyles.logo}
          />
          <TouchableOpacity style={authStyles.flexRowGap}>
            <MaterialIcons name="help" size={18} color="grey" />
            <CustomText fontFamily="Medium" variant="h7">
              Help
            </CustomText>
          </TouchableOpacity>
        </View>
        <CustomText fontFamily="Medium" variant="h6">
          Good to see you captain!
        </CustomText>
        <CustomText
          fontFamily="Medium"
          variant="h7"
          style={commonStyles.lightText}
        >
          Enter Your Mobile Number to Proceed
        </CustomText>
        <PhoneInput onChangeText={setPhone} value={phone} />
      </ScrollView>
      <View style={authStyles.footerContainer}>
        <CustomText
          variant="h8"
          fontFamily="Regular"
          style={[
            commonStyles.lightText,
            { textAlign: "center", marginHorizontal: 20 },
          ]}
        >
          By Continuing, You Agree to Our Terms & Conditions and Privacy Policy.
        </CustomText>
        <CustomButton
          title="Next"
          onPress={handleSubmit}
          loading={false}
          disabled={false}
        />
      </View>
    </SafeAreaView>
  );
};

export default CaptainAuth;
