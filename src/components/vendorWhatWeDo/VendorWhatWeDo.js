import React, { useEffect, useState } from "react";
import Img from "../Img";
// import { firestore } from '../../firebase'

export default function VendorWhatWeDo(props) {
  const { vendor } = props;
  return (
    <div>
      <h1
        style={{
          textAlign: "center",
          padding: "20px"
        }}
      >
        WHAT WE DO
      </h1>
      <p
        style={{
          textAlign: "center",
          padding: "20px"
        }}
      >
        {vendor.whatWeDo}
      </p>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))"
        }}
      >
        {vendor.whatWeDoCards.map((card, i) => (
          <div
            key={i}
            style={{
              padding: "10px",
              borderRadius: "10px",
              border: "1px solid gray",
              margin: "10px",
              display: "grid",
              gridTemplateRows: "100px  50px auto"
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
