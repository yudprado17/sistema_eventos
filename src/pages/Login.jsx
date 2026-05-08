import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Terminal, Lock, User, ShieldAlert } from 'lucide-react';

const Login = () => {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  // Redirigir si ya está logueado
  useEffect(() => {
    if (user) navigate('/');
  }, [user, navigate]);

  // Efecto de Lluvia Matrix
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$+-*/=%"\'#&_(),.;:?!\\|{}<>[]^~';
    const fontSize = 16;
    const columns = canvas.width / fontSize;
    const drops = Array(Math.floor(columns)).fill(1);

    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#0F0'; // Matrix Green
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = characters.charAt(Math.floor(Math.random() * characters.length));
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    const interval = setInterval(draw, 33);
    
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    const success = login(username, password);
    if (!success) {
      setError('ACCESO DENEGADO: CREDENCIALES INVÁLIDAS');
    }
  };

  return (
    <div className="matrix-container">
      <canvas ref={canvasRef} className="matrix-canvas" />
      
      {/* Efecto de Escaneo CRT */}
      <div className="crt-overlay"></div>
      
      <div className="login-box glass animate-in">
        <div className="terminal-header">
          <Terminal size={18} />
          <span>SECURE_ACCESS_PROTOCOL.v2</span>
        </div>
        
        <div className="p-8">
          <h1 className="text-3xl font-bold mb-2 matrix-text-glow">IDENTIFÍQUESE</h1>
          <p className="text-xs text-green-500/70 mb-8 tracking-widest uppercase">Sistema de Gestión de Eventos Central</p>
          
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="input-group">
              <label className="matrix-label"><User size={14} /> USUARIO</label>
              <div className="relative">
                <input 
                  type="text" 
                  className="matrix-input"
                  placeholder="USERNAME"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div className="input-group">
              <label className="matrix-label"><Lock size={14} /> CONTRASEÑA</label>
              <div className="relative">
                <input 
                  type="password" 
                  className="matrix-input"
                  placeholder="**********"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            {error && (
              <div className="error-box animate-pulse flex items-center gap-2">
                <ShieldAlert size={16} />
                <span>{error}</span>
              </div>
            )}
            
            <button type="submit" className="matrix-btn">
              EJECUTAR ACCESO
            </button>
          </form>
          
          <div className="mt-8 text-center">
            <p className="text-[10px] text-green-500/30 font-mono">
              IP_TRACKING: ENABLED | ENCRYPTION: AES-256
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
