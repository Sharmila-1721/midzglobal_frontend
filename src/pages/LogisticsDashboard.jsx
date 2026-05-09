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

function LogisticsDashboard() {

  /* =========================
     STATE
  ========================= */

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

    fetchShipments();

    /* =========================
       SOCKET EVENTS
    ========================= */

    socket.on(

      'shipment-created',

      (data) => {

        setNotifications(
          prev => [

            ...prev,

            data.message

          ]
        );

        fetchShipments();

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

        fetchShipments();

      }

    );

    return () => {

      socket.off('shipment-created');

      socket.off('shipment-status-updated');

    };

  }, []);

  /* =========================
     FETCH SHIPMENTS
  ========================= */

  const fetchShipments =
  async () => {

    try {

      const res =
        await API.get('/shipments');

      setShipments(res.data);

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);

    }

  };

  /* =========================
     ANALYTICS
  ========================= */

  const deliveredShipments =

    shipments.filter(

      shipment =>

        shipment.shipmentStatus ===
        'delivered'

    ).length;

  const transitShipments =

    shipments.filter(

      shipment =>

        shipment.shipmentStatus ===
        'in-transit'

    ).length;

  const pendingShipments =

    shipments.filter(

      shipment =>

        shipment.shipmentStatus ===
        'created'

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

        Logistics Dashboard

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

          title='Total Shipments'

          value={shipments.length}

        />

        <DashboardCard

          title='Delivered'

          value={deliveredShipments}

        />

        <DashboardCard

          title='In Transit'

          value={transitShipments}

        />

        <DashboardCard

          title='Pending'

          value={pendingShipments}

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
          Recent Shipments
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

                  <tr key={shipment._id}>

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

    </DashboardLayout>

  );

}

export default LogisticsDashboard;