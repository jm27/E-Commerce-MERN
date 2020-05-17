import React, { useState, useEffect } from "react";
import Layout from "../core/Layout";
import { isAuthenticated } from "../auth";
import { Link } from "react-router-dom";
import { listOrders } from "./apiAdmin";

const Orders = () => {
  const [orders, setOrders] = useState([]);

  const { user, token } = isAuthenticated();

  const loadOrders = () => {
    listOrders(user._id, token).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        setOrders(data);
      }
    });
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const showOrdersLength = (orders) => {
    if (orders.length > 0) {
      return (
        <h1 className="text-danger display-2">Total orders: {orders.length}</h1>
      );
    } else {
      return <h1 className="text-danger">No orders</h1>;
    }
  };

  return (
    <Layout title="Orders" description={`Welcome ${user.name}`}>
      <div className="row">
        <div className="col-md-8 offset-md-2">
          {showOrdersLength(orders)}
          {orders.map((o, oIndex) => {
            return (
              <div
                className="mt-5"
                key={oIndex}
                style={{ borderBottom: "5px solid indigo" }}
              >
                  <h2 className='mb-5'>
                      <span className='bg-primary'>
                          Order ID: {o._id}
                      </span>
                  </h2>
                  <ul className='list-group mb-2'>
                      <li className='list-group-item'>
                          Transaction ID: {o.transaction_id}
                      </li>
                      <li className='list-group-item'>
                          Transaction ID: {o.transaction_id}
                      </li>
                      <li className='list-group-item'>
                          Transaction ID: {o.transaction_id}
                      </li>
                  </ul>
              </div>
            );
          })}
        </div>
      </div>
    </Layout>
  );
};

export default Orders;