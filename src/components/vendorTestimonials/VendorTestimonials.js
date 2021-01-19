import React from 'react';
import Img from "../Img";
import VendorProfileCard from '../vendorProfileCard/VendorProfileCard';
import Carousel from "../carousel/Carousel"

export default function VendorTestimonials(props) {
    const { vendor } = props
  return (
    <div>
        <h1 style={{
            textAlign: "center",
            padding: "20px"
        }}>Testimonials</h1>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))"
        }}>
        <Carousel>
        {vendor.testimonials.map((card, i) => (
          <div key={i}>
            <VendorProfileCard vendor={card}/>
            <p style={{
              padding: "0 20px",
              height: "100px",
              overflow: "hidden",
              color: 'grey',
              textAlign: 'center',
            }}>"{card.testimony}"</p>
            </div>
        ))}
        </Carousel>
        </div>
    </div>
  );
}
