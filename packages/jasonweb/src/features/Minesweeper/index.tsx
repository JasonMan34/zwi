import { Route, Routes } from 'react-router-dom';

function Minesweeper() {
  return (
    <>
      <Route path="a" element={<span>Minesweeper</span>} />
      <Route path="sandbox" element={<span>Sandbox</span>} />
    </>
  );
}

export default Minesweeper;
