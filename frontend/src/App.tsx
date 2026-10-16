import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { RootLayout } from "./components/layout/RootLayout";
import { ProtectedRoute } from "./components/common/ProtectedRoute";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import React from "react";
import "./App.css";

const HomePlaceholder = () => (
  <div className="flex-1 py-12 text-center bg-raised border-2 border-edge shadow-glow rounded-xl">
    <h1 className="text-4xl font-black text-ghost tracking-tight">
      Marketplace Core Node
    </h1>
    <p className="mt-2 text-sm text-mist font-medium">
      Public 3D asset query channels executing successfully...
    </p>
  </div>
);

const UploadPlaceholder = () => (
  <div className="flex-1 py-12 text-center bg-raised border-2 border-edge shadow-glow rounded-xl">
    <h1 className="text-4xl font-black text-ghost tracking-tight">
      Secure Creator Portal
    </h1>
    <p className="mt-2 text-sm text-mist font-medium">
      AWS S3 Option-B binary streaming environment fully isolated.
    </p>
  </div>
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <HomePlaceholder />,
      },
      {
        path: "upload",
        element: (
          <ProtectedRoute>
            <UploadPlaceholder />
          </ProtectedRoute>
        ),
      },
      {
        path: "assets/:id",
        element: (
          <div className="p-8 font-black">
            3D Viewport Deck Canvas Routing Node
          </div>
        ),
      },
      {
        path: "vault",
        element: (
          <ProtectedRoute>
            <div className="p-8 font-black">User Purchases Storage Node</div>
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);

export const App: React.FC = () => {
  return <RouterProvider router={router} />;
};

export default App;
