import './index.scss';

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Home from './features/Home';

function App() {
  return (
    <div className="mx-auto min-h-screen max-w-screen-xl px-6 md:px-12 lg:px-24">
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
