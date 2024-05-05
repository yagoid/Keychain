import { db } from "./firebase";
import { 
    collection, 
    doc,
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

export const changePrivateKeyState = async (uid, state) => {
  return updateDoc(doc(db, "users", uid), {
    private_key: state
  });
};

export const getPlatforms = async (uid) => {
  try {
    const platformsDoc = doc(db, "users", uid);
    const docSnap = await getDoc(platformsDoc);
    if (docSnap.exists()) {
      return docSnap.data().platforms
    } else {
      console.log("No such data!");
    }
  } catch (error) {
    console.error("Error:", error);
    throw new Error("Error al consultar las plataformas");
  }
};

export const getUsername = async (uid) => {
  try {
    const usersDoc = doc(db, "users", uid);
    const docSnap = await getDoc(usersDoc);
    if (docSnap.exists()) {
      return docSnap.data().username
    } else {
      console.log("No such user!");
    }
  } catch (error) {
    console.error("Error:", error);
    throw new Error("Error al consultar el nombre de usuario");
  }
};

export const privateKeyExists = async (uid) => {
    try {
      const privateKey = doc(db, "users", uid);
      const docSnap = await getDoc(privateKey);
      if (docSnap.exists()) {
        return docSnap.data().private_key
      } else {
        console.log("No such data!");
      }
    } catch (error) {
      console.error("Error:", error);
      throw new Error("Error al verificar la existencia de la clave privada");
    }
};

export const platformExists = async (uid, platform) => {
  try {
    const platformsDoc = doc(db, "users", uid);
    const docSnap = await getDoc(platformsDoc);
    if (docSnap.exists()) {
      if (docSnap.data().platforms.includes(platform)) {
        return true
      } else {
        return false
      }
    } else {
      console.log("No such data!");
    }
  } catch (error) {
    console.error("Error:", error);
    throw new Error("Error al verificar la existencia de la plataforma");
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