import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { StyleSheet, View, Dimensions, Text } from "react-native";
import React, { useState, useEffect, useRef } from "react";
import * as Location from "expo-location";
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import {GOOGLE_API_KEY} from  '@env'
import Constants from 'expo-constants';

// type InputAutocompleteProps = {
//   label: string;
//   placeholder?: string;
//   onPlaceSelected: (details: GooglePlaceDetail | null) => void;
// };

const InputAutocomplete = (data) =>{
  const {label,onPlaceSelected,placeholder} = data

 // const placeholder
  
  return (
      <View>
        <Text>{label}</Text>
        <GooglePlacesAutocomplete
          styles={{ textInput: styles.input }}
          placeholder={placeholder || "Search"}
          fetchDetails
          onPress={(data, details = null) => {
            onPlaceSelected(details || null);
          }}
          query={{
            key: GOOGLE_API_KEY,
            language: "en",
          }}
        />
      </View>
  );
}

export default function App() {
  const [mapRegion, setMapRegion] = useState([]);
  //const [currentLocation, setCurrentLocation] = useState(null);
  const [lat,setlat] = useState()
  const [lon,setlon] = useState()

  const [origin, setOrigin] = useState()
  const [destination, setDestination] = useState()
  const mapRef = useRef(null)


  const moveTo = async (position) => {
    const camera = await mapRef.current?.getCamera()
    if (camera){
      camera.center = position;
      mapRef.current?.animateCamera(camera, {duration:1000})
   
    }
  }

  const OPS = (mapData) =>{
    const {details, flag} = mapData
    console.log("position", details, flag)
    const set = flag === "origin" ? setOrigin : setDestination
    const position = {
      latitude: details?.geometry.location.lat || 0,
      longitude: details?.geometry.location.lng || 0,
    }
    set(position)
    console.log('this new', position, flag)
    moveTo(position)
  }
  
  const { width, height } = Dimensions.get("window");
  const ASPECT_RATIO = width / height;
  const LATITUDE_DELTA = 0.02;
  const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
 

  // const userLocation = async () => {
  //     let {status} = await Location.requestForegroundPermissionsAsync();
  //     if (status !== 'granted') {
  //       setErrorMsg('Permission to access location was denied')
  //     }
  //     let location = await Location.getCurrentPositionAsync({enableHighAccuracy: true});
  //     setlat(location.coords.latitude)
  //     setlon(location.coords.longitude)
     
  //     // setMapRegion({
  //     //   latitude: location.coords.latitude,
  //     //   longitude: location.coords.longitude,
  //     //   latitudeDelta: LATITUDE_DELTA,
  //     //   longitudeDelta: LONGITUDE_DELTA,
  //     // });
  //     console.log(location.coords.latitude, location.coords.longitude,)
  //   }
   
  // useEffect(() => {
  //   userLocation();
  // }, [])
  
  //console.log('this' ,lat, lon)
  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        //Region={mapRegion}
        initialRegion ={{
          latitude: 43.59097290788204,
          longitude: -79.65908202350107,
          latitudeDelta: 0.25,
          longitudeDelta: 0.25,
        }}
        zoomControlEnabled={true}
        zoomEnabled={true}
        
      > 
        {origin && <Marker coordinate={origin}/>}
        {destination && <Marker coordinate={destination}/>}
      </MapView>
      

      <View style={styles.searchContainer}>
        {/* <GooglePlacesAutocomplete
          styles={{textInput: styles.input}}
          placeholder='Search'
          onPress={(data, details = null) => {
            // 'details' is provided when fetchDetails = true
            console.log(data, details);
          }}
          query={{
            key: GOOGLE_API_KEY,
            language: 'en',
          }}
        /> */}
        <InputAutocomplete label="Origin" onPlaceSelected={(details) => {
          OPS(mapData = {details:details, flag : "origin"})
          console.log('this new 1', origin)
        }} />
        <InputAutocomplete label="Destination" onPlaceSelected={(details) => {
          OPS(mapData = {details:details, flag : "destination"})
          console.log('this new 2', destination)
        }} />
        
      </View>

      
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ddd",
    alignItems: "center",
    justifyContent: "center"
  },
  map: {
    width: "100%",
    height: "100%",
  },
  searchContainer:{
    position: "absolute",
    width: "90%",
    backgroundColor: "white",
    shadowColor: "black",
    shadowOffset: {width:2, height:2},
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 4,
    padding: 8,
    borderRadius: 8,
    top: Constants.statusBarHeight
  },
  input: {
    borderColor: "#888",
    borderWidth: 1
  }
});
