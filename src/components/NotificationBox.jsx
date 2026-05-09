function NotificationBox({

  notifications

}) {

  return (

    <div className='notification-box'>

      {/* =========================
          TITLE
      ========================= */}

      <h3>

        Live Notifications

      </h3>

      {/* =========================
          EMPTY STATE
      ========================= */}

      {

        notifications.length === 0 && (

          <div className='notification-item'>

            No Notifications Yet

          </div>

        )

      }

      {/* =========================
          NOTIFICATION LIST
      ========================= */}

      {

        notifications.map(

          (notification, index) => (

            <div

              className='notification-item'

              key={index}

            >

              {notification}

            </div>

          )

        )

      }

    </div>

  );

}

export default NotificationBox;