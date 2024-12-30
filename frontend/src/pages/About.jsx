import React from "react";
import Title from "../components/Title";
import assets from "../assets/assets";
import Footer from "../components/Footer";

const About = () => {
  return (
    <div>
      <div className="text-2xl text-center pt-8 border-t">
        <Title text1={"ABOUT"} text2={"US"} />
      </div>

      {/* Main content section with text first */}
      <div className="my-10 flex flex-col gap-8">
        {/* Text paragraphs */}
        <div className="text-gray-600 space-y-6">
          <p>
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Vel
            architecto obcaecati? Similique voluptatem hic autem assumenda nam
            error consequatur eius harum perferendis! Eveniet placeat, cum ut
            recusandae libero hic voluptates qui neque culpa officiis?
          </p>
          <p>
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Esse, cum
            molestias magni saepe aspernatur corporis odit ea, doloremque
            cumque, suscipit inventore consequuntur! Expedita suscipit dolores
            dignissimos rerum voluptatem tenetur quas, r
          </p>
        </div>

        {/* Image section */}
        <div className="w-full flex justify-center">
          <img
            className="max-w-[450px] w-full"
            src={assets.about}
            alt="About Us"
          />
        </div>

        {/* Mission section */}
        <div className="text-gray-600 space-y-4">
          <b className="text-gray-800 block">Our Mission</b>
          <p>
            Our Mission Lorem ipsum dolor sit amet, consectetur adipisicing
            elit. Dicta, atque consectetur odio tempore similique soluta est
            inventore assumenda dolore? Quasi?
          </p>
        </div>
      </div>

      {/* Why Choose Us section */}
      <div className="text-xl py-4">
        <Title text1={"WHY"} text2={"CHOOSE US"} />
      </div>
      <div className="flex flex-col md:flex-row text-sm mb-20">
        <div className="border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5">
          <b>Quality Assurance:</b>
          <p className="text-gray-600">
            We meticulously select and vet each product to ensure it meets our
            stringent quality standards.
          </p>
        </div>
        <div className="border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5">
          <b>Convenience:</b>
          <p className="text-gray-600">
            With our user-friendly interface and hassle-free ordering process,
            shopping has never been easier.
          </p>
        </div>
        <div className="border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5">
          <b>Exceptional Customer Service:</b>
          <p className="text-gray-600">
            Our team of dedicated professionals is here to assist you the way,
            ensuring your satisfaction is our top priority.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default About;