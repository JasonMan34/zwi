import { Route } from 'react-router-dom';

export function Component() {
  return (
    <>
      <Route path="a" element={<span>Minesweeper</span>} />
      <Route path="sandbox" element={<span>Sandbox</span>} />
    </>
  );
}

Component.displayName = 'Minesweeper';
