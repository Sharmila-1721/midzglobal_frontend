import {

  useEffect,
  useState

} from 'react';

import DashboardLayout
from '../layouts/DashboardLayout';

import DashboardCard
from '../components/DashboardCard';

import NotificationBox
from '../components/NotificationBox';

import API
from '../services/api';

import socket
from '../services/socket';

function ImporterDashboard() {

  /* =========================
     CURRENT USER
  ========================= */

  const user =
    JSON.parse(
      localStorage.getItem('user')
    );

  /* =========================
     STATE
  ========================= */

  const [products, setProducts] =
    useState([]);

  const [orders, setOrders] =
    useState([]);

  const [shipments, setShipments] =
    useState([]);

  const [notifications,
  setNotifications] = useState([]);

  const [loading, setLoading] =
    useState(true);

  /* =========================
     FETCH DATA
  ========================= */

  useEffect(() => {

    fetchDashboardData();

    /* =========================
       SOCKET EVENTS
    ========================= */

    socket.on(

      'new-order',

      (data) => {

        setNotifications(
          prev => [

            ...prev,

            data.message

          ]
        );

        fetchDashboardData();

      }

    );

    socket.on(

      'shipment-created',

      (data) => {

        setNotifications(
          prev => [

            ...prev,

            data.message

          ]
        );

        fetchDashboardData();

      }

    );

    socket.on(

      'shipment-status-updated',

      (data) => {

        setNotifications(
          prev => [

            ...prev,

            data.message

          ]
        );

        fetchDashboardData();

      }

    );

    return () => {

      socket.off('new-order');

      socket.off('shipment-created');

      socket.off(
        'shipment-status-updated'
      );

    };

  }, []);

  /* =========================
     FETCH ALL DATA
  ========================= */

  const fetchDashboardData =
  async () => {

    try {

      const productRes =
        await API.get('/products');

      const orderRes =
        await API.get(

          `/orders/importer/${user._id}`

        );

      const shipmentRes =
        await API.get('/shipments');

      /* PRODUCTS */

      setProducts(productRes.data);

      /* ORDERS */

      setOrders(orderRes.data);

      /* FILTER SHIPMENTS */

      const importerShipments =

        shipmentRes.data.filter(

          shipment =>

            shipment.order
            ?.importer?._id ===
            user._id

        );

      setShipments(
        importerShipments
      );

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);

    }

  };

  /* =========================
     ANALYTICS
  ========================= */

  const totalOrders =
    orders.length;

  const totalShipments =
    shipments.length;

  const deliveredShipments =

    shipments.filter(

      shipment =>

        shipment.shipmentStatus ===
        'delivered'

    ).length;

  const totalSpent =

    orders.reduce(

      (acc, order) =>

        acc + order.totalAmount,

      0

    );

  /* =========================
     LOADING
  ========================= */

  if (loading) {

    return (

      <DashboardLayout>

        <div className='loader'></div>

      </DashboardLayout>

    );

  }

  return (

    <DashboardLayout>

      {/* =========================
          PAGE TITLE
      ========================= */}

      <h1 className='page-title'>

        Importer Dashboard

      </h1>

      {/* =========================
          NOTIFICATIONS
      ========================= */}

      <NotificationBox
        notifications={notifications}
      />

      {/* =========================
          ANALYTICS CARDS
      ========================= */}

      <div className='cards-grid'>

        <DashboardCard

          title='Marketplace Products'

          value={products.length}

        />

        <DashboardCard

          title='My Orders'

          value={totalOrders}

        />

        <DashboardCard

          title='My Shipments'

          value={totalShipments}

        />

        <DashboardCard

          title='Total Spent'

          value={`₹${totalSpent}`}

        />

      </div>

      {/* =========================
          RECENT SHIPMENTS
      ========================= */}

      <div
        className='section-box'
        style={{ marginTop: '40px' }}
      >

        <h2>
          Recent Shipment Updates
        </h2>

        {

          shipments.length === 0 && (

            <div className='empty-state'>

              <h2>
                No Shipments Found
              </h2>

            </div>

          )

        }

        <table>

          <thead>

            <tr>

              <th>
                Tracking ID
              </th>

              <th>
                Product
              </th>

              <th>
                Status
              </th>

              <th>
                Location
              </th>

              <th>
                Delivery
              </th>

            </tr>

          </thead>

          <tbody>

            {

              shipments.map(
                (shipment) => (

                  <tr
                    key={shipment._id}
                  >

                    <td>

                      {
                        shipment.trackingId
                      }

                    </td>

                    <td>

                      {
                        shipment.order
                        ?.product
                        ?.productName
                      }

                    </td>

                    <td>

                      {
                        shipment.shipmentStatus
                      }

                    </td>

                    <td>

                      {
                        shipment.currentLocation
                      }

                    </td>

                    <td>

                      {
                        shipment.estimatedDelivery
                      }

                    </td>

                  </tr>

                )
              )

            }

          </tbody>

        </table>

      </div>

      {/* =========================
          QUICK SUMMARY
      ========================= */}

      <div
        className='section-box'
        style={{ marginTop: '40px' }}
      >

        <h2>
          Business Summary
        </h2>

        <br />

        <p>

          Total Delivered Shipments:
          {' '}

          <strong>

            {deliveredShipments}

          </strong>

        </p>

        <br />

        <p>

          Active Orders:
          {' '}

          <strong>

            {

              orders.filter(

                order =>

                  order.status !==
                  'delivered'

              ).length

            }

          </strong>

        </p>

        <br />

        <p>

          Connected Suppliers:
          {' '}

          <strong>

            {

              new Set(

                orders.map(

                  order =>

                    order.exporter?._id

                )

              ).size

            }

          </strong>

        </p>

      </div>

    </DashboardLayout>

  );

}

export default ImporterDashboard;