import React, { useState, useCallback, useRef, useEffect } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { map } from "lodash";
import { View } from "react-native";
import { Alert, Dimensions, StyleSheet, Text, ScrollView } from "react-native";
import { ListItem, Rating, Icon } from "react-native-elements";
import CarouselImage from "../../components/CarouselImage";
import Loading from "../../components/Loading";
import ListReviews from "../../components/restaurants/ListReviews";
import MapRestaurant from "../../components/restaurants/MapRestaurant";
import {
  addDocumentWithoutId,
  getCurrentUser,
  getDocumentById,
  getIsFavorite,
  deleteFavorite,
} from "../../utils/actions";
import { formatPhone } from "../../utils/helpers";
import firebase from "firebase/app";
import Toast from "react-native-easy-toast";

const widthScreen = Dimensions.get("window").width;

export default function Restaurant({ navigation, route }) {
  const { id, name } = route.params;
  const toastRef = useRef();

  const [restaurant, setRestaurant] = useState(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [userLogged, setUserLogged] = useState(false);
  const [loading, setLoading] = useState(false);

  firebase.auth().onAuthStateChanged((user) => {
    user ? setUserLogged(true) : setUserLogged(false);
  });

  navigation.setOptions({ title: name });

  useEffect(() => {
    (async () => {
      if (userLogged && restaurant) {
        const response = await getIsFavorite(restaurant.id);
        response.statusResponse && setIsFavorite(response.isFavorite);
      }
    })();
  }, [userLogged, restaurant]);

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

  const addFavorite = async () => {
    if (!userLogged) {
      toastRef.current.show(
        "Para agregar el restaurante a favoritos debes estar logueado en la app.",
        3000
      );
      return;
    }
    setLoading(true);
    const response = await addDocumentWithoutId("favorites", {
      idUser: getCurrentUser().uid,
      idRestaurant: restaurant.id,
    });
    setLoading(false);
    if (response.statusResponse) {
      setIsFavorite(true);
      toastRef.current.show("Restaurante añadido a favoritos.", 3000);
    } else {
      toastRef.current.show(
        "No se pudo adicionar el restaurante a favoritos, por favor intenta más tarde.",
        3000
      );
    }
  };

  const removeFavorite = async () => {
    setLoading(true);
    const response = await deleteFavorite(restaurant.id);
    setLoading(false);

    if (response.statusResponse) {
      setIsFavorite(false);
      toastRef.current.show("Restaurante eliminado de favoritos.", 3000);
    } else {
      toastRef.current.show(
        "No se pudo eliminar el restaurante de favoritos, por favor intenta más tarde.",
        3000
      );
    }
  };

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
      <View style={styles.viewFavorite}>
        <Icon
          type="material-community"
          name={isFavorite ? "heart" : "heart-outline"}
          onPress={isFavorite ? removeFavorite : addFavorite}
          color={"#442484"}
          size={35}
          underlayColor="transparent"
        />
      </View>
      <TitleRestaurant
        name={restaurant.name}
        description={restaurant.description}
        rating={restaurant.rating}
      />
      <RestaurantInfo
        name={restaurant.name}
        location={restaurant.location}
        address={restaurant.address}
        email={restaurant.email}
        phone={formatPhone(restaurant.callingCode, restaurant.phone)}
      />
      <ListReviews navigation={navigation} idRestaurant={restaurant.id} />
      <Toast ref={toastRef} position="center" opacity={0.9} />
      <Loading isVisible={loading} text="Por favor espere..." />
    </ScrollView>
  );
}

const RestaurantInfo = ({ name, location, address, email, phone }) => {
  const listInfo = [
    {
      text: address,
      iconName: "map-marker",
    },
    {
      text: phone,
      iconName: "phone",
    },
    {
      text: email,
      iconName: "at",
    },
  ];

  return (
    <View style={styles.viewRestaurantInfo}>
      <Text style={styles.restaurantInfoTitle}>
        Información sobre el restaurante
      </Text>
      <MapRestaurant location={location} name={name} height={150} />
      {map(listInfo, (item, index) => (
        <ListItem key={index} style={styles.containerListItem}>
          <Icon
            type="material-community"
            name={item.iconName}
            color="#442484"
          />
          <ListItem.Content>
            <ListItem.Title>{item.text}</ListItem.Title>
          </ListItem.Content>
        </ListItem>
      ))}
    </View>
  );
};

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
  viewRestaurantInfo: {
    margin: 15,
    marginTop: 25,
  },
  restaurantInfoTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
  },
  containerListItem: {
    borderBottomColor: "#a376c7",
    borderBottomWidth: 1,
  },
  viewFavorite: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: "white",
    borderBottomLeftRadius: 100,
    padding: 5,
    paddingLeft: 15,
  },
});
