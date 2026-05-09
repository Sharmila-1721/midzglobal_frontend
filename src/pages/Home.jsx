import { Link } from 'react-router-dom';

function Home() {

  return (

    <div className='home'>

      <div className='navbar'>

        <div className='logo'>
          MidzGlobal
        </div>

        <div className='nav-links'>

          <Link to='/login'>
            <button className='btn'>Login</button>
          </Link>

          <Link to='/register'>
            <button className='btn'>
              Register
            </button>
          </Link>

          <Link to='/products'>
            <button className='btn'>
              Products
            </button>
          </Link>

        </div>

      </div>

      <div className='hero'>

        <div className='hero-content'>

          <h1>
            Global B2B Marketplace
          </h1>

          <p>
            Connect Importers, Exporters
            and Logistics Providers
            Worldwide
          </p>

          <Link to='/add-product'>

            <button className='btn'>
              Add Product
            </button>

          </Link>

        </div>

      </div>

    </div>

  );

}

export default Home;