import { useFocusEffect } from "@react-navigation/native";
import React, { useState, useEffect, useCallback } from "react";
import { Alert, Dimensions, StyleSheet, Text, ScrollView } from "react-native";
import CarouselImage from "../../components/CarouselImage";
import Loading from "../../components/Loading";
import { getDocumentById } from "../../utils/actions";

const widthScreen = Dimensions.get("window").width;

export default function Restaurant({ navigation, route }) {
  const { id, name } = route.params;
  const [restaurant, setRestaurant] = useState(null);
  const [activeSlide, setActiveSlide] = useState(0);

  navigation.setOptions({ title: name });
  useFocusEffect(
    useCallback(() => {
      (async () => {
        const response = await getDocumentById("restaurants", id);
        if (response.statusResponse) {
          setRestaurant(response.document);
        } else {
          setRestaurant({});
          Alert.alert(
            "Ocurrió un problema cargando el restaurante, intente más tarde."
          );
        }
      })();
    }, [])
  );

  if (!restaurant) {
    return <Loading isVisible={true} text="Cargando..." />;
  }

  return (
    <ScrollView style={styles.viewBody}>
      <CarouselImage
        images={restaurant.images}
        height={250}
        width={widthScreen}
        activeSlide={activeSlide}
        setActiveSlide={setActiveSlide}
      />
      <Text>{restaurant.description}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  viewBody: {
    flex: 1,
  },
});
