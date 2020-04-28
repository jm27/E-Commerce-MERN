import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import Layout from "../core/Layout";
import { signIn, authenticate, isAuthenticated } from "../auth";

const SignIn = () => {
  const [values, setValues] = useState({
    email: "",
    password: "",
    error: "",
    loading: false,
    redirectToReferrer: false,
  });

  const { email, password, loading, error, redirectToReferrer } = values;
  const {user} = isAuthenticated()

  const handleChange = (name) => (event) => {
    setValues({ ...values, error: false, [name]: event.target.value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setValues({ ...values, error: false, loading: true });
    signIn({ email, password }).then((data) => {
      console.log(data);
      if (data.error) {
        setValues({ ...values, error: data.error, loading: false });
      } else {
        authenticate(data, () => {
          setValues({
            ...values,
            redirectToReferrer: true,
          });
        });
      }
    });
  };

  const signInForm = () => (
    <form>
      <div className="form-group">
        <label className="text-muted">Email</label>
        <input
          onChange={handleChange("email")}
          type="email"
          className="form-control"
          value={email}
        ></input>
      </div>
      <div className="form-group">
        <label className="text-muted">Password</label>
        <input
          onChange={handleChange("password")}
          type="password"
          className="form-control"
          value={password}
        ></input>
      </div>
      <button onClick={handleSubmit} className="btn btn-primary">
        Submit
      </button>
    </form>
  );

  const showError = () => (
    <div
      className="alert alert-danger"
      style={{ display: error ? "" : "none" }}
    >
      {error}
    </div>
  );
  const showLoading = () =>
    loading && (
      <div className="alert alert-info">
        <h2>Loading..</h2>
      </div>
    );

  const redirectUser = () => {
    if (redirectToReferrer) {
      if(user && user.role === 1) {
        return <Redirect to='/admin/dashboard'></Redirect>
      } else {
        return <Redirect to='/user/dashboard'></Redirect>
      }
    }
    if(isAuthenticated()){
      return <Redirect to='/'></Redirect>
    }
  };

  return (
    <Layout
      title="Sign in"
      description="Sign in to MERN E-Commerce APP"
      className="container col-md-8 offset-md-2"
    >
      {showLoading()}
      {showError()}
      {signInForm()}
      {redirectUser()}
    </Layout>
  );
};

export default SignIn;
