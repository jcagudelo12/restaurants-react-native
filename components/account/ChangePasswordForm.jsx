import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Button, Icon, Input } from "react-native-elements";
import { isEmpty, size } from "lodash";
import { reauthenicate, updatePassword } from "../../utils/actions";

export default function ChangePasswordForm({ email, setShowModal, toastRef }) {
  const [newPassword, setNewPassword] = useState(null);
  const [currentPassword, setCurrentPassword] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState(null);
  const [errorNewPassword, setErrorNewPassword] = useState(null);
  const [errorCurrentPassword, setErrorCurrentPassword] = useState(null);
  const [errorConfirmPassword, setErrorConfirmPassword] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    if (!validateForm()) {
      return;
    }
    setLoading(true);
    const resultReauthenicate = await reauthenicate(currentPassword);
    if (!resultReauthenicate.statusResponse) {
      setLoading(false);
      setErrorCurrentPassword("Contraseña incorrecta.");
      return;
    }

    const resultUpdatePassword = await updatePassword(newPassword);
    setLoading(false);

    if (!resultUpdatePassword.statusResponse) {
      setLoading(false);
      setErrorNewPassword(
        "Hubo un problema cambiando la contraseña, por favor intente más tarde."
      );
      return;
    }
    setReloadUser(true);
    toastRef.current.show("Se ha actualizado el emailla contraseña.", 3000);
    setShowModal(false);
  };

  const validateForm = () => {
    setErrorNewPassword(null);
    setErrorCurrentPassword(null);
    setErrorConfirmPassword(null);
    let isValid = true;

    if (isEmpty(currentPassword)) {
      setErrorCurrentPassword("Debes ingresar tu contraseña actual.");
      isValid = false;
    }

    if (size(newPassword < 6)) {
      setErrorNewPassword(
        "Debes ingresar una nueva contraseña de al menos 6 carácteres."
      );
      isValid = false;
    }
    if (size(confirmPassword < 6)) {
      setErrorConfirmPassword(
        "Debes ingresar una confirmación de tu contraseña de al menos 6 carácteres."
      );
      isValid = false;
    }
    if (newPassword !== confirmPassword) {
      setErrorConfirmPassword(
        "La nueva contraseña y la confirmación no son iguales."
      );
      setErrorNewPassword(
        "La nueva contraseña y la confirmación no son iguales."
      );
      isValid = false;
    }
    if (newPassword === confirmPassword) {
      setCurrentPassword(
        "Debes ingresar una contraseña diferente a la actual."
      );
      setNewPassword("Debes ingresar una contraseña diferente a la actual.");
      setErrorConfirmPassword(
        "Debes ingresar una contraseña diferente a la actual."
      );

      isValid = false;
    }

    return isValid;
  };

  return (
    <View style={styles.view}>
      <Input
        placeholder="Ingresa tu contraseña actual..."
        containerStyle={styles.input}
        defaultValue={currentPassword}
        onChange={(e) => setCurrentPassword(e.nativeEvent.text)}
        errorMessage={errorCurrentPassword}
        password={true}
        secureTextEntry={!showPassword}
        rightIcon={
          <Icon
            type="material-community"
            name={showPassword ? "eye-off-outline" : "eye-outline"}
            iconStyle={{ color: "#c2c2c2" }}
            onPress={() => setShowPassword(!showPassword)}
          />
        }
      />
      <Input
        placeholder="Ingresa tu nueva contraseña.."
        containerStyle={styles.input}
        defaultValue={newPassword}
        onChange={(e) => setNewPassword(e.nativeEvent.text)}
        errorMessage={errorNewPassword}
        password={true}
        secureTextEntry={!showPassword}
        rightIcon={
          <Icon
            type="material-community"
            name={showPassword ? "eye-off-outline" : "eye-outline"}
            iconStyle={{ color: "#c2c2c2" }}
            onPress={() => setShowPassword(!showPassword)}
          />
        }
      />
      <Input
        placeholder="Ingresa tu confirmación de nueva contraseña"
        containerStyle={styles.input}
        defaultValue={confirmPassword}
        onChange={(e) => setConfirmPassword(e.nativeEvent.text)}
        errorMessage={errorConfirmPassword}
        password={true}
        secureTextEntry={!showPassword}
        rightIcon={
          <Icon
            type="material-community"
            name={showPassword ? "eye-off-outline" : "eye-outline"}
            iconStyle={{ color: "#c2c2c2" }}
            onPress={() => setShowPassword(!showPassword)}
          />
        }
      />
      <Button
        title="Cambiar Contraseña."
        containerStyle={styles.btnContainer}
        buttonStyle={styles.btn}
        onPress={onSubmit}
        loading={loading}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  view: {
    alignItems: "center",
    paddingVertical: 10,
  },
  input: {
    marginBottom: 10,
  },
  btnContainer: {
    width: "95%",
  },
  btn: {
    backgroundColor: "#442484",
  },
});
