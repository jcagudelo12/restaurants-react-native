import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import firebase from "firebase/app";
import { Button } from "react-native-elements";

export default function ListReviews({ navigation, id }) {
  const [userLogged, setUserLogged] = useState(false);

  firebase.auth().onAuthStateChanged((user) => {
    user ? setUserLogged(true) : setUserLogged(false);
  });

  return (
    <View>
      {userLogged ? (
        <Button
          buttonStyle={styles.btnAddReview}
          title="Escribe una opinión"
          titleStyle={styles.btnTitleAddReview}
          onPress={() => navigation.navigate("add-review-restaurant")}
          icon={{
            type: "material-community",
            name: "square-edit-outline",
            color: "#a376c7",
          }}
        />
      ) : (
        <Text
          style={styles.mustLoginTest}
          onPress={() => navigation.navigate("login")}
        >
          Para escribir una opinión es necesario estar logueado en la app.{" "}
          <Text style={styles.loginTest}>Pulsa AQUÍ para iniciar sesión</Text>
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  btnAddReview: {
    backgroundColor: "transparent",
  },
  btnTitleAddReview: {
    color: "#a376c7",
  },
  mustLoginTest: {
    textAlign: "center",
    color: "#a376c7",
    padding: 20,
  },
  loginTest: {
    fontWeight: "bold",
  },
});
