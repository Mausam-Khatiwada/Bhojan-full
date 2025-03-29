import React from "react";
import "./Services.css";
import { assets } from "../../assets/assets";
const Services = () => {
  return (
    <>
      <div className="services">
        <div className=" delivery">
          <img src={assets.delivery_icon} alt="" />
          <h2>Fast Delivery</h2>
          <p>
            Get your favorite meals delivered swiftly and right to your door.
            Our efficient service ensures you enjoy your food fresh and hot,
            with minimal wait time.
          </p>
        </div>
        <div className="service">
          <img src={assets.service_icon} alt="" />
          <h2>24 Hour Service</h2>
          <p>
            Available around the clock to meet your needs. Whether it's day or
            night, we're here to provide you with top-notch service anytime you
            need it.
          </p>
        </div>
        <div className="quality">
          <img src={assets.quality_icon} alt="" />
          <h2>Best Quality</h2>
          <p>
            Experience top-notch quality with every order. We ensure that each
            dish meets the highest standards, providing you with delicious and
            fresh meals every time.
          </p>
        </div>
      </div>
    </>
  );
};

export default Services;
