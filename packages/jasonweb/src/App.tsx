import './index.scss';

import { RouterProvider } from 'react-router-dom';

import useSmoothMousePosition from './hooks/useSmoothMousePosition';
import { router } from './router';

function GradientOnMouse() {
  const mousePos = useSmoothMousePosition();

  return (
    <div
      className="pointer-events-none fixed inset-0 z-30 transition duration-300 lg:absolute"
      style={{
        background: `radial-gradient(600px at ${mousePos.x}px ${mousePos.y}px, rgba(29, 78, 216, 0.15), transparent 80%)`,
      }}
    />
  );
}

function App() {
  return (
    <>
      <RouterProvider router={router} />
      <GradientOnMouse />
    </>
  );
}

export default App;
