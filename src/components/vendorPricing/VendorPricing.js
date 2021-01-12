import React from "react";
import Img from "../Img";
export default function VendorPricing(props) {
  const { vendor } = props;
  return (
    <div>
      <h1
        style={{
          textAlign: "center",
          padding: "20px"
        }}
      >
       Pricing
      </h1>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))"
        }}
      >
        {vendor.pricingTable.map((card, i) => (
          <div
            key={i}
            style={{
              padding: "10px",
              borderRadius: "10px",
              border: "1px solid gray",
              margin: "10px"
            }}
          >
            <Img
              src={card.imgURLS[0]}
              style={{
                margin: "auto",
                borderRadius: "0%",
                width: "100px",
                height: "100px",
                objectFit: "cover"
              }}
            />
            <h3
              style={{
                textAlign: "center",
                padding: "20px"
              }}
            >
              {card.title}
            </h3>
            <div
              style={{
                margin: "10px"
              }}
            >
              {card.products.map((product, index) => (
                <div
                  key={index}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "40px auto 40px",
                    margin: "10px"
                  }}
                >
                  <Img
                    src={product.imgURL}
                    style={{
                      margin: "auto",
                      borderRadius: "50%",
                      width: "40px",
                      height: "40px",
                      objectFit: "cover"
                    }}
                  />
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                  >
                    {product.name}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "green"
                    }}
                  >
                    {product.price}
                  </div>
                </div>
              ))}
            </div>
            <div
              style={{
                display: "grid",
                alignItems: "center",
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <div style={{
                textAlign: "center"
              }}>
                Total Price: ₹{" "}
                <span style={{ color: "red", textDecoration: "line-through" }}>{card.totalPrice}</span>
              </div>
              <div>
                Subscription Price: ₹{" "}
                <span style={{ color: "green" }}>
                  {(card.totalPrice - card.totalPrice * 0.1).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
