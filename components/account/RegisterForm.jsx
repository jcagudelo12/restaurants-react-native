import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Button, Icon, Input } from "react-native-elements";

export default function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <View style={styles.form}>
      <Input containerStyle={styles.input} placeholder="Ingresa tu email" />
      <Input
        containerStyle={styles.input}
        placeholder="Ingresa tu constraseña"
        password={true}
        secureTextEntry={!showPassword}
        rightIcon={
          <Icon
            type="material-community"
            name={showPassword ? "eye-off-outline" : "eye-outline"}
            iconStyle={styles.icon}
            onPress={() => setShowPassword(!showPassword)}
          />
        }
      />
      <Input
        containerStyle={styles.input}
        placeholder="Confirma tu contraseña"
        password={true}
        secureTextEntry={!showPassword}
        rightIcon={
          <Icon
            type="material-community"
            name={showPassword ? "eye-off-outline" : "eye-outline"}
            iconStyle={styles.icon}
            onPress={() => setShowPassword(!showPassword)}
          />
        }
      />
      <Button
        title="Registrar Nuevo Usuario"
        containerStyle={styles.btnContainer}
        buttonStyle={styles.btn}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  form: {
    marginTop: 30,
  },
  input: {
    width: "100%",
  },
  btnContainer: {
    marginTop: 20,
    width: "90%",
    alignSelf: "center",
  },
  btn: {
    backgroundColor: "#442484",
  },
  icon: {
    color: "#C1C1C1",
  },
});
