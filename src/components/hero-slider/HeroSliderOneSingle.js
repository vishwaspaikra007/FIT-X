import PropTypes from "prop-types";
import React, {useState} from "react";
import { Link } from "react-router-dom";

const HeroSliderOneSingle = ({ data, sliderClassName }) => {
  const [position, setPosition] = useState(
    document.documentElement.clientWidth > 1000 ?
    "relative" : "absolute")

  return (
    <div
      style={{
        background: "orange",
        height: "500px",
        padding: 0,
      }}
      className={`single-slider slider-height-1 ${
        sliderClassName ? sliderClassName : ""
      }`}
    >
      <div className="container">
        <div className="row">
          <div className="col-xl-6 col-lg-6 col-md-6 col-12 col-sm-6"  style={{
          position: position,
          zIndex: 2,
          height: "500px",
          display: "flex",
          alignItems: "center",
          top: 0,
          padding: "10px",
          background: "#ffffff56",
          backdropFilter: "blur(1px)",
        }}>
            <div className="slider-content slider-animated-1" style={{
              padding: 0
            }}>
              <h3 className="animated">{data.title}</h3>
              <h1 className="animated">{data.subtitle}</h1>
              <div className="slider-btn btn-hover">
                <Link
                  className="animated"
                  to={process.env.PUBLIC_URL + data.url}
                >
                  SHOP NOW
                </Link>
              </div>
            </div>
          </div>
          <div className="col-xl-6 col-lg-6 col-md-6 col-12 col-sm-6">
            <div className="slider-single-img slider-animated-1">
              <img
                style={{
                  margin: "0 auto",
                  display: "block",
                  height: "500px",
                  objectFit: "cover",
                }}
                className="animated img-fluid"
                src={process.env.PUBLIC_URL + data.image}
                alt=""
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

HeroSliderOneSingle.propTypes = {
  data: PropTypes.object,
  sliderClassName: PropTypes.string
};

export default HeroSliderOneSingle;
