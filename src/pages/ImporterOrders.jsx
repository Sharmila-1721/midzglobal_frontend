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

function ImporterOrders() {

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

  const [orders, setOrders] =
    useState([]);

  const [notifications,
  setNotifications] = useState([]);

  const [loading, setLoading] =
    useState(true);

  /* =========================
     FETCH ORDERS
  ========================= */

  useEffect(() => {

    fetchOrders();

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

        fetchOrders();

      }

    );

    socket.on(

      'order-status-updated',

      (data) => {

        setNotifications(
          prev => [

            ...prev,

            data.message

          ]
        );

        fetchOrders();

      }

    );

    return () => {

      socket.off('new-order');

      socket.off('order-status-updated');

    };

  }, []);

  /* =========================
     API CALL
  ========================= */

  const fetchOrders =
  async () => {

    try {

      const res =
        await API.get(

          `/orders/importer/${user._id}`

        );

      setOrders(res.data);

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

  const deliveredOrders =

    orders.filter(

      order =>
      order.status === 'delivered'

    ).length;

  const pendingOrders =

    orders.filter(

      order =>
      order.status === 'pending'

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

        Importer Orders

      </h1>

      {/* =========================
          NOTIFICATIONS
      ========================= */}

      <NotificationBox
        notifications={notifications}
      />

      {/* =========================
          ANALYTICS
      ========================= */}

      <div className='cards-grid'>

        <DashboardCard

          title='Total Orders'

          value={totalOrders}

        />

        <DashboardCard

          title='Delivered'

          value={deliveredOrders}

        />

        <DashboardCard

          title='Pending'

          value={pendingOrders}

        />

        <DashboardCard

          title='Total Spent'

          value={`₹${totalSpent}`}

        />

      </div>

      {/* =========================
          ORDERS SECTION
      ========================= */}

      <div
        className='section-box'
        style={{ marginTop: '40px' }}
      >

        <h2>
          Order History
        </h2>

        {

          orders.length === 0 && (

            <div className='empty-state'>

              <h2>
                No Orders Found
              </h2>

            </div>

          )

        }

        <div className='users-grid'>

          {

            orders.map(order => (

              <div

                className='user-card'

                key={order._id}

              >

                <h3>

                  {
                    order.product
                    ?.productName
                  }

                </h3>

                <p>

                  <strong>
                    Quantity:
                  </strong>

                  {' '}

                  {order.quantity}

                </p>

                <p>

                  <strong>
                    Total Amount:
                  </strong>

                  {' '}

                  ₹{order.totalAmount}

                </p>

                <p>

                  <strong>
                    Payment:
                  </strong>

                  {' '}

                  {
                    order.paymentStatus
                  }

                </p>

                <p>

                  <strong>
                    Status:
                  </strong>

                  {' '}

                  {order.status}

                </p>

                <p>

                  <strong>
                    Exporter:
                  </strong>

                  {' '}

                  {
                    order.exporter
                    ?.companyName
                  }

                </p>

                <p>

                  <strong>
                    Ordered On:
                  </strong>

                  {' '}

                  {

                    new Date(
                      order.createdAt
                    ).toLocaleDateString()

                  }

                </p>

                {/* =========================
                    STATUS BADGE
                ========================= */}

                <span

                  className={`badge ${
                    order.status ===
                    'delivered'

                    ? 'badge-approved'

                    : 'badge-pending'
                  }`}

                >

                  {order.status}

                </span>

              </div>

            ))

          }

        </div>

      </div>

    </DashboardLayout>

  );

}

export default ImporterOrders;