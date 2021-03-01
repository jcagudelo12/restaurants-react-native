import { firebaseApp } from "./firebase";
import firebase from "firebase";
import "firebase/firestore";

const db = firebase.firestore(firebaseApp);

export const isUserLogged = () => {
  let islogged = false;
  firebase.auth().onAuthStateChanged((user) => {
    user !== null && (islogged = true);
  });
  return islogged;
};

export const getCurrentUser = () => {
  return firebase.auth().currentUser;
};

export const registerUser = async (email, password) => {
  const result = { statusResponse: true, error: null };
  try {
    await firebase.auth().createUserWithEmailAndPassword(email, password);
  } catch (error) {
    result.statusResponse = false;
    result.error = "Este correo ya ha sido registrado.";
  }
  return result;
};

export const closeSesion = () => {
  return firebase.auth().signOut();
};
