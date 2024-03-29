import React, { useState, useEffect } from "react";
import { StyleSheet, View, ScrollView, Alert, Dimensions } from "react-native";
import { Avatar, Button, Icon, Input, Image } from "react-native-elements";
import CountryPicker from "react-native-country-picker-modal";
import { map, size, filter, isEmpty } from "lodash";
import MapView from "react-native-maps";
import uuid from "random-uuid-v4";

import {
  getCurrentLocation,
  loadImageFromGallery,
  validateEmail,
} from "../../utils/helpers";
import {
  addDocumentWithoutId,
  getCurrentUser,
  uploadImage,
} from "../../utils/actions";
import Modal from "../Modal";

const widthScreen = Dimensions.get("window").width;

export default function AddRestaurantForm({
  toastRef,
  setLoading,
  navigation,
}) {
  const [formData, setFormData] = useState(defaultFormValues());
  const [errorName, setErrorName] = useState(null);
  const [errorDescription, setErrorDescription] = useState(null);
  const [errorEmail, setErrorEmail] = useState(null);
  const [errorAddress, setErrorAddress] = useState(null);
  const [errorPhone, setErrorPhone] = useState(null);
  const [imagesSelected, setImagesSelected] = useState([]);
  const [isVisibleMap, setIsVisibleMap] = useState(false);
  const [locationRestaurant, setLocationRestaurant] = useState(null);

  const addRestaurant = async () => {
    if (!validForm()) {
      return;
    }

    setLoading(true);
    const responseUploadImages = await uploadImages();
    const restaurant = {
      name: formData.name,
      address: formData.address,
      description: formData.description,
      email: formData.email,
      callingCode: formData.callingCode,
      phone: formData.phone,
      location: locationRestaurant,
      images: responseUploadImages,
      rating: 0,
      ratingTotal: 0,
      quantityVoting: 0,
      createAt: new Date(),
      createdBy: getCurrentUser().uid,
    };
    const responseAddDocument = await addDocumentWithoutId(
      "restaurants",
      restaurant
    );
    setLoading(false);
    if (!responseAddDocument.statusResponse) {
      toastRef.current.show(
        "Error al grabar el restaurante, por favor intenta más tarde.",
        3000
      );
      return;
    }

    navigation.navigate("restaurants");
  };

  const uploadImages = async () => {
    const imageUrl = [];

    await Promise.all(
      map(imagesSelected, async (image) => {
        const response = await uploadImage(image, "restaurants", uuid());
        response.statusResponse && imageUrl.push(response.url);
      })
    );
    return imageUrl;
  };

  const validForm = () => {
    clearErrors();
    let isValid = true;

    if (isEmpty(formData.name)) {
      setErrorName("Debes ingresar el nombre del restaurante.");
      isValid = false;
    }
    if (isEmpty(formData.address)) {
      setErrorAddress("Debes ingresar la dirección del restaurante.");
      isValid = false;
    }
    if (!validateEmail(formData.email)) {
      setErrorEmail("Debes ingresar el email del restaurante.");
      isValid = false;
    }
    if (size(formData.phone) < 10) {
      setErrorPhone("Debes ingresar un teléfono de restaurante válido.");
      isValid = false;
    }
    if (isEmpty(formData.description)) {
      setErrorDescription("Debes ingresar una descripción del restaurante.");
      isValid = false;
    }

    if (!locationRestaurant) {
      toastRef.current.show(
        "Debes de localizar el restaurante en el mapa.",
        3000
      );
      isValid = false;
    } else if (size(imagesSelected) === 0) {
      toastRef.current.show(
        "Debes de agregar al menos una imagen al restaurante.",
        3000
      );
      isValid = false;
    }
    return isValid;
  };

  const clearErrors = () => {
    setErrorDescription(null);
    setErrorEmail(null);
    setErrorName(null);
    setErrorPhone(null);
    setErrorAddress(null);
  };

  return (
    <ScrollView style={styles.viewContainer}>
      <ImageRestaurant imageRestaurant={imagesSelected[0]} />
      <FormAdd
        formData={formData}
        setFormData={setFormData}
        errorName={errorName}
        errorDescription={errorDescription}
        errorEmail={errorEmail}
        errorAddress={errorAddress}
        errorPhone={errorPhone}
        setIsVisibleMap={setIsVisibleMap}
        locationRestaurant={locationRestaurant}
      />
      <UploadImage
        toastRef={toastRef}
        imagesSelected={imagesSelected}
        setImagesSelected={setImagesSelected}
      />
      <Button
        title="Crear Restaurante"
        onPress={addRestaurant}
        buttonStyle={styles.btnAddRestaurant}
      />
      <MapRestaurant
        isVisibleMap={isVisibleMap}
        setIsVisibleMap={setIsVisibleMap}
        setLocationRestaurant={setLocationRestaurant}
        toastRef={toastRef}
      />
    </ScrollView>
  );
}

