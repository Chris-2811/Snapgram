import {
  useContext,
  createContext,
  ReactNode,
  useState,
  useEffect,
} from "react";
import {
  User,
  UserCredential,
  browserSessionPersistence,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  setPersistence,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth, db } from "@/lib/firebase/firebase";

const initialState = {
  user: null,
  logIn: () => Promise.reject(),
  signUp: () => Promise.reject(),
  isLoading: true,
};

interface AuthContextValues {
  user: User | null;
  logIn: (email: string, password: string) => Promise<UserCredential>;
  signUp: (email: string, password: string) => Promise<UserCredential>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextValues>(initialState);

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser: User | null) => {
      setUser(currentUser);
      setIsLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  async function logIn(email: string, password: string) {
    setPersistence(auth, browserSessionPersistence);
    return signInWithEmailAndPassword(auth, email, password);
  }

  async function signUp(email: string, password: string) {
    return createUserWithEmailAndPassword(auth, email, password);
  }

  return (
    <AuthContext.Provider value={{ signUp, logIn, user, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
