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
import { doc, getDoc } from "firebase/firestore"; // garantir que você importe esses métodos do Firebase Firestore
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
  uidContextGeral: string | null;
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
  }, [uidContextInstitution, uidContextGeral]);

  useEffect(() => {
    saveLocalStorageItem("uidContextTeacher", uidContextTeacher);
    saveLocalStorageItem("uidContextGeral", uidContextGeral);
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

  // Função de logout
  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Erro ao fazer logout: ", error);
    }
  };

  // Função getUIDS
  const getUIDS = useCallback(async (userUid: string) => {
    const dadosInstituicao = async () => {
      const institutionRef = doc(db, "institutions", userUid);
      const dadosInstituicao = await getDoc(institutionRef);
      if (dadosInstituicao.exists()) {
        const uidInstituicao = dadosInstituicao.data();
        const uidGeral = uidInstituicao.uid;
        setUidContextGeral(uidGeral);

        return true;
      }
      return false;
    };

    const dadosProfessor = async () => {
      const professorRef = doc(db, "teachers", userUid);

      const dadosProfessor = await getDoc(professorRef);
      if (dadosProfessor.exists()) {
        const uidInstituicaoProfessor = dadosProfessor.data();
        const uidGeral = uidInstituicaoProfessor.uidInstitution;
        setUidContextGeral(uidGeral);
        return true;
      }
      return false;
    };

    try {
      const uidGeralEncontrado =
        (await dadosInstituicao()) || (await dadosProfessor());
      if (!uidGeralEncontrado) {
        throw new Error("Uid geral não encontrado.");
      }
    } catch (error) {
      console.error("Erro ao obter UID:", error);
    }
  }, []);

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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Função para obter item do localStorage
function getLocalStorageItem(key: string): string | null {
  return localStorage.getItem(key);
}

// Função para salvar item no localStorage
function saveLocalStorageItem(key: string, value: string | null) {
  if (value) {
    localStorage.setItem(key, value);
  } else {
    localStorage.removeItem(key);
  }
}

// Hook para usar o AuthContext
export const useAuth = (): AuthContextProps | any => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
