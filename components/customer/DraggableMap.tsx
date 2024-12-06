import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import MapView, { Marker, Region } from "react-native-maps";
import haversine from "haversine-distance";
import { useUserStore } from "@/store/userStore";
import { mapStyles } from "@/styles/mapStyles";
import { customMapStyle, initialRegion } from "@/utils/CustomMap";
import { FC, useEffect, useRef, useState } from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { useIsFocused } from "@react-navigation/native";
import { reverseGeocode } from "@/utils/mapUtils";
import * as Location from "expo-location";
import { useWS } from "@/service/ws-provider";

const DraggableMap: FC<{ height: number }> = ({ height }) => {
  const MAX_DISTANCE_THRESHOLD = 10000;
  const isFocused = useIsFocused();
  const mapRef = useRef<MapView>(null);
  const { location, setLocation, outOfRange, setOutOfRange } = useUserStore();
  const { emit, on, off } = useWS();
  const [markers, setMarkers] = useState<any>([]);

  useEffect(() => {
    if (isFocused) {
      askLocationAccess();
    }
  }, [mapRef, isFocused]);

  // useEffect(() => {
  //   if (location?.latitude && location?.longitude && isFocused) {
  //     emit("subscribeToZone", {
  //       latitude: location.latitude,
  //       longitude: location.longitude,
  //     });
  //     on("nearbyCaptains", (captains: any[]) => {
  //       setMarkers(
  //         captains?.map((c) => ({
  //           id: c?.id,
  //           latitude: c?.coords?.latitude,
  //           longitude: c?.coords?.longitude,
  //           type: "captain",
  //           rotation: c?.coords?.heading,
  //           visible: true,
  //         }))
  //       );
  //     });
  //     return () => off("nearbyCaptains");
  //   }
  // }, [location, emit, on, off, isFocused]);

  useEffect(() => {
    generateRandomMarkers();
  }, [location]);

  const generateRandomMarkers = () => {
    if (!location?.latitude || !location?.longitude || outOfRange) return;
    const types = ["bike", "auto", "cab"];
    const newMarkers = Array.from({ length: 9 }, (_, index) => {
      const type = types[Math.floor(Math.random() * types.length)];
      const angle = Math.floor(Math.random() * 360);
      return {
        id: index,
        latitude: location?.latitude + (Math.random() - 0.5) * 0.01,
        longitude: location?.longitude + (Math.random() - 0.5) * 0.01,
        type,
        rotation: angle,
        visible: true,
      };
    });
    setMarkers(newMarkers);
  };

  const addLocationToMapRef = (latitude: number, longitude: number) => {
    mapRef?.current?.fitToCoordinates([{ latitude, longitude }], {
      edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
      animated: true,
    });
  };

  const askLocationAccess = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();

    if (status === "granted") {
      try {
        const { latitude, longitude } = (
          await Location.getCurrentPositionAsync()
        ).coords;
        addLocationToMapRef(latitude, longitude);
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

  const handleRegionChangeComplete = async ({
    latitude,
    longitude,
  }: Region) => {
    const address = await reverseGeocode(latitude, longitude);
    setLocation({ latitude, longitude, address });
    const userLocation = {
      latitude: location?.latitude,
      longitude: location?.longitude,
    } as { latitude: number; longitude: number };
    if (userLocation) {
      const newLocation = { latitude, longitude };
      const distance = haversine(userLocation, newLocation);
      setOutOfRange(distance > MAX_DISTANCE_THRESHOLD);
    }
  };

  const handleGpsButtonPress = async () => {
    try {
      await Location.requestForegroundPermissionsAsync();
      const { latitude, longitude } = (await Location.getCurrentPositionAsync())
        .coords;
      addLocationToMapRef(latitude, longitude);
      const address = await reverseGeocode(latitude, longitude);
      setLocation({ latitude, longitude, address });
    } catch (error) {
      console.log("Error getting location: ", error);
    }
  };

  return (
    <View style={{ height: height, width: "100%" }}>
      <MapView
        ref={mapRef}
        pitchEnabled={false}
        style={{ flex: 1 }}
        maxZoomLevel={16}
        minZoomLevel={12}
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
      >
        {markers?.map(
          (m: any, index: number) =>
            m.visible && (
              <Marker
                flat
                zIndex={index++}
                key={index}
                anchor={{ x: 0.5, y: 0.5 }}
                coordinate={{ latitude: m?.latitude, longitude: m?.longitude }}
              >
                <View style={{ transform: [{ rotate: `${m.rotation}deg` }] }}>
                  <Image
                    style={{ height: 40, width: 40, resizeMode: "contain" }}
                    source={
                      m.type === "bike"
                        ? require("@/assets/icons/bike_marker.png")
                        : m.type === "auto"
                        ? require("@/assets/icons/auto_marker.png")
                        : require("@/assets/icons/cab_marker.png")
                    }
                  />
                </View>
              </Marker>
            )
        )}
      </MapView>
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
