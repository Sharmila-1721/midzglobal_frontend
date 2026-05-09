import { useState } from 'react';

import DashboardLayout
from '../layouts/DashboardLayout';

import API
from '../services/api';

function AddProduct() {

  /* =========================
     CURRENT USER
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

      productName: '',

      description: '',

      category: '',

      subCategory: '',

      price: '',

      moq: '',

      stock: '',

      country: '',

      image: '',

      leadTime: '',

      productionCapacity: ''

    });

  /* =========================
     LOADING
  ========================= */

  const [loading, setLoading] =
    useState(false);

  /* =========================
     HANDLE INPUT
  ========================= */

  const handleChange = (e) => {

    setFormData({

      ...formData,

      [e.target.name]:
      e.target.value

    });

  };

  /* =========================
     SUBMIT PRODUCT
  ========================= */

  const handleSubmit =
  async (e) => {

    e.preventDefault();

    try {

      setLoading(true);

      const res =
        await API.post(

          '/products',

          {

            ...formData,

            exporter:
            user._id

          }

        );

      alert(res.data.message);

      /* RESET FORM */

      setFormData({

        productName: '',

        description: '',

        category: '',

        subCategory: '',

        price: '',

        moq: '',

        stock: '',

        country: '',

        image: '',

        leadTime: '',

        productionCapacity: ''

      });

    } catch (error) {

      console.log(error);

      alert(

        error.response?.data?.message ||

        'Product Creation Failed'

      );

    } finally {

      setLoading(false);

    }

  };

  return (

    <DashboardLayout>

      <div className='form-container'>

        <form

          className='product-form'

          onSubmit={handleSubmit}

        >

          {/* =========================
              PAGE TITLE
          ========================= */}

          <h1>Add New Product</h1>

          {/* =========================
              PRODUCT NAME
          ========================= */}

          <label className='form-label'>

            Product Name

          </label>

          <input

            type='text'

            name='productName'

            placeholder='Enter Product Name'

            value={formData.productName}

            onChange={handleChange}

            required

          />

          {/* =========================
              DESCRIPTION
          ========================= */}

          <label className='form-label'>

            Description

          </label>

          <textarea

            name='description'

            placeholder='Enter Product Description'

            value={formData.description}

            onChange={handleChange}

            required

          ></textarea>

          {/* =========================
              CATEGORY
          ========================= */}

          <label className='form-label'>

            Category

          </label>

          <input

            type='text'

            name='category'

            placeholder='Enter Category'

            value={formData.category}

            onChange={handleChange}

            required

          />

          {/* =========================
              SUBCATEGORY
          ========================= */}

          <label className='form-label'>

            Sub Category

          </label>

          <input

            type='text'

            name='subCategory'

            placeholder='Enter Sub Category'

            value={formData.subCategory}

            onChange={handleChange}

          />

          {/* =========================
              PRICE
          ========================= */}

          <label className='form-label'>

            Price

          </label>

          <input

            type='number'

            name='price'

            placeholder='Enter Price'

            value={formData.price}

            onChange={handleChange}

            required

          />

          {/* =========================
              MOQ
          ========================= */}

          <label className='form-label'>

            Minimum Order Quantity

          </label>

          <input

            type='number'

            name='moq'

            placeholder='Enter MOQ'

            value={formData.moq}

            onChange={handleChange}

            required

          />

          {/* =========================
              STOCK
          ========================= */}

          <label className='form-label'>

            Stock Available

          </label>

          <input

            type='number'

            name='stock'

            placeholder='Enter Stock'

            value={formData.stock}

            onChange={handleChange}

            required

          />

          {/* =========================
              COUNTRY
          ========================= */}

          <label className='form-label'>

            Country of Origin

          </label>

          <input

            type='text'

            name='country'

            placeholder='Enter Country'

            value={formData.country}

            onChange={handleChange}

            required

          />

          {/* =========================
              IMAGE URL
          ========================= */}

          <label className='form-label'>

            Product Image URL

          </label>

          <input

            type='text'

            name='image'

            placeholder='Enter Image URL'

            value={formData.image}

            onChange={handleChange}

          />

          {/* =========================
              LEAD TIME
          ========================= */}

          <label className='form-label'>

            Lead Time

          </label>

          <input

            type='text'

            name='leadTime'

            placeholder='Example: 7 Days'

            value={formData.leadTime}

            onChange={handleChange}

          />

          {/* =========================
              PRODUCTION CAPACITY
          ========================= */}

          <label className='form-label'>

            Production Capacity

          </label>

          <input

            type='text'

            name='productionCapacity'

            placeholder='Example: 1000 Units/Month'

            value={formData.productionCapacity}

            onChange={handleChange}

          />

          {/* =========================
              SUBMIT BUTTON
          ========================= */}

          <button type='submit'>

            {

              loading

              ? 'Adding Product...'

              : 'Add Product'

            }

          </button>

        </form>

      </div>

    </DashboardLayout>

  );

}

export default AddProduct;