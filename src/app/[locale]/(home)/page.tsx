import React from "react";

import Hero from "./_components/hero";
import OurCategories from "./_components/ourCategories";
import OurProducts from "./_components/ourProducts";


export default function Home() {


  return (
    <main className="min-h-screen">
      <Hero />
      <OurCategories />
      <OurProducts />

    </main>
  );
}
