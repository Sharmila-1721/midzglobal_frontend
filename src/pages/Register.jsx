import { useState } from 'react';

import {

  Link,
  useNavigate

} from 'react-router-dom';

import API
from '../services/api';

function Register() {

  /* =========================
     NAVIGATION
  ========================= */

  const navigate = useNavigate();

  /* =========================
     FORM STATE
  ========================= */

  const [formData, setFormData] =
    useState({

      name: '',

      email: '',

      password: '',

      role: '',

      companyName: '',

      country: '',

      phone: '',

      profileImage: '',

      businessLicense: ''

    });

  /* =========================
     LOADING STATE
  ========================= */

  const [loading, setLoading] =
    useState(false);

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
     HANDLE REGISTER
  ========================= */

  const handleSubmit =
  async (e) => {

    e.preventDefault();

    try {

      setLoading(true);

      const res =
        await API.post(

          '/auth/register',

          formData

        );

      alert(res.data.message);

      navigate('/login');

    } catch (error) {

      alert(

        error.response?.data?.message ||

        'Registration Failed'

      );

    } finally {

      setLoading(false);

    }

  };

  return (

    <div className='auth-container'>

      <form

        className='auth-form'

        onSubmit={handleSubmit}

      >

        <h1>Create Account</h1>

        {/* =========================
            FULL NAME
        ========================= */}

        <input

          type='text'

          name='name'

          placeholder='Full Name'

          value={formData.name}

          onChange={handleChange}

          required

        />

        {/* =========================
            EMAIL
        ========================= */}

        <input

          type='email'

          name='email'

          placeholder='Email Address'

          value={formData.email}

          onChange={handleChange}

          required

        />

        {/* =========================
            PASSWORD
        ========================= */}

        <input

          type='password'

          name='password'

          placeholder='Password'

          value={formData.password}

          onChange={handleChange}

          required

        />

        {/* =========================
            COMPANY NAME
        ========================= */}

        <input

          type='text'

          name='companyName'

          placeholder='Company Name'

          value={formData.companyName}

          onChange={handleChange}

        />

        {/* =========================
            COUNTRY
        ========================= */}

        <input

          type='text'

          name='country'

          placeholder='Country'

          value={formData.country}

          onChange={handleChange}

        />

        {/* =========================
            PHONE
        ========================= */}

        <input

          type='text'

          name='phone'

          placeholder='Phone Number'

          value={formData.phone}

          onChange={handleChange}

        />

        {/* =========================
            PROFILE IMAGE
        ========================= */}

        <input

          type='text'

          name='profileImage'

          placeholder='Profile Image URL'

          value={formData.profileImage}

          onChange={handleChange}

        />

        {/* =========================
            BUSINESS LICENSE
        ========================= */}

        <input

          type='text'

          name='businessLicense'

          placeholder='Business License URL'

          value={formData.businessLicense}

          onChange={handleChange}

        />

        {/* =========================
            ROLE
        ========================= */}

        <select

          name='role'

          value={formData.role}

          onChange={handleChange}

          required

        >

          <option value=''>

            Select Role

          </option>

          <option value='importer'>

            Importer

          </option>

          <option value='exporter'>

            Exporter

          </option>

          <option value='logistics'>

            Logistics Provider

          </option>

        </select>

        {/* =========================
            SUBMIT BUTTON
        ========================= */}

        <button type='submit'>

          {

            loading

            ? 'Creating Account...'

            : 'Register'

          }

        </button>

        {/* =========================
            LOGIN LINK
        ========================= */}

        <p>

          Already have an account?

          <Link to='/login'>

            Login

          </Link>

        </p>

      </form>

    </div>

  );

}

export default Register;