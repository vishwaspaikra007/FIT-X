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
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))"
        }}>
        <Carousel>
        {vendor.testimonials.map((card, i) => (
            <VendorProfileCard vendor={card} key={i}/>
        ))}
        </Carousel>
        </div>
    </div>
  );
}
