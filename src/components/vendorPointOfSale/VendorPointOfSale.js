import React from 'react';
import Img from "../Img";
export default function VendorPointOfSale(props) {
    const { vendor } = props
  return (
    <div>
        <h1 style={{
            textAlign: "center",
            padding: "20px"
        }}>POINT OF SALE</h1>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))"
        }}>
        {vendor.pointOfSale.map((card, i) => (
          <div
            key={i}
            style={{
              padding: "10px",
              borderRadius: "10px",
              border: "1px solid gray",
              margin: "10px",
              display: "grid",
              gridTemplateRows: "100px 50px auto"

            }}
          >
            <Img
              src={card.imgURL}
              style={{
                margin: "auto",
                borderRadius: "50%",
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
            <p
              style={{
                textAlign: "center",
                padding: "20px"
              }}
            >
              {card.description}
            </p>
          </div>
        ))}
        </div>
    </div>
  );
}
