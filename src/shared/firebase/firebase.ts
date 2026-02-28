import AsyncStorage from "@react-native-async-storage/async-storage";
import { getApp, getApps, initializeApp } from "firebase/app";
import {
    Auth,
    // @ts-ignore
    getReactNativePersistence,
    initializeAuth,
} from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyCGCTer8BoXS29kVcBhP7YD5svEa1KbcbU",
    authDomain: "innoma-pesca.firebaseapp.com",
    projectId: "innoma-pesca",
    storageBucket: "innoma-pesca.firebasestorage.app",
    messagingSenderId: "273844309566",
    appId: "1:273844309566:web:16706ea13715a4b050cb6f",
    measurementId: "G-Z2EJDSDZ58"
};

export const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const auth: Auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
});
