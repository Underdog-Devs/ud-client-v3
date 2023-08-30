import React from "react";
import Mentor from "../components/landing/mentor";
import Recidivism from "../components/landing/recidivism";
import Mentee from "../components/landing/mentee";
import SocialMedia from "../components/landing/socialMedia";
import GetInvolved from "../components/landing/getInvolved";
import Hero from "../components/landing/hero";

export default function Home() {
  return (
    <>
      <Hero />
      <Recidivism />
      <Mentee />
      <Mentor />
      <SocialMedia />
      <GetInvolved />
    </>
  );
}