const MapRestaurant = ({
  isVisibleMap,
  setIsVisibleMap,
  setLocationRestaurant,
  toastRef,
}) => {
  const [newRegion, setNewRegion] = useState(null);
  useEffect(() => {
    (async () => {
      const response = await getCurrentLocation();
      if (response.status) {
        setNewRegion(response.location);
      }
    })();
  }, []);

  const confirmLocation = () => {
    setLocationRestaurant(newRegion);
    toastRef.current.show("Localización guardada correctamente.", 3000);
    setIsVisibleMap(false);
  };

  return (
    <Modal isVisible={isVisibleMap} setIsVisible={setIsVisibleMap}>
      <View>
        {newRegion && (
          <MapView
            style={styles.mapStyle}
            initialRegion={newRegion}
            showsUserLocation={true}
            onRegionChange={(region) => setNewRegion(region)}
          >
            <MapView.Marker
              coordinate={{
                latitude: newRegion.latitude,
                longitude: newRegion.longitude,
              }}
              draggable
            />
          </MapView>
        )}
        <View style={styles.viewMapBtn}>
          <Button
            title="Guardar Ubicación"
            containerStyle={styles.viewMapsBtnContainerSave}
            buttonStyle={styles.viewMapBtnSave}
            onPress={confirmLocation}
          />
          <Button
            title="Cancelar Ubicación"
            containerStyle={styles.viewMapsBtnContainerCancel}
            buttonStyle={styles.viewMapBtnCancel}
            onPress={() => setIsVisibleMap(false)}
          />
        </View>
      </View>
    </Modal>
  );
};

const ImageRestaurant = ({ imageRestaurant }) => {
  return (
    <View style={styles.viewPhoto}>
      <Image
        style={{ width: widthScreen, height: 200 }}
        source={
          imageRestaurant
            ? { uri: imageRestaurant }
            : require("../../assets/no-image.png")
        }
      />
    </View>
  );
};

const UploadImage = ({ toastRef, imagesSelected, setImagesSelected }) => {
  const imageSelect = async () => {
    const response = await loadImageFromGallery([4, 3]);
    if (!response.status) {
      toastRef.current.show("No has seleccionado ninguna imagen", 3000);
      return;
    }
    setImagesSelected([...imagesSelected, response.image]);
  };
  const removeImage = (image) => {
    Alert.alert(
      "Eliminar imagen",
      "¿Estás seguro que quieres eliminar la imagen?",
      [
        { text: "No", style: "cancel" },
        {
          text: "Sí",
          onPress: () => {
            setImagesSelected(
              filter(imagesSelected, (imageUrl) => imageUrl !== image)
            );
          },
        },
      ],
      {
        cancelable: true,
      }
    );
  };
  return (
    <ScrollView horizontal style={styles.viewImage}>
      {size(imagesSelected) < 10 && (
        <Icon
          type="material-community"
          name="camera"
          color="#7a7a7a"
          containerStyle={styles.containerIcon}
          onPress={imageSelect}
        />
      )}
      {map(imagesSelected, (imageRestaurant, index) => (
        <Avatar
          key={index}
          style={styles.miniatureStyle}
          source={{ uri: imageRestaurant }}
          onPress={() => removeImage(imageRestaurant)}
        />
      ))}
    </ScrollView>
  );
};

