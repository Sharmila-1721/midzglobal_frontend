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

function ExporterDashboard() {

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

  const [inquiries, setInquiries] =
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

      'new-product',

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

      'new-inquiry',

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

    return () => {

      socket.off('new-product');

      socket.off('new-inquiry');

      socket.off('new-order');

    };

  }, []);

  /* =========================
     FETCH DASHBOARD DATA
  ========================= */

  const fetchDashboardData =
  async () => {

    try {

      /* PRODUCTS */

      const productRes =
        await API.get('/products');

      const exporterProducts =

        productRes.data.filter(

          product =>

            product.exporter
            ?._id === user._id

        );

      setProducts(exporterProducts);

      /* INQUIRIES */

      const inquiryRes =
        await API.get(

          `/inquiries/exporter/${user._id}`

        );

      setInquiries(
        inquiryRes.data
      );

      /* ORDERS */

      const orderRes =
        await API.get(

          `/orders/exporter/${user._id}`

        );

      setOrders(orderRes.data);

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);

    }

  };

  /* =========================
     ANALYTICS
  ========================= */

  const totalRevenue =

    orders.reduce(

      (acc, order) =>

        acc + order.totalAmount,

      0

    );

  const pendingInquiries =

    inquiries.filter(

      inquiry =>
      inquiry.status === 'pending'

    ).length;

  const deliveredOrders =

    orders.filter(

      order =>
      order.status === 'delivered'

    ).length;

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

        Exporter Dashboard

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

          title='My Products'

          value={products.length}

        />

        <DashboardCard

          title='Inquiries'

          value={inquiries.length}

        />

        <DashboardCard

          title='Orders'

          value={orders.length}

        />

        <DashboardCard

          title='Revenue'

          value={`₹${totalRevenue}`}

        />

      </div>

      {/* =========================
          QUICK STATS
      ========================= */}

      <div
        className='section-box'
        style={{ marginTop: '40px' }}
      >

        <h2>
          Business Overview
        </h2>

        <br />

        <p>

          Pending Inquiries:
          {' '}

          <strong>

            {pendingInquiries}

          </strong>

        </p>

        <br />

        <p>

          Delivered Orders:
          {' '}

          <strong>

            {deliveredOrders}

          </strong>

        </p>

        <br />

        <p>

          Active Products:
          {' '}

          <strong>

            {

              products.filter(

                product =>

                  product.status ===
                  'approved'

              ).length

            }

          </strong>

        </p>

      </div>

      {/* =========================
          RECENT PRODUCTS
      ========================= */}

      <div
        className='section-box'
        style={{ marginTop: '40px' }}
      >

        <h2>
          My Products
        </h2>

        {

          products.length === 0 && (

            <div className='empty-state'>

              <h2>
                No Products Added
              </h2>

            </div>

          )

        }

        <div className='products-grid'>

          {

            products.map(
              (product) => (

                <div

                  className='product-card'

                  key={product._id}

                >

                  <img

                    src={

                      product.image ||

                      'https://via.placeholder.com/400x250'

                    }

                    alt={product.productName}

                  />

                  <div className='product-content'>

                    <h2>

                      {
                        product.productName
                      }

                    </h2>

                    <p>

                      {product.description}

                    </p>

                    <p>

                      <strong>
                        Price:
                      </strong>

                      {' '}

                      ₹{product.price}

                    </p>

                    <p>

                      <strong>
                        Stock:
                      </strong>

                      {' '}

                      {product.stock}

                    </p>

                    <p>

                      <strong>
                        Category:
                      </strong>

                      {' '}

                      {
                        product.category
                      }

                    </p>

                  </div>

                </div>

              )
            )

          }

        </div>

      </div>

    </DashboardLayout>

  );

}

export default ExporterDashboard;