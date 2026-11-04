import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import { ToastProvider } from './orbita';
import { StoreProvider } from './store/index.js';
import { aplicarTemaGuardado } from './layout/tema.js';
import Login from './pages/Login.jsx';
import MisCampanas from './pages/MisCampanas.jsx';
import CarpetaMarca from './pages/CarpetaMarca.jsx';
import Propuesta from './pages/Propuesta.jsx';
import Cotizacion from './pages/Cotizacion.jsx';
import Instalacion from './pages/Instalacion.jsx';
import Reportes from './pages/Reportes.jsx';
import VisorReporte from './pages/VisorReporte.jsx';
import DescargaReportes from './pages/DescargaReportes.jsx';
import DetalleTestigo from './pages/DetalleTestigo.jsx';
import Componentes from './pages/Componentes.jsx';
import PaginaNoEncontrada from './pages/PaginaNoEncontrada.jsx';
import { LimiteErrores } from './layout/LimiteErrores.jsx';

// El tema recordado ('obp-tema') se aplica antes del primer render, también en login.
aplicarTemaGuardado();

const FUTURO_ROUTER = { v7_startTransition: true, v7_relativeSplatPath: true };

export default function App() {
  return (
    <StoreProvider>
      <ToastProvider>
        <HashRouter future={FUTURO_ROUTER}>
          <LimiteErrores>
            <Routes>
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="/login" element={<Login />} />
              <Route path="/campanas" element={<MisCampanas />} />
              <Route path="/campanas/carpeta/:marca" element={<CarpetaMarca />} />
              <Route path="/campanas/:codigo" element={<Navigate to="/campanas" replace />} />
              <Route path="/campanas/:codigo/propuesta" element={<Propuesta />} />
              <Route path="/campanas/:codigo/cotizacion" element={<Cotizacion />} />
              <Route path="/campanas/:codigo/instalacion" element={<Instalacion />} />
              <Route path="/campanas/:codigo/reportes" element={<Reportes />} />
              <Route path="/campanas/:codigo/reportes/descargas" element={<DescargaReportes />} />
              <Route path="/campanas/:codigo/reportes/medio/:medioId" element={<DetalleTestigo />} />
              <Route path="/campanas/:codigo/reportes/:periodo" element={<VisorReporte />} />
              <Route path="/componentes" element={<Componentes />} />
              <Route path="*" element={<PaginaNoEncontrada />} />
            </Routes>
          </LimiteErrores>
        </HashRouter>
      </ToastProvider>
    </StoreProvider>
  );
}