const FormAdd = ({
  formData,
  setFormData,
  errorName,
  errorDescription,
  errorEmail,
  errorAddress,
  errorPhone,
  setIsVisibleMap,
  locationRestaurant,
}) => {
  const [country, setCountry] = useState("CO");
  const [callingCode, setCallingCode] = useState("57");
  const [phone, setPhone] = useState("");

  const onChange = (e, type) => {
    setFormData({ ...formData, [type]: e.nativeEvent.text });
  };
  return (
    <View style={styles.viewForm}>
      <Input
        placeholder="Nombre del restaurante..."
        defaultValue={formData.name}
        onChange={(e) => onChange(e, "name")}
        errorMessage={errorName}
      />
      <Input
        placeholder="Dirección del restaurante..."
        defaultValue={formData.address}
        onChange={(e) => onChange(e, "address")}
        errorMessage={errorAddress}
        rightIcon={{
          type: "material-community",
          name: "google-maps",
          color: locationRestaurant ? "#442484" : "#c2c2c2",
          onPress: () => setIsVisibleMap(true),
        }}
      />
      <Input
        placeholder="Email del restaurante..."
        keyboardType="email-address"
        defaultValue={formData.email}
        onChange={(e) => onChange(e, "email")}
        errorMessage={errorEmail}
      />
      <View style={styles.phoneView}>
        <CountryPicker
          withFlag
          withCallingCode
          withFilter
          withCallingCodeButton
          containerStyle={styles.countryPicker}
          countryCode={country}
          onSelect={(country) => {
            setFormData({
              ...formData,
              country: country.cca2,
              callingCode: country.callingCode[0],
            });
            setCountry(country.cca2);
            setCallingCode(country.callingCode[0]);
          }}
        />
        <Input
          placeholder="WhatsApp del restaurante..."
          keyboardType="phone-pad"
          containerStyle={styles.inputPhone}
          defaultValue={formData.phone}
          onChange={(e) => onChange(e, "phone")}
          errorMessage={errorPhone}
        />
      </View>
      <Input
        placeholder="Descripción del restaurante..."
        multiline
        containerStyle={styles.textArea}
        defaultValue={formData.description}
        onChange={(e) => onChange(e, "description")}
        errorMessage={errorDescription}
      />
    </View>
  );
};

const defaultFormValues = () => {
  return {
    name: "",
    description: "",
    email: "",
    phone: "",
    address: "",
    country: "CO",
    callingCode: "57",
  };
};

const styles = StyleSheet.create({
  viewContainer: {
    height: "100%",
  },
  viewForm: {
    marginHorizontal: 10,
  },
  textArea: {
    height: 100,
    width: "100%",
  },
  phoneView: {
    width: "80%",
    flexDirection: "row",
  },
  inputPhone: {
    width: "80%",
  },
  btnAddRestaurant: {
    margin: 20,
    backgroundColor: "#442484",
  },
  viewImage: {
    flexDirection: "row",
    marginHorizontal: 20,
    marginTop: 30,
  },
  containerIcon: {
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
    height: 70,
    width: 70,
    backgroundColor: "#e3e3e3",
  },
  miniatureStyle: {
    width: 70,
    height: 70,
    marginRight: 10,
  },
  viewPhoto: {
    alignItems: "center",
    height: 200,
    marginBottom: 20,
  },
  mapStyle: {
    width: "100%",
    height: 550,
  },
  viewMapBtn: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
  viewMapsBtnContainerCancel: {
    paddingLeft: 5,
  },
  viewMapsBtnContainerSave: {
    paddingRight: 5,
  },
  viewMapBtnCancel: {
    backgroundColor: "#A65273",
  },
  viewMapBtnSave: {
    backgroundColor: "#442484",
  },
});
