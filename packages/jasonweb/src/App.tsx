import './index.scss';

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Home from './features/Home';
import useSmoothMousePosition from './hooks/useSmoothMousePosition';

function GradientOnMouse() {
  const mousePos = useSmoothMousePosition();

  return (
    <div
      className="pointer-events-none fixed inset-0 z-30 transition duration-300 lg:absolute"
      style={{
        background: `radial-gradient(600px at ${mousePos.x}px ${mousePos.y}px, rgba(29, 78, 216, 0.15), transparent 80%)`,
      }}
    ></div>
  );
}

function App() {
  return (
    <>
      <div className="mx-auto min-h-screen max-w-screen-xl px-6 md:px-12 lg:px-24 font-sans">
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
        </Router>
      </div>
      <GradientOnMouse />
    </>
  );
}

export default App;
