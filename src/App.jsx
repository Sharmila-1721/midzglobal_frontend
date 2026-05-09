import {

  BrowserRouter,
  Routes,
  Route,
  Navigate

} from 'react-router-dom';

/* =========================
   AUTH PAGES
========================= */

import Login
from './pages/Login';

import Register
from './pages/Register';

/* =========================
   DASHBOARDS
========================= */

import AdminDashboard
from './pages/AdminDashboard';

import ExporterDashboard
from './pages/ExporterDashboard';

import ImporterDashboard
from './pages/ImporterDashboard';

import LogisticsDashboard
from './pages/LogisticsDashboard';

/* =========================
   PRODUCTS
========================= */

import Products
from './pages/Products';

import AddProduct
from './pages/AddProduct';

/* =========================
   INQUIRIES
========================= */

import SendInquiry
from './pages/SendInquiry';

import ExporterInquiries
from './pages/ExporterInquiries';

/* =========================
   ORDERS
========================= */

import ImporterOrders
from './pages/ImporterOrders';

import ExporterOrders
from './pages/ExporterOrders';

/* =========================
   SHIPMENTS
========================= */

import LogisticsShipments
from './pages/LogisticsShipments';

import ImporterShipments
from './pages/ImporterShipments';

/* =========================
   COMPONENTS
========================= */

import ProtectedRoute
from './components/ProtectedRoute';

function App() {

  return (

    <BrowserRouter>

      <Routes>

        {/* =========================
            DEFAULT ROUTE
        ========================= */}

        <Route

          path='/'

          element={
            <Navigate to='/login' />
          }

        />

        {/* =========================
            AUTH ROUTES
        ========================= */}

        <Route

          path='/login'

          element={<Login />}

        />

        <Route

          path='/register'

          element={<Register />}

        />

        {/* =========================
            ADMIN ROUTES
        ========================= */}

        <Route

          path='/admin'

          element={

            <ProtectedRoute role='admin'>

              <AdminDashboard />

            </ProtectedRoute>

          }

        />

        {/* =========================
            EXPORTER ROUTES
        ========================= */}

        <Route

          path='/exporter'

          element={

            <ProtectedRoute role='exporter'>

              <ExporterDashboard />

            </ProtectedRoute>

          }

        />

        <Route

          path='/add-product'

          element={

            <ProtectedRoute role='exporter'>

              <AddProduct />

            </ProtectedRoute>

          }

        />

        <Route

          path='/exporter-inquiries'

          element={

            <ProtectedRoute role='exporter'>

              <ExporterInquiries />

            </ProtectedRoute>

          }

        />

        <Route

          path='/exporter-orders'

          element={

            <ProtectedRoute role='exporter'>

              <ExporterOrders />

            </ProtectedRoute>

          }

        />

        {/* =========================
            IMPORTER ROUTES
        ========================= */}

        <Route

          path='/importer'

          element={

            <ProtectedRoute role='importer'>

              <ImporterDashboard />

            </ProtectedRoute>

          }

        />

        <Route

          path='/products'

          element={

            <ProtectedRoute>

              <Products />

            </ProtectedRoute>

          }

        />

        <Route

          path='/send-inquiry'

          element={

            <ProtectedRoute role='importer'>

              <SendInquiry />

            </ProtectedRoute>

          }

        />

        <Route

          path='/importer-orders'

          element={

            <ProtectedRoute role='importer'>

              <ImporterOrders />

            </ProtectedRoute>

          }

        />

        <Route

          path='/importer-shipments'

          element={

            <ProtectedRoute role='importer'>

              <ImporterShipments />

            </ProtectedRoute>

          }

        />

        {/* =========================
            LOGISTICS ROUTES
        ========================= */}

        <Route

          path='/logistics'

          element={

            <ProtectedRoute role='logistics'>

              <LogisticsDashboard />

            </ProtectedRoute>

          }

        />

        <Route

          path='/logistics-shipments'

          element={

            <ProtectedRoute role='logistics'>

              <LogisticsShipments />

            </ProtectedRoute>

          }

        />

      </Routes>

    </BrowserRouter>

  );

}

export default App;