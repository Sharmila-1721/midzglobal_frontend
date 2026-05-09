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

function ExporterInquiries() {

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

  const [inquiries, setInquiries] =
    useState([]);

  const [notifications,
  setNotifications] = useState([]);

  const [loading, setLoading] =
    useState(true);

  /* =========================
     FETCH INQUIRIES
  ========================= */

  useEffect(() => {

    fetchInquiries();

    /* =========================
       SOCKET EVENTS
    ========================= */

    socket.on(

      'new-inquiry',

      (data) => {

        setNotifications(
          prev => [

            ...prev,

            data.message

          ]
        );

        fetchInquiries();

      }

    );

    socket.on(

      'inquiry-responded',

      (data) => {

        setNotifications(
          prev => [

            ...prev,

            data.message

          ]
        );

        fetchInquiries();

      }

    );

    return () => {

      socket.off('new-inquiry');

      socket.off('inquiry-responded');

    };

  }, []);

  /* =========================
     API CALL
  ========================= */

  const fetchInquiries =
  async () => {

    try {

      const res =
        await API.get(

          `/inquiries/exporter/${user._id}`

        );

      setInquiries(res.data);

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);

    }

  };

  /* =========================
     CREATE ORDER
  ========================= */

  const createOrder =
  async (inquiryId) => {

    try {

      const res =
        await API.post(

          '/orders',

          {

            inquiryId

          }

        );

      alert(res.data.message);

      fetchInquiries();

    } catch (error) {

      console.log(error);

      alert(

        error.response?.data?.message ||

        'Order Creation Failed'

      );

    }

  };

  /* =========================
     ANALYTICS
  ========================= */

  const totalInquiries =
    inquiries.length;

  const acceptedInquiries =

    inquiries.filter(

      inquiry =>
      inquiry.status === 'accepted'

    ).length;

  const pendingInquiries =

    inquiries.filter(

      inquiry =>
      inquiry.status === 'pending'

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

        Exporter Inquiries

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

          title='Total Inquiries'

          value={totalInquiries}

        />

        <DashboardCard

          title='Accepted'

          value={acceptedInquiries}

        />

        <DashboardCard

          title='Pending'

          value={pendingInquiries}

        />

      </div>

      {/* =========================
          INQUIRIES LIST
      ========================= */}

      <div
        className='section-box'
        style={{ marginTop: '40px' }}
      >

        <h2>
          Inquiry Requests
        </h2>

        {

          inquiries.length === 0 && (

            <div className='empty-state'>

              <h2>
                No Inquiries Found
              </h2>

            </div>

          )

        }

        <div className='users-grid'>

          {

            inquiries.map(
              (inquiry) => (

                <div

                  className='user-card'

                  key={inquiry._id}

                >

                  <h3>

                    {
                      inquiry.product
                      ?.productName
                    }

                  </h3>

                  <p>

                    <strong>
                      Importer:
                    </strong>

                    {' '}

                    {
                      inquiry.importer
                      ?.companyName
                    }

                  </p>

                  <p>

                    <strong>
                      Quantity:
                    </strong>

                    {' '}

                    {inquiry.quantity}

                  </p>

                  <p>

                    <strong>
                      Offer Price:
                    </strong>

                    {' '}

                    ₹{
                      inquiry.offerPrice
                    }

                  </p>

                  <p>

                    <strong>
                      Message:
                    </strong>

                    {' '}

                    {inquiry.message}

                  </p>

                  <p>

                    <strong>
                      Status:
                    </strong>

                    {' '}

                    {inquiry.status}

                  </p>

                  {/* =========================
                      CREATE ORDER BUTTON
                  ========================= */}

                  {

                    inquiry.status !==
                    'accepted' && (

                      <button

                        onClick={() =>

                          createOrder(
                            inquiry._id
                          )

                        }

                      >

                        Accept & Create Order

                      </button>

                    )

                  }

                  {/* =========================
                      STATUS BADGE
                  ========================= */}

                  <br />
                  <br />

                  <span

                    className={`badge ${
                      inquiry.status ===
                      'accepted'

                      ? 'badge-approved'

                      : 'badge-pending'
                    }`}

                  >

                    {inquiry.status}

                  </span>

                </div>

              )
            )

          }

        </div>

      </div>

    </DashboardLayout>

  );

}

export default ExporterInquiries;