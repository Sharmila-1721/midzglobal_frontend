import {

  useEffect,
  useState

} from 'react';

import DashboardLayout
from '../layouts/DashboardLayout';

import API
from '../services/api';

import socket
from '../services/socket';

function LogisticsShipments() {

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

  const [orders, setOrders] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  /* =========================
     FETCH DATA
  ========================= */

  useEffect(() => {

    fetchOrders();

    fetchShipments();

    socket.on(

      'new-order',

      () => {

        fetchOrders();

      }

    );

    socket.on(

      'shipment-created',

      () => {

        fetchShipments();

        fetchOrders();

      }

    );

    socket.on(

      'shipment-status-updated',

      () => {

        fetchShipments();

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
     FETCH PENDING ORDERS
  ========================= */

  const fetchOrders =
  async () => {

    try {

      const res =
        await API.get(

          '/orders/pending-shipments'

        );

      console.log(
        'Pending Orders:',
        res.data
      );

      setOrders(res.data);

    } catch (error) {

      console.log(error);

    }

  };

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
     CREATE SHIPMENT
  ========================= */

  const createShipment =
  async (orderId) => {

    try {

      const res =
        await API.post(

          '/shipments',

          {

            order: orderId,

            logisticsProvider:
            user._id,

            shippingMethod:
            'Air Cargo',

            estimatedDelivery:
            '7 Days',

            shippingCost: 5000

          }

        );

      alert(res.data.message);

      fetchShipments();

      fetchOrders();

    } catch (error) {

      console.log(error);

      alert(

        error.response?.data?.message ||

        'Shipment Creation Failed'

      );

    }

  };

  /* =========================
     UPDATE SHIPMENT STATUS
  ========================= */

  const updateStatus =
  async (

    shipmentId,

    shipmentStatus

  ) => {

    try {

      const res =
        await API.put(

          `/shipments/${shipmentId}`,

          {

            shipmentStatus,

            currentLocation:
            'International Hub'

          }

        );

      alert(res.data.message);

      fetchShipments();

    } catch (error) {

      console.log(error);

    }

  };

  /* =========================
     FILTER UNSHIPPED ORDERS
  ========================= */

  const pendingOrders =

    orders.filter(order =>

      !shipments.some(

        shipment =>

          shipment.order?._id ===
          order._id

      )

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

      <h1 className='page-title'>

        Logistics Shipment Management

      </h1>

      {/* =========================
          CREATE SHIPMENT
      ========================= */}

      <div className='section-box'>

        <h2>
          Pending Shipment Orders
        </h2>

        {

          pendingOrders.length === 0 && (

            <div className='empty-state'>

              <h2>
                No Pending Orders
              </h2>

            </div>

          )

        }

        <div className='users-grid'>

          {

            pendingOrders.map(
              (order) => (

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

                  <button

                    onClick={() =>

                      createShipment(
                        order._id
                      )

                    }

                  >

                    Create Shipment

                  </button>

                </div>

              )
            )

          }

        </div>

      </div>

      {/* =========================
          SHIPMENT LIST
      ========================= */}

      <div className='section-box'>

        <h2>
          All Shipments
        </h2>

        {

          shipments.length === 0 && (

            <div className='empty-state'>

              <h2>
                No Shipments Available
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
                      Location:
                    </strong>

                    {' '}

                    {
                      shipment.currentLocation
                    }

                  </p>

                  <p>

                    <strong>
                      Delivery:
                    </strong>

                    {' '}

                    {
                      shipment.estimatedDelivery
                    }

                  </p>

                  <select

                    value={
                      shipment.shipmentStatus
                    }

                    onChange={(e) =>

                      updateStatus(

                        shipment._id,

                        e.target.value

                      )

                    }

                  >

                    <option value='created'>
                      Created
                    </option>

                    <option value='picked-up'>
                      Picked Up
                    </option>

                    <option value='in-transit'>
                      In Transit
                    </option>

                    <option value='customs-clearance'>
                      Customs Clearance
                    </option>

                    <option value='out-for-delivery'>
                      Out For Delivery
                    </option>

                    <option value='delivered'>
                      Delivered
                    </option>

                  </select>

                </div>

              )
            )

          }

        </div>

      </div>

    </DashboardLayout>

  );

}

export default LogisticsShipments;