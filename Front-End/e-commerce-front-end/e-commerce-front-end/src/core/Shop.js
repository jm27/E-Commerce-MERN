import React, { useState, useEffect } from "react";
import Layout from "./Layout";
import Card from "./Card";
import Checkbox from "./Checkbox";
import { prices } from "./fixedPrices";
import RadioBox from "./RadioBox";
import { getCategories } from "../admin/apiCore";

const Shop = () => {
  const [myFilters, setMyFilters] = useState({
    filters: { category: [], price: [] },
  });
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(false);

  const init = () => {
    getCategories().then((data) => {
      if (data.error) {
        setError(data.error);
      } else {
        setCategories(data);
      }
    });
  };

  useEffect(() => {
    init();
  }, []);

  const handleFilters = (filters, filterBy) => {
    const newFilters = { ...myFilters };
    newFilters.filters[filterBy] = filters;
    setMyFilters(newFilters);
  };

  return (
    <Layout
      title="Shop Page"
      description="Search and find your favorite products!"
      className="container-fluid"
    >
      <div className="row">
        <div className="col-4">
          <h4>Filter by categories</h4>
          <ul>
            <Checkbox
              categories={categories}
              handleFilters={(filters) => handleFilters(filters, "category")}
            ></Checkbox>
          </ul>
          <h4>Filter by Price</h4>
          <div>
          <RadioBox
            prices={prices}
            handleFilters={(filters) => handleFilters(filters, "price")}
          ></RadioBox>
          </div>
        </div>
        <div className="col-8">{JSON.stringify(myFilters)}</div>
      </div>
    </Layout>
  );
};

export default Shop;
