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

function ExporterOrders() {

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

          `/orders/exporter/${user._id}`

        );

      setOrders(res.data);

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);

    }

  };

  /* =========================
     UPDATE ORDER STATUS
  ========================= */

  const updateOrderStatus =
  async (

    orderId,
    status

  ) => {

    try {

      const res =
        await API.put(

          `/orders/${orderId}`,

          {

            status,

            paymentStatus:
            'paid'

          }

        );

      alert(res.data.message);

      fetchOrders();

    } catch (error) {

      console.log(error);

    }

  };

  /* =========================
     ANALYTICS
  ========================= */

  const totalOrders =
    orders.length;

  const shippedOrders =

    orders.filter(

      order =>
      order.status === 'shipped'

    ).length;

  const deliveredOrders =

    orders.filter(

      order =>
      order.status === 'delivered'

    ).length;

  const totalRevenue =

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

        Exporter Orders

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

          title='Shipped'

          value={shippedOrders}

        />

        <DashboardCard

          title='Delivered'

          value={deliveredOrders}

        />

        <DashboardCard

          title='Revenue'

          value={`₹${totalRevenue}`}

        />

      </div>

      {/* =========================
          ORDERS LIST
      ========================= */}

      <div
        className='section-box'
        style={{ marginTop: '40px' }}
      >

        <h2>
          Order Management
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
                    Importer:
                  </strong>

                  {' '}

                  {
                    order.importer
                    ?.companyName
                  }

                </p>

                <p>

                  <strong>
                    Quantity:
                  </strong>

                  {' '}

                  {order.quantity}

                </p>

                <p>

                  <strong>
                    Total:
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

                {/* =========================
                    STATUS UPDATE
                ========================= */}

                <select

                  value={order.status}

                  onChange={(e) =>

                    updateOrderStatus(

                      order._id,

                      e.target.value

                    )

                  }

                >

                  <option value='pending'>
                    Pending
                  </option>

                  <option value='confirmed'>
                    Confirmed
                  </option>

                  <option value='processing'>
                    Processing
                  </option>

                  <option value='shipped'>
                    Shipped
                  </option>

                  <option value='delivered'>
                    Delivered
                  </option>

                </select>

                {/* =========================
                    STATUS BADGE
                ========================= */}

                <br />
                <br />

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

export default ExporterOrders;