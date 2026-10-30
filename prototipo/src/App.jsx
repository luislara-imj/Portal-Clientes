import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import { ToastProvider } from './orbita';
import { StoreProvider } from './store/index.js';
import { aplicarTemaGuardado } from './layout/tema.js';
import Login from './pages/Login.jsx';
import MisCampanas from './pages/MisCampanas.jsx';
import DetalleCampana from './pages/DetalleCampana.jsx';
import Propuesta from './pages/Propuesta.jsx';
import Cotizacion from './pages/Cotizacion.jsx';
import Instalacion from './pages/Instalacion.jsx';
import Reportes from './pages/Reportes.jsx';
import VisorReporte from './pages/VisorReporte.jsx';
import Componentes from './pages/Componentes.jsx';

// El tema recordado ('obp-tema') se aplica antes del primer render, también en login.
aplicarTemaGuardado();

const FUTURO_ROUTER = { v7_startTransition: true, v7_relativeSplatPath: true };

export default function App() {
  return (
    <StoreProvider>
      <ToastProvider>
        <HashRouter future={FUTURO_ROUTER}>
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/campanas" element={<MisCampanas />} />
            <Route path="/campanas/:codigo" element={<DetalleCampana />} />
            <Route path="/campanas/:codigo/propuesta" element={<Propuesta />} />
            <Route path="/campanas/:codigo/cotizacion" element={<Cotizacion />} />
            <Route path="/campanas/:codigo/instalacion" element={<Instalacion />} />
            <Route path="/campanas/:codigo/reportes" element={<Reportes />} />
            <Route path="/campanas/:codigo/reportes/:periodo" element={<VisorReporte />} />
            <Route path="/componentes" element={<Componentes />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </HashRouter>
      </ToastProvider>
    </StoreProvider>
  );
}
