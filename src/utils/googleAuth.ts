import { signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { auth } from '../firebase';

export const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    return result.user;
  
};
export const signOutGoogle = async () => {
    await signOut(auth);
}
