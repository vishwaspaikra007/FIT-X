import React, { useState } from "react";
import Img from "../Img";
import style from "./VendorService.module.css"
import VendorServiceCheckout from "./VendorServiceCheckout";

export default function VendorPricing(props) {
  const { vendor } = props;
  const [checkingOut, setCheckingOut] = useState()
  return (
    <div>
      <h1 className={style.h}>
        Pricing
      </h1>
      <div className={style.grid}>
        {vendor.services.map((service, i) => (
          <div
            key={i}
            className={style.wrap}>
            <Img
              src={service.imgURL}
              className={style.img}
            />
            <h3 className={style.h}
            >
              {service.title}
            </h3>
            <div className={style.mg10}>
              <ul className={style.ul}>
                {
                  service.points.map((point, key) => (
                    <li key={key}>
                      {point}
                    </li>
                  ))
                }
              </ul>
            </div>
            <div className={style.price}
            >
              <div>
                Service Charge: ₹{" "}
                <span>
                  {service.price}
                </span>
              </div>
            </div>
            <button className={style.button} onClick={() => setCheckingOut(service.title)}>Buy</button>
            {
              checkingOut && checkingOut === service.title ? 
                <VendorServiceCheckout service={service} vendorId={vendor.id} vendorName={vendor.name} setCheckingOut={setCheckingOut} /> : null
            }
          </div>
        ))}
      </div>
    </div>
  );
}
