import {
  GoogleAuthProvider,
  signInWithPopup,
  setPersistence,
  browserSessionPersistence,
} from "firebase/auth";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/firebase/firebase";
import { useNavigate } from "react-router-dom";
import { setDoc, doc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase/firebase";

function OAuth() {
  const navigate = useNavigate();

  async function onGoogleClick() {
    try {
      await setPersistence(auth, browserSessionPersistence);
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;

      console.log(user);

      const docRef = doc(db, "users", user.uid);
      await setDoc(docRef, {
        fullName: user.displayName,
        email: user.email,
        createdAt: serverTimestamp(),
      });

      navigate("/");
    } catch (error) {}
  }

  return (
    <>
      <Button variant="oAuth" size="md" type="button">
        <div onClick={onGoogleClick} className="flex items-center gap-3">
          <img src="/assets/icons/google.svg" alt="google-icon" />
          <p>Sign in with Google</p>
        </div>
      </Button>
    </>
  );
}

export default OAuth;