import Ionicons from "@expo/vector-icons/Ionicons";
import CustomText from "@/components/shared/CustomText";
import LocationInput from "@/components/customer/LocationInput";
import LocationItem from "@/components/customer/LocationItem";
import { commonStyles } from "@/styles/commonStyles";
import { homeStyles } from "@/styles/homeStyles";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { FlatList, Image, TouchableOpacity, View } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "@/utils/Constants";
import { uiStyles } from "@/styles/uiStyles";
import { useEffect, useState } from "react";
import { getPlacesSuggestions } from "@/utils/mapUtils";
import { useUserStore } from "@/store/userStore";
import { locationStyles } from "@/styles/locationStyles";
import { MapItem } from "@/utils/types";
import MapPickerModal from "@/components/customer/MapPickerModal";

const SelectLocation = () => {
  const { location, setLocation } = useUserStore();
  const [pickup, setPickup] = useState<string>("");
  const [drop, setDrop] = useState<string>("");
  const [pickupCoords, setPickupCoords] = useState<any>(null);
  const [dropCoords, setDropCoords] = useState<any>(null);
  const [locations, setLocations] = useState([]);
  const [focusedInput, setFocusedInput] = useState<string>("drop");
  const [modalTitle, setModalTitle] = useState<string>("drop");
  const [isMapModalVisible, setIsMapModalVisible] = useState<boolean>(false);

  useEffect(() => {
    setPickup(location?.address ?? "");
    setPickupCoords(location);
  }, [location]);

  const fetchLocations = async (query: string) => {
    if (query?.length >= 4) {
      const data = await getPlacesSuggestions(query);
      setLocations(data);
    }
  };

  const addLocation = async (item: MapItem) => {
    if (focusedInput === "drop") {
      setDropCoords(item);
      setDrop(item.title);
    } else {
      setLocation({
        latitude: item.latitude,
        longitude: item.longitude,
        address: item.title,
      });
      setPickupCoords(item);
      setPickup(item.title);
    }
  };

  const renderLocations = ({ item }: { item: MapItem }) => (
    <LocationItem item={item} onPress={() => addLocation(item)} />
  );

  return (
    <View style={homeStyles.container}>
      <StatusBar
        style="light"
        backgroundColor={Colors.text}
        translucent={false}
      />
      <SafeAreaView />
      <TouchableOpacity
        style={commonStyles.flexRow}
        onPress={() => router.back()}
      >
        <Ionicons
          name="chevron-back"
          size={RFValue(18)}
          color={Colors.iosColor}
        />
        <CustomText fontFamily="Regular" style={{ color: Colors.iosColor }}>
          Back
        </CustomText>
      </TouchableOpacity>
      <View style={uiStyles.locationInputs}>
        <LocationInput
          placeholder="Search Pickup Location"
          type="pickup"
          value={pickup}
          onChangeText={(text) => {
            setPickup(text);
            fetchLocations(text);
          }}
          onFocus={() => setFocusedInput("pickup")}
        />
        <LocationInput
          placeholder="Search Drop Location"
          type="drop"
          value={drop}
          onChangeText={(text) => {
            setDrop(text);
            fetchLocations(text);
          }}
          onFocus={() => setFocusedInput("drop")}
        />
        <CustomText
          fontFamily="Medium"
          fontSize={10}
          style={uiStyles.suggestionText}
        >
          {focusedInput} suggestions
        </CustomText>
      </View>
      <FlatList
        data={locations}
        renderItem={renderLocations}
        keyExtractor={(item: MapItem) => item?.place_id}
        initialNumToRender={5}
        windowSize={5}
        ListFooterComponent={
          <TouchableOpacity
            style={[commonStyles.flexRow, locationStyles.container]}
            onPress={() => {
              setModalTitle(focusedInput);
              setIsMapModalVisible(true);
            }}
          >
            <Image
              source={require("@/assets/icons/map_pin.png")}
              style={uiStyles.mapPinIcon}
            />
            <CustomText fontFamily="Medium" fontSize={12}>
              Select From Map
            </CustomText>
          </TouchableOpacity>
        }
      />
      {isMapModalVisible && (
        <MapPickerModal
          visible={isMapModalVisible}
          onClose={() => setIsMapModalVisible(false)}
          title={modalTitle}
          selectedLocation={{
            latitude:
              focusedInput === "drop"
                ? dropCoords?.latitude
                : pickupCoords?.latitude,
            longitude:
              focusedInput === "drop"
                ? dropCoords?.longitude
                : pickupCoords?.longitude,
            address: focusedInput === "drop" ? drop : pickup,
          }}
          onSelectLocation={(data) => {
            if (data) {
              if (modalTitle === "drop") {
                setDropCoords(data);
                setDrop(data.address);
              } else {
                setLocation({
                  latitude: data.latitude,
                  longitude: data.longitude,
                  address: data.address,
                });
                setPickupCoords(data);
                setPickup(data.address);
              }
            }
          }}
        />
      )}
    </View>
  );
};

export default SelectLocation;
