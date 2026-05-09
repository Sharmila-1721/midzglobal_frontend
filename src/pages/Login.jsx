import { useState } from 'react';

import {

  Link,
  useNavigate

} from 'react-router-dom';

import API
from '../services/api';

function Login() {

  /* =========================
     NAVIGATION
  ========================= */

  const navigate = useNavigate();

  /* =========================
     FORM STATE
  ========================= */

  const [formData, setFormData] =
    useState({

      email: '',

      password: ''

    });

  /* =========================
     LOADING STATE
  ========================= */

  const [loading, setLoading] =
    useState(false);

  /* =========================
     HANDLE CHANGE
  ========================= */

  const handleChange = (e) => {

    setFormData({

      ...formData,

      [e.target.name]:
      e.target.value

    });

  };

  /* =========================
     HANDLE LOGIN
  ========================= */

  const handleSubmit =
  async (e) => {

    e.preventDefault();

    try {

      setLoading(true);

      const res =
        await API.post(

          '/auth/login',

          formData

        );

      /* =========================
         STORE TOKEN & USER
      ========================= */

      localStorage.setItem(

        'token',

        res.data.token

      );

      localStorage.setItem(

        'user',

        JSON.stringify(
          res.data.user
        )

      );

      alert(res.data.message);

      /* =========================
         ROLE-BASED NAVIGATION
      ========================= */

      const role =
        res.data.user.role;

      if (role === 'admin') {

        navigate('/admin');

      }

      else if (
        role === 'exporter'
      ) {

        navigate('/exporter');

      }

      else if (
        role === 'importer'
      ) {

        navigate('/importer');

      }

      else if (
        role === 'logistics'
      ) {

        navigate('/logistics');

      }

    } catch (error) {

      alert(

        error.response?.data?.message ||

        'Login Failed'

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

        {/* =========================
            HEADING
        ========================= */}

        <h1>MidzGlobal Login</h1>

        {/* =========================
            EMAIL
        ========================= */}

        <input

          type='email'

          name='email'

          placeholder='Enter Email'

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

          placeholder='Enter Password'

          value={formData.password}

          onChange={handleChange}

          required

        />

        {/* =========================
            SUBMIT BUTTON
        ========================= */}

        <button type='submit'>

          {

            loading

            ? 'Logging In...'

            : 'Login'

          }

        </button>

        {/* =========================
            REGISTER LINK
        ========================= */}

        <p>

          Don't have an account?

          <Link to='/register'>

            Register

          </Link>

        </p>

      </form>

    </div>

  );

}

export default Login;