import React, { useState, useEffect } from "react";
import Layout from "./Layout";
import { read, listRelated } from "../admin/apiCore";
import Card from "./Card";

const Product = (props) => {
  const [product, setProduct] = useState({});
  const [error, setError] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);

  const loadSingleProduct = (productId) => {
    read(productId).then((data) => {
      if (data.error) {
        setError(data.error);
      } else {
        setProduct(data);
        listRelated(data._id).then((data) => {
          if (data.error) {
            setError(data.error);
          } else {
            setRelatedProducts(data);
          }
        });
      }
    });
  };

  useEffect(() => {
    const productId = props.match.params.productId;
    loadSingleProduct(productId);
  }, [props]);

  return (
    <Layout
      title={product.name}
      description={
        product && product.description && product.description.substring(0, 100)
      }
      className="container-fluid"
    >
      <div className="row">
        <div className="col-8">
          {product && product.description && (
            <Card product={product} showViewProductButton={false}></Card>
          )}
        </div>
        <div className="col-4">
          <h4> Related products</h4>
          {relatedProducts.map((p, i) => (
            <div className="mb-3">
              <Card key={i} product={p}></Card>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Product;
