import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  browserLocalPersistence,
  getAuth,
  onAuthStateChanged,
  setPersistence,
  signInWithEmailAndPassword,
  signOut,
  User,
} from "firebase/auth";
import { collection, doc, getDoc, onSnapshot } from "firebase/firestore"; // garantir que você importe esses métodos do Firebase Firestore
import { db } from "../services/firebaseConnection"; // ajuste esta importação para o seu arquivo de configuração

interface AuthContextProps {
  user: User | null;
  loading: boolean;
  uidContextInstitution: string | null;
  setUidContextInstitution: (uid: string | null) => void;
  setUidContextTeacher: (uid: string | null) => void;
  uidContextTeacher: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  getUIDS: (userUid: string) => Promise<void>;
  fetchDataTypeUser: (userUid: string) => Promise<void>;
  dataTeacherinInstitutions: (userUid: string) => void;
  isUser: string | boolean;
  isAdmin: string | boolean;
  uidContextGeral: string | null;
  teacherName: string | null;
  teacherEmail: string | null;
}

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthContext = createContext<AuthContextProps | undefined>(
  undefined
);

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [uidContextGeral, setUidContextGeral] = useState<string | null>(
    getLocalStorageItem("uidContextGeral")
  );
  const [uidContextInstitution, setUidContextInstitution] = useState<
    string | null
  >(getLocalStorageItem("uidContextInstitution"));
  const [uidContextTeacher, setUidContextTeacher] = useState<string | null>(
    getLocalStorageItem("uidContextTeacher")
  );
  const [teacherName, setTeacherName] = useState<string | null>(
    getLocalStorageItem("teacherName")
  );
  const [teacherEmail, setTeacherEmail] = useState<string | null>(
    getLocalStorageItem("teacherEmail")
  );
  const [isUser, setIsUser] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  const auth = getAuth();

  useEffect(() => {
    setPersistence(auth, browserLocalPersistence).catch((error) => {
      console.error("Erro ao configurar a persistência: ", error);
    });

    const escutandoEstado = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => escutandoEstado();
  }, [auth]);

  useEffect(() => {
    saveLocalStorageItem("uidContextInstitution", uidContextInstitution);
    saveLocalStorageItem("uidContextGeral", uidContextGeral);
    saveLocalStorageItem("teacherName", teacherName);
    saveLocalStorageItem("teacherEmail", teacherEmail);
  }, [uidContextInstitution, uidContextGeral]);

  useEffect(() => {
    saveLocalStorageItem("uidContextTeacher", uidContextTeacher);
    saveLocalStorageItem("uidContextGeral", uidContextGeral);
    saveLocalStorageItem("teacherName", teacherName);
    saveLocalStorageItem("teacherEmail", teacherEmail);
  }, [uidContextTeacher, uidContextGeral]);

  // Função de login
  const login = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const userUid = userCredential.user.uid;
      await getUIDS(userUid);
    } catch (error) {
      console.error("Erro ao fazer login: ", error);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Erro ao fazer logout: ", error);
    }
  };

  const getUIDS = useCallback(async (userUid: string) => {
    const searchInstitutionUid = async () => {
      const dataInstitutionRef = doc(db, "institutions", userUid);
      const dataInstitution = await getDoc(dataInstitutionRef);
      if (dataInstitution.exists()) {
        const dataInstitutionExist = dataInstitution.data();
        const uidGeral = dataInstitutionExist.uid;
        setUidContextGeral(uidGeral);

        return true;
      }
      return false;
    };

    const searchTeacherUid = async () => {
      const dataTeacherRef = doc(db, "teachers", userUid);

      const dataTeacher = await getDoc(dataTeacherRef);
      if (dataTeacher.exists()) {
        const dataTeacherExist = dataTeacher.data();
        const uidGeral = dataTeacherExist.uidInstitution;
        setUidContextGeral(uidGeral);
        return true;
      }
      return false;
    };

    try {
      const uidGeneralFound =
        (await searchInstitutionUid()) || (await searchTeacherUid());
      if (!uidGeneralFound) {
        throw new Error("Uid geral não encontrado.");
      }
    } catch (error) {
      console.error("Erro ao obter UID:", error);
    }
  }, []);

  const fetchDataTypeUser = useCallback(async (uid: string) => {
    if (!uid || typeof uid !== "string") {
      throw new Error("O ID fornecido não é válido");
    }

    setIsAdmin(false);
    setIsUser(false);

    const userUID = auth.currentUser?.uid;

    if (!userUID) {
      console.error("Usuário não está autenticado");
      return;
    }

    const searchTypeInstitution = async () => {
      const dataRefInstituicao = doc(db, "institutions", uid);
      const dataInstitution = await getDoc(dataRefInstituicao);

      if (dataInstitution.exists() && dataInstitution.data()?.userTypeAdmin) {
        setIsAdmin(true);
        return true;
      }
      return false;
    };

    const searchTypeTeacher = async () => {
      const dataRefProfessor = doc(db, "teachers", uid);
      const dataTeacher = await getDoc(dataRefProfessor);

      if (dataTeacher.exists() && dataTeacher.data()?.userTypeNormal) {
        setIsUser(true);
        return true;
      }
      return false;
    };

    try {
      const typeFound =
        (await searchTypeInstitution()) || (await searchTypeTeacher());
      if (!typeFound) {
        throw new Error("Usuário não encontrado em nenhuma das coleções.");
      }
    } catch (error) {
      console.error("Erro ao obter status:", error);
    }
  }, []);

  const dataTeacherinInstitutions = (userUid: string) => {
    const classesRefData = collection(
      db,
      "institutions",
      userUid,
      "uidTeachers"
    );

    console.log(classesRefData);

    return onSnapshot(classesRefData, (snapshot) => {
      const dataTeacher = snapshot.docs.map((doc) => ({
        name: doc.data().name,
        uid: doc.data().uid,
        email: doc.data().email,
      }));
      console.log(dataTeacher);

      const teacherExists = dataTeacher.some(
        (teacher) => teacher.uid === uidContextTeacher
      );
      console.log(teacherExists);

      if (teacherExists) {
        setTeacherName(
          dataTeacher.find((teacher) => teacher.uid === uidContextTeacher)?.name
        );
        setTeacherEmail(
          dataTeacher.find((teacher) => teacher.uid === uidContextTeacher)
            ?.email
        );
      }
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        uidContextInstitution,
        setUidContextInstitution,
        setUidContextTeacher,
        uidContextTeacher,
        login,
        logout,
        getUIDS,
        uidContextGeral,
        fetchDataTypeUser,
        isUser,
        isAdmin,
        dataTeacherinInstitutions,
        teacherName,
        teacherEmail,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

function getLocalStorageItem(key: string): string | null {
  return localStorage.getItem(key);
}

function saveLocalStorageItem(key: string, value: string | null) {
  if (value) {
    localStorage.setItem(key, value);
  } else {
    localStorage.removeItem(key);
  }
}

export const useAuth = (): AuthContextProps | any => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
