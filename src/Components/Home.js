import React, { useState } from "react";
import NavBar from "./NavBar";
const Home = () => {
  const [data, setData] = useState([]);
  return (
    <>
      <NavBar data={data} setData={setData} />
      <div className="container">
        <div className="row">
          <div className="col-sm-12 mt-5">
            <h3>Product List</h3>
            <ul>
              {data.map((product, index) => (
                <li key={index}>
                  <img src={product.Image} alt={`Product ${index}`} />
                  <h3>{product.Pname}</h3>
                  <p>Price: {product.Pprice}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
