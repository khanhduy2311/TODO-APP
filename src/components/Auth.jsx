import { useState } from 'react';
import { auth } from '../firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword 
} from "firebase/auth";

// Sử dụng một số style từ file index.css
function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Reset error message

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        // Firebase's onAuthStateChanged will handle the rest
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
        // Firebase's onAuthStateChanged will handle the rest
      }
    } catch (err) {
      setError(err.message);
      console.error(err);
    }
  };

  return (
    <div id="auth-container">
      <div className="auth-box">
        <h2>{isLogin ? 'Đăng nhập' : 'Đăng ký'}</h2>
        <form onSubmit={handleSubmit}>
          <input 
            type="email" 
            placeholder="Email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required 
          />
          <input 
            type="password" 
            placeholder="Mật khẩu"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required 
          />
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <div className="auth-buttons">
            <button type="submit">{isLogin ? 'Đăng nhập' : 'Đăng ký'}</button>
          </div>
        </form>
        <button onClick={() => setIsLogin(!isLogin)} style={{ background: 'none', border: 'none', color: 'var(--accent-color)', cursor: 'pointer', marginTop: '15px' }}>
          {isLogin ? 'Chưa có tài khoản? Đăng ký' : 'Đã có tài khoản? Đăng nhập'}
        </button>
      </div>
    </div>
  );
}

export default Auth;