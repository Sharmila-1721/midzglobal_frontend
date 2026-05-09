function DashboardCard({

  title,

  value

}) {

  return (

    <div className='dashboard-card'>

      {/* =========================
          CARD TITLE
      ========================= */}

      <h3>

        {title}

      </h3>

      {/* =========================
          CARD VALUE
      ========================= */}

      <h1>

        {value}

      </h1>

    </div>

  );

}

export default DashboardCard;