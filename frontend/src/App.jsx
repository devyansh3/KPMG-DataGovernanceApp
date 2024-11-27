import { useState } from "react";
import { BrowserRouter } from "react-router-dom";
import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import Home from "./Components/Home";
import DataGov from "./pages/DataGov";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/datagov" element={<DataGov />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

// import { BrowserRouter } from 'react-router-dom';
// import AppRoutes from './routes/routes';

// const App = () => {
//   return (
//     <BrowserRouter>
//       <AppRoutes />
//     </BrowserRouter>
//   );
// };

// export default App;
