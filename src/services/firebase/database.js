import { db } from "./firebase";
import { 
    collection, 
    doc,
    addDoc, 
    getDocs, 
    getDoc,
    setDoc,
    updateDoc, 
    arrayUnion, 
    arrayRemove, 
    query, 
    where
} from "firebase/firestore";

export const addNewUsername = async (uid, username) => {
  return setDoc(doc(db, "users", uid), {
    username: username,
    platforms: [],
    private_key: false
  });
};

export const addNewPlatform = async (uid, platform) => {
  return updateDoc(doc(db, "users", uid), {
    platforms: arrayUnion(platform)
  });
};

export const removePlatform = async (uid, platform) => {
  return updateDoc(doc(db, "users", uid), {
    platforms: arrayRemove(platform)
  });
};

export const getPlatforms = async (uid) => {
    return getDoc(doc(db, "users", uid));
};

export const privateKeyExists = async (uid) => {
    try {
      const privateKey = doc(db, "users", uid);
      const docSnap = await getDoc(privateKey);
      if (docSnap.exists()) {
        return docSnap.data().private_key
      } else {
        console.log("No such uid!");
      }
    } catch (error) {
      console.error("Error:", error);
      throw new Error("Error al verificar la existencia de la clave privada");
    }
};

export const isValidUsername = async (username) => {
    const usernames = collection(db, "users");
    const q = query(usernames, where("username", "==", username));

    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
        return true
    }
    return false
};

export const isUserExists = async (uid) => {
    const uids = collection(db, "users", uid);

    const querySnapshot = await getDocs(uids);

    if (querySnapshot.empty) {
        return false
    }
    return true
};