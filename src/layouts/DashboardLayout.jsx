import Sidebar
from '../components/Sidebar';

function DashboardLayout({

  children

}) {

  return (

    <div className='dashboard-layout'>

      {/* =========================
          SIDEBAR
      ========================= */}

      <Sidebar />

      {/* =========================
          MAIN CONTENT
      ========================= */}

      <div className='dashboard-main'>

        {children}

      </div>

    </div>

  );

}

export default DashboardLayout;