import { useState } from 'react';

import { useLocation } from 'react-router-dom';

import DashboardLayout
from '../layouts/DashboardLayout';

import API
from '../services/api';

function SendInquiry() {

  /* =========================
     GET PRODUCT DATA
  ========================= */

  const location = useLocation();

  const product = location.state;

  /* =========================
     GET CURRENT USER
  ========================= */

  const user =
    JSON.parse(
      localStorage.getItem('user')
    );

  /* =========================
     FORM STATE
  ========================= */

  const [formData, setFormData] =
    useState({

      message: '',

      quantity: '',

      offerPrice: ''

    });

  /* =========================
     HANDLE INPUT CHANGE
  ========================= */

  const handleChange = (e) => {

    setFormData({

      ...formData,

      [e.target.name]:
      e.target.value

    });

  };

  /* =========================
     SUBMIT INQUIRY
  ========================= */

  const handleSubmit =
  async (e) => {

    e.preventDefault();

    try {

      const res =
        await API.post(

          '/inquiries',

          {

            importer:
            user._id,

            exporter:
            product.exporter._id,

            product:
            product._id,

            message:
            formData.message,

            quantity:
            formData.quantity,

            offerPrice:
            formData.offerPrice

          }

        );

      alert(res.data.message);

      setFormData({

        message: '',

        quantity: '',

        offerPrice: ''

      });

    } catch (error) {

      console.log(error);

      alert(

        error.response?.data?.message ||

        'Something Went Wrong'

      );

    }

  };

  return (

    <DashboardLayout>

      <div className='form-container'>

        <form

          className='product-form'

          onSubmit={handleSubmit}

        >

          <h1>Send Inquiry</h1>

          {/* =========================
              PRODUCT DETAILS
          ========================= */}

          <div
            className='section-box'
          >

            <h2>
              Product Details
            </h2>

            <br />

            <p>

              <strong>
                Product:
              </strong>

              {' '}

              {product.productName}

            </p>

            <br />

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

            <br />

            <p>

              <strong>
                Price:
              </strong>

              {' '}

              ₹{product.price}

            </p>

            <br />

            <p>

              <strong>
                MOQ:
              </strong>

              {' '}

              {product.moq}

            </p>

          </div>

          {/* =========================
              MESSAGE
          ========================= */}

          <label className='form-label'>

            Inquiry Message

          </label>

          <textarea

            name='message'

            placeholder='Enter your inquiry details...'

            value={formData.message}

            onChange={handleChange}

            required

          ></textarea>

          {/* =========================
              QUANTITY
          ========================= */}

          <label className='form-label'>

            Required Quantity

          </label>

          <input

            type='number'

            name='quantity'

            placeholder='Enter Quantity'

            value={formData.quantity}

            onChange={handleChange}

            required

          />

          {/* =========================
              OFFER PRICE
          ========================= */}

          <label className='form-label'>

            Offer Price

          </label>

          <input

            type='number'

            name='offerPrice'

            placeholder='Enter Offer Price'

            value={formData.offerPrice}

            onChange={handleChange}

          />

          {/* =========================
              SUBMIT BUTTON
          ========================= */}

          <button type='submit'>

            Send Inquiry

          </button>

        </form>

      </div>

    </DashboardLayout>

  );

}

export default SendInquiry;