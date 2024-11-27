import CustomButton from "@/components/CustomButton";
import { onboarding } from "@/constants";
import { router } from "expo-router";
import { useRef, useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Swiper from "react-native-swiper";

export default function Welcome() {
  const swiperRef = useRef<Swiper>(null);
  const [actvieIndex, setActiveIndex] = useState<number>(0);
  const isLastSlide = actvieIndex === onboarding.length - 1;

  return (
    <SafeAreaView className="flex h-full items-center justify-between bg-white">
      <TouchableOpacity
        onPress={() => router.replace("/(auth)/sign-up")}
        className="w-full flex justify-end items-end p-5"
      >
        <Text className="text-black text-md font-JakartaBold">Skip</Text>
      </TouchableOpacity>
      <Swiper
        ref={swiperRef}
        loop={false}
        dot={
          <View className="w-[32px] h-[4px] mx-1 bg-[#E2E8F0] rounded-full" />
        }
        activeDot={
          <View className="w-[32px] h-[4px] mx-1 bg-[#0286FF] rounded-full" />
        }
        onIndexChanged={(index) => setActiveIndex(index)}
      >
        {onboarding.map((o) => (
          <View key={o.id} className="flex items-center justify-center p-5">
            <Image
              source={o.image}
              className="w-full h-[300px]"
              resizeMode="contain"
            />
            <View className="w-full flex flex-row items-center justify-center mt-10">
              <Text className="text-black text-3xl text-center font-bold mx-10">
                {o.title}
              </Text>
            </View>
            <Text className="text-[#858585] text-lg text-center font-JakartaSemiBold mx-10 mt-3">
              {o.description}
            </Text>
          </View>
        ))}
      </Swiper>
      <CustomButton
        title={isLastSlide ? "Get Started" : "Next"}
        onPress={() =>
          isLastSlide
            ? router.replace("/(auth)/sign-up")
            : swiperRef.current?.scrollBy(1)
        }
        className="w-9/12 mt-10 mb-5"
      />
    </SafeAreaView>
  );
}
