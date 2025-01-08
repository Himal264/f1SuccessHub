import React from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSquareFacebook,
  faInstagram,
  faLinkedin,
} from "@fortawesome/free-brands-svg-icons";


const FollowFoo = () => {
  return (
    <div>
      <div className="mb-8">
              <p className="font-dancing text-center text-5xl  Script">
                F1-SuccessHub On
              </p>
              <div className="text-center">
                <ul className="flex justify-center items-center mt-7 mb-7">
                  <li>
                    <a
                      href="#"
                      className="p-4 rounded-full flex justify-center items-center"
                    >
                      <FontAwesomeIcon icon={faSquareFacebook} className="w-8 h-8" />
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="p-4 rounded-full  flex justify-center items-center"
                    >
                      <FontAwesomeIcon icon={faInstagram} className="w-8 h-8" />
                    </a>
                  </li>
                </ul>
              </div>
              <p className="text-black text-center font-cedarville text-2xl">
                Follow Us On Social Media And Don't hesitate to reach out to us for any inquiries or support. Our
                dedicated team is here to assist you every step of the way.
              </p>
            </div>
    </div>
  )
}

export default FollowFoo