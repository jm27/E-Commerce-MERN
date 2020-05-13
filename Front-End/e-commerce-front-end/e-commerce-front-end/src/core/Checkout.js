import React, { useState, useEffect } from "react";
// import Layout from './Layout';
import {
  getProducts,
  getBrainTreeClientToken,
  processPayment,
} from "../admin/apiCore";
import { emptyCart } from "./cartHelpers";
// import Card from './Card';
import { isAuthenticated } from "../auth";
import { Link } from "react-router-dom";
import DropIn from "braintree-web-drop-in-react";

const Checkout = ({ products, setRun = (f) => f, run = undefined }) => {
  const [data, setData] = useState({
    success: false,
    loading: false,
    clientToken: null,
    error: "",
    instance: {},
    address: "",
  });

  const userId = isAuthenticated() && isAuthenticated().user._id;
  const token = isAuthenticated() && isAuthenticated().token;

  const getToken = (userId, token) => {
    getBrainTreeClientToken(userId, token).then((data) => {
      if (data.error) {
        setData({ ...data, error: data.error });
      } else {
        setData({ clientToken: data.clientToken });
      }
    });
  };

  useEffect(() => {
    getToken(userId, token);
  }, []);

  const getTotal = () => {
    return products.reduce((currentValue, nextValue) => {
      return currentValue + nextValue.count * nextValue.price;
    }, 0);
  };

  const buy = () => {
    setData({ loading: true });
    // send payment method to your server
    let nonce;
    let getNonce = data.instance
      .requestPaymentMethod()
      .then((data) => {
        nonce = data.nonce;
        //with nonce send as paymentMethod to the backEnd
        // with total
        const paymentData = {
          paymentMethodNonce: nonce,
          amount: getTotal(products),
        };

        processPayment(userId, token, paymentData)
          .then((response) => {
            setData({ ...data, success: response.success });
            // empty cart
            emptyCart(() => {
              setRun(!run);
              setData({
                loading: false,
                success: true,
              });
              console.log("payment success and empty cart");
            });
            // create order
          })
          .catch((error) => {
            console.log(error);
            setData({ loading: false });
          });
      })
      .catch((error) => {
        setData({ ...data, error: error.message });
      });
  };

  const showLoading = loading =>(
    loading && <h2> Loading...</h2>
  )

  const showError = (error) => (
    <div
      className="alert alert-danger"
      style={{ display: error ? "" : "none" }}
    >
      {error}
    </div>
  );
  const showSuccess = (success) => (
    <div
      className="alert alert-info"
      style={{ display: success ? "" : "none" }}
    >
      Thanks payment was successful!{" "}
    </div>
  );

  const showCheckout = () => {
    return isAuthenticated() ? (
      <div>{showDropIn()}</div>
    ) : (
      <Link to="/signin">
        <button className="btn btn-primary">Sign in to checkout</button>
      </Link>
    );
  };

  const showDropIn = () => (
    <div onBlur={() => setData({ ...data, error: "" })}>
      {data.clientToken !== null && products.length > 0 ? (
        <div>
          <DropIn
            options={{
              authorization: data.clientToken,
              paypal: {
                flow: "vault",
              },
            }}
            onInstance={(instance) => (data.instance = instance)}
          ></DropIn>
          <button onClick={buy} className="btn btn-success btn-block">
            Buy
          </button>
        </div>
      ) : null}
    </div>
  );
  return (
    <div>
      <h2>Total: ${getTotal()}</h2>
      {showError(data.error)}
      {showSuccess(data.success)}
      {showCheckout()}
      {showLoading(data.loading)}
    </div>
  );
};

export default Checkout;
