"use client";
import { motion } from "framer-motion";
import React from "react";
import AuroraBackground from "../Components/UI/Aurora-background.jsx";
import { NavLink } from "react-router-dom";
import logo from "../assets/logo2.png";
import  HoverBorderGradient  from "../Components/UI/Hover-border-gradient.jsx"
import Navbaar from "../Components/UI/Navbaar.jsx";
import TextGenerateEffect  from "../Components/TextGenerateEffect.jsx";
import '../index.css'
import bg from "../assets/bg.png"
import TextGenerateEffect2 from "../Components/TextGenerateEffect2.jsx";

const words = `Harnessing the power of polygon zkEVM cardona and reclaim protocol`
const words2 = ` Buy second hand product,`
const words3 = ` good as new in affordable prices`
const words4 = ` Revolutionizing the resale market with Zero-Knowledge Proofs`

export function AuroraBackgroundDemo() {
  return (
    <AuroraBackground>
      <div className="z-50">
        <Navbaar />
      </div>
      <motion.div
        initial={{ opacity: 0.0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.3,
          duration: 0.8,
          ease: "easeInOut",
        }}
        className=" w-full flex flex-col gap-5 items-start justify-start ml-20 mb-8"
      >
        <div className="flex mt-20 gap-10">
          <div>
        <img className="w-[29rem]" src={logo} alt="" />
        <div className="font-extralight text-base md:text-4xl text-neutral-200 py-4 ml-4">
         <TextGenerateEffect words={words2} />
         <TextGenerateEffect words={words3} />
         <TextGenerateEffect2 words={words} />
         <TextGenerateEffect2 words={words4} />
        </div>
        <div className="flex justify-start text-center ml-4 w-full">
          <NavLink to="/shop">
            <HoverBorderGradient
              containerClassName="rounded-full"
              as="button"
              className="bg-black text-white flex items-center space-x-2 px-8 "
            >
              <span className="text-lg">Go to shop</span>
            </HoverBorderGradient>
          </NavLink>
        </div>
        </div>

        <div className="z-50"><img className="z-50 w-[26rem]" src={bg} alt="" /></div>
        </div>
      </motion.div>
    </AuroraBackground>
  );
}

export default AuroraBackgroundDemo;
