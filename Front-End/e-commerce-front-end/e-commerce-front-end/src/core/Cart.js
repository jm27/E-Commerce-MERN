import React, { useState, useEffect } from "react";
import Layout from "./Layout";
import Card from "./Card";
import { getCart, removeItem } from "./cartHelpers";
import { Link } from "react-router-dom";

const Cart = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    setItems(getCart());
  }, []);

  const showItems = (items) => {
    return (
      <div>
        <h2>Your cart has {`${items.length} items`}</h2>
        <hr />
        {items.map((p, i) => {
          return (
            <Card
              cartUpdate={true}
              key={i}
              showAddToCartButton={false}
              product={p}
              showRemoveProductButton={true}
            ></Card>
          );
        })}
      </div>
    );
  };

  const noItems = () => (
    <h2>
      Cart is empty.
      <br />
      <Link to="/shop">Continue Shopping</Link>
    </h2>
  );

  return (
    <Layout
      title="Shopping Cart"
      description="check your cart items!"
      className="container-fluid"
    >
      <div className="row">
        <div className="col-6">
          {items.length > 0 ? showItems(items) : noItems()}
        </div>
        <div className="col-6">
          Show checkout options/ shipping address/ update quantity
        </div>
      </div>
    </Layout>
  );
};

export default Cart;
