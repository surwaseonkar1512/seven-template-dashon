import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { publicRoutes, authProtectedRoutes } from "./Routes/Route";
import PrivateRoute from "./Routes/PrivateRoute";
import PublicRoute from "./Routes/PublicRoute";
import store from "./Redux/store";

const App = () => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          {publicRoutes.map(({ path, component }, i) => (
            <Route key={i} path={path} element={<PublicRoute>{component}</PublicRoute>} />
          ))}

          {authProtectedRoutes.map(({ path, component, children, allowedRoles }, i) => (
            <Route
              key={i}
              path={path}
              element={<PrivateRoute allowedRoles={allowedRoles}>{component}</PrivateRoute>}
            >
              {children?.map((child, j) => (
                <Route key={j} path={child.path} element={child.element} />
              ))}
            </Route>
          ))}
        </Routes>
      </BrowserRouter>
    </Provider>
  );
};

export default App;
