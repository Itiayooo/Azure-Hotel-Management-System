import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyBDtZSzwoi1POM7D9pOnlEqiDglbIEI5oY",
  authDomain: "my-hotel-6aa7a.firebaseapp.com",
  projectId: "my-hotel-6aa7a",
  storageBucket: "my-hotel-6aa7a.firebasestorage.app",
  messagingSenderId: "864627689565",
  appId: "1:864627689565:web:778eb9ca97d76b8ad365b4"
};

const app = initializeApp(firebaseConfig);

export default app