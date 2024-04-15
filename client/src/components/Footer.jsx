import React from "react";
import { Footer, FooterDivider } from "flowbite-react";
import { Link } from "react-router-dom";
import styles from "../styles";
import { BsTwitter, BsGithub } from "react-icons/bs";

const FooterCom = () => {
  return (
    <Footer
      container
      className={`${styles.padding} border border-t-8 border-teal-500 font-poppins`}
    >
      <div className="w-full">
        <div className=" grid sm:flex justify-between">
          <div className=" sm:mb-0 mb-8">
            <Link
              to={"/"}
              className=" self-center whitespace-nowrap text-gradient font-semibold font-poppins text-lg md:text-3xl"
            >
              Ari Blog
            </Link>
          </div>
          <div className=" grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-6">
            <div>
              <Footer.Title title="About" />
              <Footer.LinkGroup col>
                <Footer.Link
                  href="https://thefalodetobi.com.ng"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Portfolio
                </Footer.Link>
                <Footer.Link
                  href="https://google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Google
                </Footer.Link>
              </Footer.LinkGroup>
            </div>
            <div>
              <Footer.Title title="Follow Us" />
              <Footer.LinkGroup col>
                <Footer.Link
                  href="https://twitter.com/theTobilobahh"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Portfolio
                </Footer.Link>
                <Footer.Link
                  href="https://github.com/Thobbytosin"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub
                </Footer.Link>
              </Footer.LinkGroup>
            </div>
            <div>
              <Footer.Title title="Legal" />
              <Footer.LinkGroup col>
                <Footer.Link href="#" target="_blank" rel="noopener noreferrer">
                  Terms &amp; Conditions
                </Footer.Link>
                <Footer.Link href="#" target="_blank" rel="noopener noreferrer">
                  Privacy Policy
                </Footer.Link>
              </Footer.LinkGroup>
            </div>
          </div>
        </div>
        <FooterDivider />
        <div className=" md:flex items-center justify-between">
          <div>
            <Footer.Copyright
              href="#"
              by="Falode Tobi"
              year={new Date().getFullYear()}
            />
          </div>
          <div className=" flex gap-2 md:gap-4 md:items-center md:justify-center sm:mt-0 mt-4 ">
            <Footer.Icon
              href="https://twitter.com/theTobilobahh"
              icon={BsTwitter}
              target="_blank"
            />
            <Footer.Icon
              href="https://github.com/Thobbytosin"
              icon={BsGithub}
              target="_blank"
            />
          </div>
        </div>
      </div>
    </Footer>
  );
};

export default FooterCom;
