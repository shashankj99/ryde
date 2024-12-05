import { customMapStyle, indiaIntialRegion } from "@/utils/CustomMap";
import { FC, useRef } from "react";
import { StyleSheet, View } from "react-native";
import MapView from "react-native-maps";

const DraggableMap: FC<{ height: number }> = ({ height }) => {
  const mapRef = useRef<MapView>(null);
  const handleRegionChangeComplete = async () => {};
  return (
    <View style={{ height: height, width: "100%" }}>
      <MapView
        ref={mapRef}
        pitchEnabled={false}
        style={{ flex: 1 }}
        initialRegion={indiaIntialRegion}
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
    </View>
  );
};

export default DraggableMap;

const styles = StyleSheet.create({});
