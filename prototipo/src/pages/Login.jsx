import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, Input, Logo } from '../orbita';
import '../layout/layout.css';

const CORREO_VALIDO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ESPERA_MS = 800;

// Login simulado: cualquier correo válido y contraseña no vacía entran. Sin barra superior.
export default function Login() {
  const navigate = useNavigate();
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [errores, setErrores] = useState({});
  const [cargando, setCargando] = useState(false);
  const correoRef = useRef(null);
  const contrasenaRef = useRef(null);
  const timer = useRef(null);

  useEffect(() => () => clearTimeout(timer.current), []);

  const enviar = (e) => {
    e.preventDefault();
    if (cargando) return;
    const nuevos = {};
    if (!CORREO_VALIDO.test(correo.trim())) nuevos.correo = 'Escribe un correo válido, por ejemplo nombre@empresa.com.';
    if (contrasena.length === 0) nuevos.contrasena = 'Escribe tu contraseña.';
    setErrores(nuevos);
    if (nuevos.correo) {
      correoRef.current?.focus();
      return;
    }
    if (nuevos.contrasena) {
      contrasenaRef.current?.focus();
      return;
    }
    setCargando(true);
    timer.current = setTimeout(() => navigate('/campanas'), ESPERA_MS);
  };

  return (
    <main className="login">
      <Card as="section" padding="lg" className="login__tarjeta" aria-labelledby="login-t">
        <div className="pg-pila pg-pila--md">
          <Logo size="lg" />
          <div className="pg-pila">
            <h1 id="login-t" className="pg-titulo">Bienvenido</h1>
            <p className="pg-texto">Ingresa con el correo y la contraseña que te entregó OBP.</p>
          </div>
          <form className="login__form" onSubmit={enviar} noValidate>
            <Input
              ref={correoRef}
              label="Correo"
              type="email"
              size="md"
              autoComplete="username"
              placeholder="nombre@empresa.com"
              value={correo}
              error={errores.correo}
              onChange={(e) => {
                setCorreo(e.target.value);
                if (errores.correo) setErrores((x) => ({ ...x, correo: undefined }));
              }}
            />
            <Input
              ref={contrasenaRef}
              label="Contraseña"
              type="password"
              size="md"
              autoComplete="current-password"
              placeholder="Tu contraseña"
              value={contrasena}
              error={errores.contrasena}
              onChange={(e) => {
                setContrasena(e.target.value);
                if (errores.contrasena) setErrores((x) => ({ ...x, contrasena: undefined }));
              }}
            />
            {/* Envuelto en una fila: .ui-button--full usa flex: 1 1 0 y en una columna flex colapsa la altura. */}
            <div className="pg-fila">
              <Button type="submit" variant="primary" size="md" fullWidth loading={cargando}>
                Entrar
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </main>
  );
}
