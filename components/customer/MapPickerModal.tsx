import { useUserStore } from "@/store/userStore";
import { modalStyles } from "@/styles/modalStyles";
import { getPlacesSuggestions, reverseGeocode } from "@/utils/mapUtils";
import { MapItem } from "@/utils/types";
import Ionicons from "@expo/vector-icons/Ionicons";
import { FC, memo, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  FlatList,
  Image,
} from "react-native";
import MapView, { Region } from "react-native-maps";
import { RFValue } from "react-native-responsive-fontsize";
import LocationItem from "./LocationItem";
import { customMapStyle, initialRegion } from "@/utils/CustomMap";
import { mapStyles } from "@/styles/mapStyles";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import * as Location from "expo-location";

interface MapPickerModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  selectedLocation: {
    latitude: number;
    longitude: number;
    address: string;
  };
  onSelectLocation: (location: any) => void;
}

const MapPickerModal: FC<MapPickerModalProps> = ({
  visible,
  onClose,
  title,
  selectedLocation,
  onSelectLocation,
}) => {
  const { location } = useUserStore();
  const [text, setText] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [region, setRegion] = useState<Region | null>(null);
  const [locations, setLocations] = useState<[]>([]);
  const mapRef = useRef<MapView>(null);
  const textInputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (
      selectedLocation?.latitude != null &&
      selectedLocation?.longitude != null
    ) {
      setRegion({
        latitude: selectedLocation.latitude,
        longitude: selectedLocation.longitude,
        latitudeDelta: 0.5,
        longitudeDelta: 0.5,
      });

      if (mapRef.current) {
        addLocationToMapRef(
          selectedLocation.latitude,
          selectedLocation.longitude
        );
      }
    } else {
      setRegion(initialRegion);
    }
  }, [selectedLocation]);

  const fetchLocations = async (query: string) => {
    if (query?.length >= 4) {
      const data = await getPlacesSuggestions(query);
      setLocations(data);
    } else {
      setLocations([]);
    }
  };

  const addLocation = async (item: MapItem) => {
    setRegion({
      latitude: item?.latitude,
      longitude: item?.longitude,
      latitudeDelta: 0.5,
      longitudeDelta: 0.5,
    });
    setAddress(item.title);
    textInputRef.current?.blur();
    setText("");
  };

  const renderLocations = ({ item }: { item: MapItem }) => (
    <LocationItem item={item} onPress={() => addLocation(item)} />
  );

  const handleRegionChangeComplete = async (region: Region) => {
    try {
      const address = await reverseGeocode(region?.latitude, region?.longitude);
      setRegion(region);
      setAddress(address);
    } catch (error) {
      console.log(error);
    }
  };

  const addLocationToMapRef = (latitude: number, longitude: number) => {
    mapRef?.current?.fitToCoordinates([{ latitude, longitude }], {
      edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
      animated: true,
    });
  };

  const handleGpsButtonPress = async () => {
    try {
      await Location.requestForegroundPermissionsAsync();
      const { latitude, longitude } = (await Location.getCurrentPositionAsync())
        .coords;
      addLocationToMapRef(latitude, longitude);
      const address = await reverseGeocode(latitude, longitude);
      setRegion({
        latitude,
        longitude,
        latitudeDelta: 0.5,
        longitudeDelta: 0.5,
      });
      setAddress(address);
    } catch (error) {
      console.log("Error getting location: ", error);
    }
  };

  return (
    <Modal
      animationType="slide"
      visible={visible}
      presentationStyle="formSheet"
      onRequestClose={onClose}
    >
      <View style={modalStyles.modalContainer}>
        <Text style={modalStyles.centerText}>Select {title}</Text>
        <TouchableOpacity onPress={onClose}>
          <Text style={modalStyles.cancelButton}>Cancel</Text>
        </TouchableOpacity>
        <View style={modalStyles.searchContainer}>
          <Ionicons name="search-outline" size={RFValue(16)} color={"#777"} />
          <TextInput
            ref={textInputRef}
            style={modalStyles.input}
            placeholder="Search address"
            placeholderTextColor={"#aaa"}
            value={text}
            onChangeText={(t) => {
              setText(t);
              fetchLocations(t);
            }}
          />
        </View>
        {text !== "" ? (
          <FlatList
            ListHeaderComponent={
              <View>
                {text.length >= 4 ? null : (
                  <Text style={{ marginHorizontal: 16 }}>
                    Enter at least 4 characters to search
                  </Text>
                )}
              </View>
            }
            data={locations}
            renderItem={renderLocations}
            keyExtractor={(item: MapItem) => item?.place_id}
            initialNumToRender={5}
            windowSize={5}
          />
        ) : (
          <>
            <View style={{ flex: 1, width: "100%" }}>
              <MapView
                ref={mapRef}
                pitchEnabled={false}
                style={{ flex: 1 }}
                maxZoomLevel={16}
                minZoomLevel={12}
                initialRegion={{
                  latitude:
                    region?.latitude ??
                    location?.latitude ??
                    initialRegion.latitude,
                  longitude:
                    region?.longitude ??
                    location?.longitude ??
                    initialRegion.longitude,
                  latitudeDelta: 0.5,
                  longitudeDelta: 0.5,
                }}
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
              />
              <View style={mapStyles.centerMarkerContainer}>
                <Image
                  source={
                    title === "drop"
                      ? require("@/assets/icons/drop_marker.png")
                      : require("@/assets/icons/marker.png")
                  }
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
            </View>
            <View style={modalStyles.footerContainer}>
              <Text style={modalStyles.addressText} numberOfLines={2}>
                {address === "" ? "Getting addresses..." : address}
              </Text>
              <View style={modalStyles.buttonContainer}>
                <TouchableOpacity
                  style={modalStyles.button}
                  onPress={() => {
                    if (region) {
                      onSelectLocation({
                        type: title,
                        latitude: region.latitude,
                        longitude: region.longitude,
                        address,
                      });
                    }
                    onClose();
                  }}
                >
                  <Text style={modalStyles.buttonText}>Set Address</Text>
                </TouchableOpacity>
              </View>
            </View>
          </>
        )}
      </View>
    </Modal>
  );
};

export default memo(MapPickerModal);
