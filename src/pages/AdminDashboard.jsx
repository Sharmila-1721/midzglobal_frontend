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

function AdminDashboard() {

  /* =========================
     STATE
  ========================= */

  const [pendingUsers,
  setPendingUsers] = useState([]);

  const [analytics,
  setAnalytics] = useState({

    totalUsers: 0,

    totalProducts: 0,

    totalOrders: 0,

    totalInquiries: 0,

    approvedUsers: 0,

    pendingUsers: 0

  });

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

      'new-user',

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

      'user-approved',

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

      'user-rejected',

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

      socket.off('new-user');

      socket.off('user-approved');

      socket.off('user-rejected');

    };

  }, []);

  /* =========================
     FETCH DASHBOARD DATA
  ========================= */

  const fetchDashboardData =
  async () => {

    try {

      /* PENDING USERS */

      const pendingRes =
        await API.get(

          '/admin/pending-users'

        );

      setPendingUsers(
        pendingRes.data
      );

      /* ANALYTICS */

      const analyticsRes =
        await API.get(

          '/admin/analytics'

        );

      setAnalytics(
        analyticsRes.data
      );

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);

    }

  };

  /* =========================
     APPROVE USER
  ========================= */

  const approveUser =
  async (id) => {

    try {

      const res =
        await API.put(

          `/admin/approve/${id}`

        );

      alert(res.data.message);

      fetchDashboardData();

    } catch (error) {

      console.log(error);

    }

  };

  /* =========================
     REJECT USER
  ========================= */

  const rejectUser =
  async (id) => {

    try {

      const res =
        await API.put(

          `/admin/reject/${id}`

        );

      alert(res.data.message);

      fetchDashboardData();

    } catch (error) {

      console.log(error);

    }

  };

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

        Admin Dashboard

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

          title='Total Users'

          value={analytics.totalUsers}

        />

        <DashboardCard

          title='Products'

          value={analytics.totalProducts}

        />

        <DashboardCard

          title='Orders'

          value={analytics.totalOrders}

        />

        <DashboardCard

          title='Inquiries'

          value={analytics.totalInquiries}

        />

      </div>

      {/* =========================
          BUSINESS STATS
      ========================= */}

      <div
        className='section-box'
        style={{ marginTop: '40px' }}
      >

        <h2>
          Platform Overview
        </h2>

        <br />

        <p>

          Approved Users:
          {' '}

          <strong>

            {
              analytics.approvedUsers
            }

          </strong>

        </p>

        <br />

        <p>

          Pending Approvals:
          {' '}

          <strong>

            {
              analytics.pendingUsers
            }

          </strong>

        </p>

      </div>

      {/* =========================
          PENDING USERS
      ========================= */}

      <div
        className='section-box'
        style={{ marginTop: '40px' }}
      >

        <h2>
          Pending User Approvals
        </h2>

        {

          pendingUsers.length === 0 && (

            <div className='empty-state'>

              <h2>
                No Pending Users
              </h2>

            </div>

          )

        }

        <div className='users-grid'>

          {

            pendingUsers.map(user => (

              <div

                className='user-card'

                key={user._id}

              >

                <h3>

                  {user.name}

                </h3>

                <p>

                  <strong>
                    Email:
                  </strong>

                  {' '}

                  {user.email}

                </p>

                <p>

                  <strong>
                    Role:
                  </strong>

                  {' '}

                  {user.role}

                </p>

                <p>

                  <strong>
                    Company:
                  </strong>

                  {' '}

                  {user.companyName}

                </p>

                <p>

                  <strong>
                    Country:
                  </strong>

                  {' '}

                  {user.country}

                </p>

                {/* =========================
                    ACTION BUTTONS
                ========================= */}

                <button

                  className='btn-success'

                  onClick={() =>

                    approveUser(user._id)

                  }

                >

                  Approve

                </button>

                <button

                  className='btn-danger'

                  onClick={() =>

                    rejectUser(user._id)

                  }

                  style={{
                    marginTop: '10px'
                  }}

                >

                  Reject

                </button>

              </div>

            ))

          }

        </div>

      </div>

    </DashboardLayout>

  );

}

export default AdminDashboard;