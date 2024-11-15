// Importando as funções necessárias do Firebase
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getFunctions } from "firebase/functions";

const firebaseConfig = {
  apiKey: "AIzaSyCKmAyGMvidv5IibBEet1BhC2sQI3eccV8",
  authDomain: "educontrol-5175c.firebaseapp.com",
  projectId: "educontrol-5175c",
  storageBucket: "educontrol-5175c.appspot.com",
  messagingSenderId: "123141814518",
  appId: "1:123141814518:web:131a65925f5c90823414d7",
  measurementId: "G-H56QM0RZZY",
};

// Inicializando o aplicativo Firebase com as configurações fornecidas
const app = initializeApp(firebaseConfig);

// Obtendo uma instância do Firestore (banco de dados) associada ao aplicativo
const db = getFirestore(app);

// Obtendo uma instância do Auth (autenticação) associada ao aplicativo
const auth = getAuth(app);

// Obtendo uma instância do Storage (armazenamento de arquivos) associada ao aplicativo
const storage = getStorage(app);
const functions = getFunctions(app);

// Exportando as instâncias do Firestore, Auth e Storage para uso em outros arquivos
export { db, auth, storage, functions };
