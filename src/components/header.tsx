import React from "react";
import NuberLogo from "./nuberLogo";
import useMe from "../hooks/useMe";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

const Header = () => {
  const { data } = useMe();

  return (
    <>
      {!data?.me.verified && (
        <div className="bg-red-500 p-3 text-center text-base text-white">
          <span>Please verify your email.</span>
        </div>
      )}

      <header className="py-4">
        <div className="container w-full px-5 lg:px-0  flex items-center justify-between">
          <div className="w-24">
            <NuberLogo />
          </div>
          <span className=" text-sm">
            <Link to="/edit-profile">
              <FontAwesomeIcon icon={faUser} className="text-xl" />
              {data?.me.email}
            </Link>
          </span>
        </div>
      </header>
    </>
  );
};

export default Header;
