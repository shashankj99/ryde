import CustomText from "@/components/shared/CustomText";
import { roleStyles } from "@/styles/roleStyles";
import { router } from "expo-router";
import { View, Image, TouchableOpacity } from "react-native";

const Role = () => {
  const handlePress = (role: string) => {
    if (role === "customer") {
      router.navigate("/customer/auth");
    } else {
      router.navigate("/captain/auth");
    }
  };

  return (
    <View style={roleStyles.container}>
      <Image
        source={require("@/assets/images/logo_t.png")}
        style={roleStyles.logo}
      />
      <CustomText fontFamily="Medium" variant="h6">
        Choose Your User Type
      </CustomText>
      <TouchableOpacity
        style={roleStyles.card}
        onPress={() => handlePress("customer")}
      >
        <Image
          source={require("@/assets/images/customer.png")}
          style={roleStyles.image}
        />
        <View style={roleStyles.cardContent}>
          <CustomText style={roleStyles.title}>Customer</CustomText>
          <CustomText style={roleStyles.description}>
            Are you a customer? Order rides & deliveries easily.
          </CustomText>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        style={roleStyles.card}
        onPress={() => handlePress("captain")}
      >
        <Image
          source={require("@/assets/images/captain.png")}
          style={roleStyles.image}
        />
        <View style={roleStyles.cardContent}>
          <CustomText style={roleStyles.title}>Captain</CustomText>
          <CustomText style={roleStyles.description}>
            Are you a captain? Join us to drive & deliver.
          </CustomText>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default Role;
