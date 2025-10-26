// App.tsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import { Toaster } from "sonner";
import Dashboard from "./pages/Dashboard";

type Props = {};

const App = (props: Props) => {
  return (
    <Router>
      <Toaster richColors position="top-right" />

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
};

export default App;
