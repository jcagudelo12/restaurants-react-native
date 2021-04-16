import { useFocusEffect } from "@react-navigation/native";
import React, { useState, useEffect, useCallback } from "react";
import { View } from "react-native";
import { Alert, Dimensions, StyleSheet, Text, ScrollView } from "react-native";
import { Rating } from "react-native-elements";
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
      <TitleRestaurant
        name={restaurant.name}
        description={restaurant.description}
        rating={restaurant.rating}
      />
    </ScrollView>
  );
}

const TitleRestaurant = ({ name, description, rating }) => {
  return (
    <View style={styles.viewRestaurantTitle}>
      <View style={styles.viewRestaurantContainer}>
        <Text style={styles.nameRestaurant}>{name}</Text>
        <Rating
          style={styles.rating}
          imageSize={20}
          readonly
          startingValue={parseFloat(rating)}
        />
      </View>
      <Text style={styles.descriptionRestaurant}>{description}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  viewBody: {
    flex: 1,
    backgroundColor: "white",
  },
  viewRestaurantTitle: {
    padding: 15,
  },
  viewRestaurantContainer: {
    flexDirection: "row",
  },
  descriptionRestaurant: {
    marginTop: 8,
    color: "gray",
    textAlign: "justify",
  },
  rating: {
    position: "absolute",
    right: 0,
  },
  nameRestaurant: {
    fontWeight: "bold",
  },
});
