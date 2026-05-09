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

function ImporterShipments() {

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

  const [shipments, setShipments] =
    useState([]);

  const [notifications,
  setNotifications] = useState([]);

  const [loading, setLoading] =
    useState(true);

  /* =========================
     FETCH SHIPMENTS
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
     API CALL
  ========================= */

  const fetchShipments =
  async () => {

    try {

      const res =
        await API.get('/shipments');

      /* =========================
         FILTER IMPORTER SHIPMENTS
      ========================= */

      const importerShipments =

        res.data.filter(

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

  const deliveredCount =

    shipments.filter(

      shipment =>

        shipment.shipmentStatus ===
        'delivered'

    ).length;

  const transitCount =

    shipments.filter(

      shipment =>

        shipment.shipmentStatus ===
        'in-transit'

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

        Track Shipments

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

          value={deliveredCount}

        />

        <DashboardCard

          title='In Transit'

          value={transitCount}

        />

      </div>

      {/* =========================
          SHIPMENT LIST
      ========================= */}

      <div
        className='section-box'
        style={{ marginTop: '40px' }}
      >

        <h2>
          Shipment Details
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

        <div className='users-grid'>

          {

            shipments.map(
              (shipment) => (

                <div

                  className='user-card'

                  key={shipment._id}

                >

                  <h3>

                    {
                      shipment.order
                      ?.product
                      ?.productName
                    }

                  </h3>

                  <p>

                    <strong>
                      Tracking ID:
                    </strong>

                    {' '}

                    {
                      shipment.trackingId
                    }

                  </p>

                  <p>

                    <strong>
                      Status:
                    </strong>

                    {' '}

                    {
                      shipment.shipmentStatus
                    }

                  </p>

                  <p>

                    <strong>
                      Current Location:
                    </strong>

                    {' '}

                    {
                      shipment.currentLocation
                    }

                  </p>

                  <p>

                    <strong>
                      Estimated Delivery:
                    </strong>

                    {' '}

                    {
                      shipment.estimatedDelivery
                    }

                  </p>

                  <p>

                    <strong>
                      Shipping Method:
                    </strong>

                    {' '}

                    {
                      shipment.shippingMethod
                    }

                  </p>

                  <p>

                    <strong>
                      Shipping Cost:
                    </strong>

                    {' '}

                    ₹{
                      shipment.shippingCost
                    }

                  </p>

                  {/* =========================
                      STATUS BADGE
                  ========================= */}

                  <span

                    className={`badge badge-shipped`}

                  >

                    {
                      shipment.shipmentStatus
                    }

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

export default ImporterShipments;