import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyB3H-AQn_xFJ_TIOpwtUBnEKSXeZHoAmyY",
  authDomain: "edmonton-eventendpoint.firebaseapp.com",
  projectId: "edmonton-eventendpoint",
  storageBucket: "edmonton-eventendpoint.appspot.com",
  messagingSenderId: "392201757993",
  appId: "1:392201757993:web:644c1c48b4004a171e4338",
  measurementId: "G-50R17VC8YJ"
};

export const app = initializeApp(firebaseConfig);
