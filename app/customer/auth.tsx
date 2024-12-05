import { authStyles } from "@/styles/authStyles";
import { commonStyles } from "@/styles/commonStyles";
import { Image, View, ScrollView, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import { login } from "@/service/auth-service";
import { useWS } from "@/service/ws-provider";
import CustomText from "@/components/shared/CustomText";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import PhoneInput from "@/components/shared/PhoneInput";
import CustomButton from "@/components/shared/CustomButton";

const CustomerAuth = () => {
  const { updateAccessToken } = useWS();
  const [phone, setPhone] = useState<string>("");

  const handleSubmit = () => {
    if (!phone) {
      Alert.alert("error", "Please enter a phone number");
      return;
    }

    if (phone.length !== 10) {
      Alert.alert("error", "Phone number should be 10 digits long");
      return;
    }

    login({ role: "customer", phone }, updateAccessToken);
  };

  return (
    <SafeAreaView style={authStyles.container}>
      <ScrollView contentContainerStyle={authStyles.container}>
        <View style={commonStyles.flexRowBetween}>
          <Image
            source={require("@/assets/images/logo_t.png")}
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
          Get Started!
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

export default CustomerAuth;
