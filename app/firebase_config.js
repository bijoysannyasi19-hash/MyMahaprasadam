import { initializeApp } from "firebase/app";   
import { getFirestore } from "firebase/firestore";
import{getStorage} from "firebase/storage"

const firebaseConfig = {
  apiKey: "AIzaSyC5OLhHDfY8AAXPnH778al-aWG_rlJiKQQ",
  authDomain: "railmahaprasadam.firebaseapp.com",
  projectId: "railmahaprasadam",
  storageBucket: "railmahaprasadam.firebasestorage.app",
  messagingSenderId: "867584998023",
  appId: "1:867584998023:web:0817475478d72ad6aa5622",
  measurementId: "G-QNM0XLN7H1"
};




  const app= initializeApp(firebaseConfig)
  
  export const db= getFirestore(app)
  export const storage=getStorage(app)
