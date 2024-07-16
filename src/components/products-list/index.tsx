// В ProductsList.tsx

import { FC } from "react";
import { useQuery } from "react-query";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
}

const ProductsList: FC = () => {
  const navigate = useNavigate();

  const {
    data: products,
    isLoading,
    isError,
  } = useQuery<Product[]>("products", async () => {
    const response = await axios.get<Product[]>(
      "http://localhost:3001/products"
    );
    return response.data;
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error fetching products</div>;

  return (
    <div className="products-list">
      <h1>Products List</h1>
      {products &&
        [...products].reverse().map((product) => (
          <div key={product.id} className="product-item">
            <h2>{product.name}</h2>
            <p>Price: ${product.price}</p>
            <p>Description: {product.description}</p>
            <button onClick={() => navigate(`/edit-product/${product.id}`)}>
              Edit
            </button>
          </div>
        ))}
    </div>
  );
};

export default ProductsList;
