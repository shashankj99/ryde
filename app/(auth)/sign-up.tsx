import CustomButton from "@/components/CustomButton";
import InputField from "@/components/InputField";
import OAuth from "@/components/OAuth";
import Modal from "react-native-modal";
import { icons, images } from "@/constants";
import { useSignUp } from "@clerk/clerk-expo";
import { Link, router } from "expo-router";
import { useState } from "react";
import { Alert, Image, ScrollView, Text, View } from "react-native";

export default function SignUp() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const [showSuccesModal, setShowSuccessModal] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [verification, setVerificattion] = useState({
    state: "default",
    error: "",
    code: "",
  });

  async function onSignUpPress() {
    if (!isLoaded) return;

    try {
      await signUp.create({
        emailAddress: form.email,
        password: form.password,
      });

      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setVerificattion({
        ...verification,
        state: "pending",
      });
      setShowVerificationModal(true);
    } catch (err: any) {
      console.log(err.errors);
      Alert.alert("error", err.errors[0].longMessage);
    }
  }

  async function onPressVerify() {
    if (!isLoaded) return;

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code: verification.code,
      });

      if (completeSignUp.status === "complete") {
        setShowVerificationModal(false);
        await setActive({ session: completeSignUp.createdSessionId });
        setVerificattion({ ...verification, state: "success" });
        setShowSuccessModal(true);
      } else {
        setVerificattion({
          ...verification,
          state: "failed",
          error: "Verification Failed",
        });
      }
    } catch (err: any) {
      setVerificattion({
        ...verification,
        state: "failed",
        error: err.errors[0].longMessage,
      });
    }
  }

  return (
    <ScrollView
      className="flex-1 bg-white"
      scrollEnabled={!showVerificationModal && !showSuccesModal}
    >
      <View className="flex-1 bg-white">
        <View className="relative w-full h-[250px]">
          <Image source={images.signUpCar} className="z-0 w-full h-[250px]" />
          <Text className="text-2xl text-black font-JakartaSemiBold absolute bottom-5 left-5">
            Create Your Account
          </Text>
        </View>
        <View className="p-5">
          <InputField
            label="Name"
            placeholder="Enter your name"
            icon={icons.person}
            value={form.name}
            onChangeText={(value) => setForm({ ...form, name: value })}
          />
          <InputField
            label="Email"
            placeholder="Enter your email"
            icon={icons.email}
            value={form.email}
            onChangeText={(value) => setForm({ ...form, email: value })}
            keyboardType="email-address"
          />
          <InputField
            label="Password"
            placeholder="Enter your password"
            icon={icons.lock}
            value={form.password}
            secureTextEntry={true}
            onChangeText={(value) => setForm({ ...form, password: value })}
          />
          <CustomButton
            title="Sign Up"
            onPress={onSignUpPress}
            className="mt-6"
          />
          <OAuth />
          <Link
            href={"/sign-in"}
            className="text-lg text-center text-general-200 mt-10"
          >
            <Text>Already have an account? </Text>
            <Text className="text-primary-500">Log In</Text>
          </Link>
          <Modal
            isVisible={showVerificationModal}
            onBackdropPress={() => setShowVerificationModal(false)}
          >
            <View className="bg-white px-7 py-9 rounded-2xl min-h-[300px]">
              <Text className="text-2xl font-JakartaBold mb-2">
                Verification
              </Text>
              <Text className="font-Jakarta mb-5">
                We've sent a verification code to {form.email}
              </Text>
              <InputField
                label="Code"
                icon={icons.lock}
                placeholder="12345"
                value={verification.code}
                keyboardType="numeric"
                onChangeText={(code) =>
                  setVerificattion({ ...verification, code })
                }
              />

              {verification.error && (
                <Text className="text-red-500 text-sm mt-1">
                  {verification.error}
                </Text>
              )}

              <CustomButton
                title="Verify Email"
                className="mt-5"
                onPress={onPressVerify}
                bgVariant="success"
              />
            </View>
          </Modal>
          <Modal isVisible={showSuccesModal}>
            <View className="bg-white px-7 py-9 rounded-2xl min-h-[300px]">
              <Image
                source={images.check}
                className="w-[80px] h-[80px] mx-auto my-5"
              />
              <Text className="text-3xl font-Jakarta text-center">
                Verified
              </Text>
              <Text className="text-base text-gray-400 font-Jakarta text-center mt-2">
                You have successfully verified your account.
              </Text>
              <CustomButton
                title="Start Riding"
                className="mt-5"
                onPress={() => router.replace("/(root)/(tabs)/home")}
                bgVariant="success"
              />
            </View>
          </Modal>
        </View>
      </View>
    </ScrollView>
  );
}
