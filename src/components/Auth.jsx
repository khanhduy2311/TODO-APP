import { useState } from 'react';
import { auth, db } from '../firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  updateProfile 
} from "firebase/auth";
import { setDoc, doc, serverTimestamp } from "firebase/firestore";
import './AuthPage.css';

function AuthPage() {
  const [isSignUpActive, setIsSignUpActive] = useState(false);
  const [signUpName, setSignUpName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');

  const [error, setError] = useState('');

  // Đăng ký
  const handleSignUp = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, signUpEmail, signUpPassword);
      const user = userCredential.user;

      // Cập nhật displayName trong Firebase Auth
      if (signUpName) {
        await updateProfile(user, { displayName: signUpName });
      }

      // Tạo doc trong Firestore collection "users"
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: user.email,
        displayName: signUpName || "",
        friends: [],
        online: true,
        lastSeen: serverTimestamp()
      });

      console.log("✅ User created in Firestore");

    } catch (err) {
      setError(err.message.replace('Firebase: ', ''));
    }
  };

  // Đăng nhập
  const handleSignIn = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await signInWithEmailAndPassword(auth, signInEmail, signInPassword);
    } catch (err) {
      setError(err.message.replace('Firebase: ', ''));
    }
  };

  return (
    <div className="auth-body">
      <div className={`auth-container ${isSignUpActive ? "right-panel-active" : ""}`}>
        
        {/* Form Đăng Ký */}
        <div className="form-container sign-up-container">
          <form onSubmit={handleSignUp}>
            <h1>Create Account</h1>
            <span>or use your email for registration</span>
            <input 
              type="text" 
              placeholder="Name" 
              value={signUpName} 
              onChange={(e) => setSignUpName(e.target.value)} 
              required 
            />
            <input 
              type="email" 
              placeholder="Email" 
              value={signUpEmail} 
              onChange={(e) => setSignUpEmail(e.target.value)} 
              required 
            />
            <input 
              type="password" 
              placeholder="Password" 
              value={signUpPassword} 
              onChange={(e) => setSignUpPassword(e.target.value)} 
              required 
            />
            <button type="submit" style={{marginTop: '10px'}}>Sign Up</button>
            {error && isSignUpActive && <p className="error-message">{error}</p>}
          </form>
        </div>
        
        {/* Form Đăng Nhập */}
        <div className="form-container sign-in-container">
          <form onSubmit={handleSignIn}>
            <h1>Sign In</h1>
            <span>or use your account</span>
            <input 
              type="email" 
              placeholder="Email" 
              value={signInEmail} 
              onChange={(e) => setSignInEmail(e.target.value)} 
              required 
            />
            <input 
              type="password" 
              placeholder="Password" 
              value={signInPassword} 
              onChange={(e) => setSignInPassword(e.target.value)} 
              required 
            />
            <a href="#">Forgot your password?</a>
            <button type="submit">Sign In</button>
            {error && !isSignUpActive && <p className="error-message">{error}</p>}
          </form>
        </div>
        
        {/* Lớp Overlay */}
        <div className="overlay-container">
          <div className="overlay">
            <div className="overlay-panel overlay-left">
              <h1>Welcome Back!</h1>
              <p>To keep connected with us please login with your personal info</p>
              <button className="ghost" onClick={() => setIsSignUpActive(false)}>Sign In</button>
            </div>
            <div className="overlay-panel overlay-right">
              <h1>Hello, Friend!</h1>
              <p>Enter your personal details and start journey with us</p>
              <button className="ghost" onClick={() => setIsSignUpActive(true)}>Sign Up</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthPage;
