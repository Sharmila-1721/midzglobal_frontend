import {

  useEffect,
  useState

} from 'react';

import {

  useNavigate

} from 'react-router-dom';

import DashboardLayout
from '../layouts/DashboardLayout';

import API
from '../services/api';

import socket
from '../services/socket';

function Products() {

  /* =========================
     NAVIGATION
  ========================= */

  const navigate = useNavigate();

  /* =========================
     STATE
  ========================= */

  const [products, setProducts] =
    useState([]);

  const [search, setSearch] =
    useState('');

  const [loading, setLoading] =
    useState(true);

  /* =========================
     FETCH PRODUCTS
  ========================= */

  useEffect(() => {

    fetchProducts();

    /* =========================
       SOCKET LISTENER
    ========================= */

    socket.on(

      'new-product',

      () => {

        fetchProducts();

      }

    );

    return () => {

      socket.off('new-product');

    };

  }, []);

  /* =========================
     API CALL
  ========================= */

  const fetchProducts =
  async () => {

    try {

      const res =
        await API.get('/products');

      setProducts(res.data);

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);

    }

  };

  /* =========================
     FILTER PRODUCTS
  ========================= */

  const filteredProducts =

    products.filter((product) =>

      product.productName
      .toLowerCase()

      .includes(
        search.toLowerCase()
      )

    );

  /* =========================
     LOADING UI
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

      <div className='products-page'>

        {/* =========================
            PAGE HEADER
        ========================= */}

        <div className='flex-between'>

          <h1 className='page-title'>

            Marketplace Products

          </h1>

        </div>

        {/* =========================
            SEARCH BAR
        ========================= */}

        <input

          type='text'

          className='search-bar'

          placeholder='Search Products...'

          value={search}

          onChange={(e) =>
            setSearch(e.target.value)
          }

        />

        {/* =========================
            EMPTY STATE
        ========================= */}

        {

          filteredProducts.length === 0 && (

            <div className='empty-state'>

              <h2>
                No Products Found
              </h2>

              <p>
                Try searching another product.
              </p>

            </div>

          )

        }

        {/* =========================
            PRODUCTS GRID
        ========================= */}

        <div className='products-grid'>

          {

            filteredProducts.map(
              (product) => (

                <div

                  className='product-card'

                  key={product._id}

                >

                  {/* =========================
                      PRODUCT IMAGE
                  ========================= */}

                  <img

                    src={

                      product.image ||

                      'https://via.placeholder.com/400x250'

                    }

                    alt={product.productName}

                  />

                  {/* =========================
                      PRODUCT CONTENT
                  ========================= */}

                  <div className='product-content'>

                    <h2>

                      {product.productName}

                    </h2>

                    <p>

                      {product.description}

                    </p>

                    <p>

                      <strong>
                        Category:
                      </strong>

                      {' '}

                      {product.category}

                    </p>

                    <p>

                      <strong>
                        Price:
                      </strong>

                      {' '}

                      ₹{product.price}

                    </p>

                    <p>

                      <strong>
                        MOQ:
                      </strong>

                      {' '}

                      {product.moq}

                    </p>

                    <p>

                      <strong>
                        Country:
                      </strong>

                      {' '}

                      {product.country}

                    </p>

                    <p>

                      <strong>
                        Exporter:
                      </strong>

                      {' '}

                      {
                        product.exporter
                        ?.companyName
                      }

                    </p>

                    {/* =========================
                        INQUIRY BUTTON
                    ========================= */}

                    <button

                      onClick={() =>

                        navigate(

                          '/send-inquiry',

                          {

                            state: product

                          }

                        )

                      }

                    >

                      Send Inquiry

                    </button>

                  </div>

                </div>

              )
            )

          }

        </div>

      </div>

    </DashboardLayout>

  );

}

export default Products;