import React, { useState } from "react";
import { StyleSheet, View, Text } from "react-native";
import { map } from "lodash";
import { Icon, ListItem } from "react-native-elements";
import Modal from "../Modal";

export default function AccountOptions({ user, toastRef }) {
  const [showModal, setShowModal] = useState(true);
  const [renderComponent, setRenderComponent] = useState(null);

  const generateOptions = () => {
    return [
      {
        title: "Cambiar nombres y apellidos",
        iconNameLeft: "account-circle",
        iconColorLeft: "#a7bfd3",
        iconNameRight: "chevron-right",
        iconColorRight: "#a7bfd3",
        onPress: () => selectedComponent("displayName"),
      },
      {
        title: "Cambiar email",
        iconNameLeft: "at",
        iconColorLeft: "#a7bfd3",
        iconNameRight: "chevron-right",
        iconColorRight: "#a7bfd3",
        onPress: () => selectedComponent("email"),
      },
      {
        title: "Cambiar contraseña",
        iconNameLeft: "lock-reset",
        iconColorLeft: "#a7bfd3",
        iconNameRight: "chevron-right",
        iconColorRight: "#a7bfd3",
        onPress: () => selectedComponent("password"),
      },
    ];
  };

  const selectedComponent = (key) => {
    switch (key) {
      case "displayName":
        setRenderComponent(<Text>displayName</Text>);
        break;
      case "email":
        setRenderComponent(<Text>email</Text>);
        break;
      case "password":
        setRenderComponent(<Text>password</Text>);
        break;
    }
    setShowModal(true);
  };
  const menuOptions = generateOptions();

  return (
    <View>
      {map(menuOptions, (menu, index) => (
        <ListItem key={index} style={styles.menuItem} onPress={menu.onPress}>
          <Icon
            type="material-community"
            name={menu.iconNameLeft}
            color={menu.iconColorLeft}
          />
          <ListItem.Content>
            <ListItem.Title>{menu.title}</ListItem.Title>
          </ListItem.Content>
          <Icon
            type="material-community"
            name={menu.iconNameRight}
            color={menu.iconColorRight}
          />
        </ListItem>
      ))}
      <Modal isVisible={showModal} setVisible={setShowModal}>
        {renderComponent}
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  menuItem: {
    borderBottomWidth: 1,
    borderBottomColor: "#a7bfd3",
  },
});
