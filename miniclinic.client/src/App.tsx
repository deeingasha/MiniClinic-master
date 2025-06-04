import React from 'react'
import { useAuthStore } from './stores/auth.store'
import { Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './layouts/app-layout';
import LoadingScreen from './components/loading-screen';
import { ProtectedRoute } from './components/protected-route';

function App() {

  const { isAuthenticated } = useAuthStore();


  const Login = React.lazy(() => import("./pages/auth/Login"));
  const ChangePassword = React.lazy(() => import("./pages/auth/ChangePassword"));

  const Home = React.lazy(() => import("./pages/home/Home"));

  const TreatmentDates = React.lazy(() => import("./pages/treatment-dates/TreatmentDates"));
  const TreatmentDate = React.lazy(() => import("./pages/treatment-dates/TreatmentDate"));
  const EntityRegistration = React.lazy(() => import("./pages/entity-registration/EntityRegistration"));
  const EntityRegistrationTeatment = React.lazy(() => import("./pages/entity-registration/EntityRegistrationTeatment"));

  const DrugEntry = React.lazy(() => import("./pages/pharmacy/drug-entry/DrugEntry"));
  const ReceiveDrugs = React.lazy(() => import("./pages/pharmacy/ReceiveDrugs"));
  const PurchaseOrders = React.lazy(() => import("./pages/pharmacy/purchase-orders/PurchaseOrders"));
  const PurchaseOrder = React.lazy(() => import("./pages/pharmacy/purchase-orders/PurchaseOrder"));


  return (<React.Suspense fallback={<LoadingScreen />}>
    <Routes>
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/" replace /> : <Login />}
      />

      <Route
        path="/"
        element={
          // <ProtectedRoute>
            <AppLayout />
          // </ProtectedRoute>
        }
      >
        <Route index element={<Home />} />

        {/* Account Routes */}
        <Route path="account">
          <Route path="password" element={<ChangePassword />} />
        </Route>

        {/* Healthcare Routes */}
        <Route path="healthcare">
          <Route
            path="treatment-dates"
            element={
              <ProtectedRoute allowedRoles={["doctor"]}>
                <TreatmentDates />
              </ProtectedRoute>
            }
          />

          <Route
            path="treatment-dates/:pk"
            element={
              <ProtectedRoute allowedRoles={["doctor"]}>
                <TreatmentDate />
              </ProtectedRoute>
            }
          />

          <Route
            path="registration/:pk"
            element={
              // <ProtectedRoute allowedRoles={["doctor"]}>
                <EntityRegistrationTeatment />
              // </ProtectedRoute>
            }
          />

          <Route
            path="registration"
            element={
              // <ProtectedRoute allowedRoles={["doctor", "patient"]}>
                <EntityRegistration />
              // </ProtectedRoute>
            }
          />
        </Route>

        {/* Pharmacy Routes */}
        <Route path="pharmacy">
          <Route path="drug-entry" element={<DrugEntry />} />
          <Route path="receive-drugs" element={<ReceiveDrugs />} />
          <Route path="purchase-orders" element={<PurchaseOrders />} />
          <Route path="purchase-orders/:pk" element={<PurchaseOrder />} />
        </Route>
      </Route>
    </Routes>
  </React.Suspense>)
}

export default App
