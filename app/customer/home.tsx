import LocationBar from "@/components/customer/LocationBar";
import DraggableMap from "@/components/customer/DraggableMap";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { homeStyles } from "@/styles/homeStyles";
import { Platform, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { Colors, screenHeight } from "@/utils/Constants";
import { useCallback, useMemo, useRef, useState } from "react";
import SheetContent from "@/components/customer/SheetContent";

const androidHeights = [screenHeight * 0.12, screenHeight * 0.42];
const iosHeights = [screenHeight * 0.2, screenHeight * 0.5];

const Home = () => {
  const bottomSheetRef = useRef(null);
  const snapPoints = useMemo(
    () => (Platform.OS === "ios" ? iosHeights : androidHeights),
    []
  );

  const [mapHeight, setMapHeight] = useState(snapPoints[1]);

  const handleSheetChange = useCallback((index: number) => {
    const height = index === 1 ? screenHeight * 0.5 : screenHeight * 0.8;
    setMapHeight(height);
  }, []);
  return (
    <View style={homeStyles.container}>
      <StatusBar
        style="light"
        backgroundColor={Colors.text}
        translucent={false}
      />
      <LocationBar />
      <DraggableMap height={mapHeight} />
      <BottomSheet
        ref={bottomSheetRef}
        index={1}
        handleIndicatorStyle={{ backgroundColor: "#ccc" }}
        enableOverDrag={false}
        enableDynamicSizing={false}
        style={{ zIndex: 4 }}
        snapPoints={snapPoints}
        onChange={handleSheetChange}
      >
        <BottomSheetScrollView
          contentContainerStyle={homeStyles.scrollContainer}
        >
          <SheetContent />
        </BottomSheetScrollView>
      </BottomSheet>
    </View>
  );
};

export default Home;
