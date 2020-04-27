import React, { useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../core/Layout";
import API from "../config";

const SignUp = () => {
  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
    error: "",
    success: false,
  });

  const { name, email, password, success, error } = values;

  const handleChange = (name) => (event) => {
    setValues({ ...values, error: false, [name]: event.target.value });
  };

  const signUp = (user) => {
    return fetch(`${API}/signup `, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    })
      .then((response) => {
        return response.json();
      })
      .catch((error) => console.log(error));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setValues({ ...values, error: false });
    signUp({ name, email, password }).then((data) => {
      console.log(data)
      if (data.error) {
        setValues({ ...values, error: data.error, success: false });
      } else {
        setValues({
          ...values,
          name: "",
          email: "",
          password: "",
          error: "",
          success: true,
        });
      }
    });
  };

  const signUpForm = () => (
    <form>
      <div className="form-group">
        <label className="text-muted">Name</label>
        <input
          onChange={handleChange("name")}
          type="text"
          className="form-control"
          value={name}
        ></input>
      </div>
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
  const showSuccess = () => (
    <div
      className="alert alert-info"
      style={{ display: success ? "" : "none" }}
    >
      New account created. Please <Link to="/signin">Sign in</Link>
    </div>
  );

  return (
    <Layout
      title="Sign up"
      description="Sign up to MERN E-Commerce APP"
      className="container col-md-8 offset-md-2"
    >
      {showSuccess()}
      {showError()}
      {signUpForm()}
    </Layout>
  );
};

export default SignUp;
