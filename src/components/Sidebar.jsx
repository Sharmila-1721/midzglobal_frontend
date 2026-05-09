import {

  Link,
  useNavigate

} from 'react-router-dom';

function Sidebar() {

  /* =========================
     NAVIGATION
  ========================= */

  const navigate = useNavigate();

  /* =========================
     CURRENT USER
  ========================= */

  const user =
    JSON.parse(
      localStorage.getItem('user')
    );

  /* =========================
     LOGOUT
  ========================= */

  const handleLogout = () => {

    localStorage.removeItem('token');

    localStorage.removeItem('user');

    navigate('/login');

  };

  return (

    <div className='sidebar'>

      {/* =========================
          LOGO
      ========================= */}

      <h2>

        MidzGlobal

      </h2>

      {/* =========================
          USER INFO
      ========================= */}

      <div
        style={{
          marginBottom: '30px'
        }}
      >

        <p>

          <strong>
            {user?.name}
          </strong>

        </p>

        <p>

          {user?.role}

        </p>

      </div>

      {/* =========================
          ADMIN MENU
      ========================= */}

      {

        user?.role === 'admin' && (

          <>

            <Link to='/admin'>

              Dashboard

            </Link>

          </>

        )

      }

      {/* =========================
          EXPORTER MENU
      ========================= */}

      {

        user?.role === 'exporter' && (

          <>

            <Link to='/exporter'>

              Dashboard

            </Link>

            <Link to='/add-product'>

              Add Product

            </Link>

            <Link to='/exporter-inquiries'>

              Inquiries

            </Link>

            <Link to='/exporter-orders'>

              Orders

            </Link>

          </>

        )

      }

      {/* =========================
          IMPORTER MENU
      ========================= */}

      {

        user?.role === 'importer' && (

          <>

            <Link to='/importer'>

              Dashboard

            </Link>

            <Link to='/products'>

              Marketplace

            </Link>

            <Link to='/importer-orders'>

              Orders

            </Link>

            <Link to='/importer-shipments'>

              Shipments

            </Link>

          </>

        )

      }

      {/* =========================
          LOGISTICS MENU
      ========================= */}

      {

        user?.role === 'logistics' && (

          <>

            <Link to='/logistics'>

              Dashboard

            </Link>

            <Link to='/logistics-shipments'>

              Shipments

            </Link>

          </>

        )

      }

      {/* =========================
          LOGOUT BUTTON
      ========================= */}

      <button

        onClick={handleLogout}

        style={{

          marginTop: '40px',

          width: '100%',

          padding: '12px',

          border: 'none',

          borderRadius: '10px',

          background: '#dc2626',

          color: 'white',

          cursor: 'pointer'

        }}

      >

        Logout

      </button>

    </div>

  );

}

export default Sidebar;