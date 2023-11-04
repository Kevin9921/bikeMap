import * as Location from "expo-location";
import { StyleSheet, View } from "react-native";
import React, { useState, useEffect } from "react";

export const useGetWeather = () => {
  const [lat, setLat] = useState([]);
  const [lon, setLon] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setError("permission to access location was denied");
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      setLat(location.coords.latitude);
      setLon(location.coords.longitude);
    })();
  }, [lat, lon]);

  return [lat, lon, error];
};
