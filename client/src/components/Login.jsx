import { useState } from 'react';
import { BoxArrowInRight } from 'react-bootstrap-icons';
import api from '../api.js';
import useAsyncAction from '../hooks/useAsyncAction.js';

const Login = ({ onLogin }) => {
  const [password, setPassword] = useState('');
  const login = useAsyncAction(api.login);

  const onSubmit = async (e) => {
    e.preventDefault();
    const result = await login.run(password);
    if (result.success) {
      onLogin();
    }
  };

  return (
    <section className="login">
      <h1>Welcome back</h1>
      <p>Enter your password to access your files.</p>
      <form onSubmit={onSubmit}>
        <label className="visually-hidden" htmlFor="password">
          Password
        </label>
        <input
          id="password"
          className="input"
          type="password"
          placeholder="Password"
          autoFocus
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {login.result && !login.result.success && (
          <p className="form-error" role="alert">
            {login.result.message}
          </p>
        )}
        <button
          className="button button-primary"
          type="submit"
          disabled={login.running || !password}
        >
          <BoxArrowInRight />
          Log in
        </button>
      </form>
    </section>
  );
};

export default Login;
