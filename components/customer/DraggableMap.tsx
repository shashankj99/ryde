import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import MapView, { Region } from "react-native-maps";
import { useUserStore } from "@/store/userStore";
import { mapStyles } from "@/styles/mapStyles";
import { customMapStyle, initialRegion } from "@/utils/CustomMap";
import { FC, useEffect, useRef, useState } from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { useIsFocused } from "@react-navigation/native";
import * as Location from "expo-location";
import { reverseGeocode } from "@/utils/mapUtils";

const DraggableMap: FC<{ height: number }> = ({ height }) => {
  const MAX_DISTANCE_THRESHOLD = 10000;
  const isFocused = useIsFocused();
  const mapRef = useRef<MapView>(null);

  const { location, setLocation, outOfRange, setOutOfRange } = useUserStore();
  const [markers, setMarkers] = useState<any>([]);

  const askLocationAccess = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();

    if (status === "granted") {
      try {
        const { latitude, longitude } = (
          await Location.getCurrentPositionAsync()
        ).coords;
        mapRef?.current?.fitToCoordinates([{ latitude, longitude }], {
          edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
          animated: true,
        });
        handleRegionChangeComplete({
          latitude,
          longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        });
      } catch (error) {
        console.log("Error getting location: ", error);
      }
    } else {
      console.log("Denied permission");
    }
  };

  useEffect(() => {
    if (isFocused) {
      askLocationAccess();
    }
  }, [mapRef, isFocused]);

  const handleRegionChangeComplete = async ({
    latitude,
    longitude,
  }: Region) => {
    const address = await reverseGeocode(latitude, longitude);
    setLocation({ latitude, longitude, address });
  };
  const handleGpsButtonPress = async () => {};
  return (
    <View style={{ height: height, width: "100%" }}>
      <MapView
        ref={mapRef}
        pitchEnabled={false}
        style={{ flex: 1 }}
        initialRegion={initialRegion}
        onRegionChangeComplete={handleRegionChangeComplete}
        customMapStyle={customMapStyle}
        showsMyLocationButton={false}
        showsCompass={false}
        showsIndoors={false}
        showsIndoorLevelPicker={false}
        showsTraffic={false}
        showsScale={false}
        showsBuildings={false}
        showsPointsOfInterest={false}
        showsUserLocation={true}
      ></MapView>
      <View style={mapStyles.centerMarkerContainer}>
        <Image
          source={require("@/assets/icons/marker.png")}
          style={mapStyles.marker}
        />
      </View>
      <TouchableOpacity
        style={mapStyles.gpsButton}
        onPress={handleGpsButtonPress}
      >
        <MaterialCommunityIcons
          name="crosshairs-gps"
          size={RFValue(18)}
          color={"#3C75BE"}
        />
      </TouchableOpacity>
      {outOfRange && (
        <View style={mapStyles.outOfRange}>
          <FontAwesome6 name="road-circle-exclamation" color="red" />
        </View>
      )}
    </View>
  );
};

export default DraggableMap;

const styles = StyleSheet.create({});
