import React, { FunctionComponent, useState, useEffect } from "react";
import styled from "styled-components";
import Card from "./Card";
import axios from "axios";

const GridWrapper = styled.section`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  grid-gap: 1rem;
`;

type ProductGridProps = {
  sizeFilter: string;
};

type DataResponseItem = {
  index: number;
  isSale: boolean;
  isExclusive: false;
  price: string;
  productImage: string;
  productName: string;
  size: string[];
};

const ProductGrid: FunctionComponent<ProductGridProps> = ({ sizeFilter }) => {
  // For a real app, all the data fetching logic could be extracted into a custom hook, and even a separate file.
  const [data, setData] = useState<DataResponseItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await axios(`${process.env.REACT_APP_API_URL}`);
        setData(result.data);
      } catch (error) {
        setIsError(true);
      }

      setIsLoading(false);
    };
    fetchData();
  }, []);

  const filteredItems =
    data.length > 0 && data.filter(item => item.size.includes(sizeFilter));

  return (
    <>
      {isError && <div>Something went wrong...</div>}
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <GridWrapper>
          {filteredItems &&
            filteredItems.map(product => (
              <Card
                key={product.index}
                image={product.productImage}
                name={product.productName}
                price={product.price}
                isSale={product.isSale}
                isExclusive={product.isExclusive}
              />
            ))}
        </GridWrapper>
      )}
    </>
  );
};

export default ProductGrid;
