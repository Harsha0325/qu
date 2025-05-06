import * as React from "react";

export default function FeatureHero() {
  return (
    <section className="flex flex-col items-center max-md:mt-10">
      <h1 className="text-2xl font-bold text-center text-white tracking-[2px] max-md:max-w-full max-md:text-2xl">
        Features That Power Your Networking Experience
      </h1>
      <p className="mt-6 text-sm tracking-wider text-center text-white text-opacity-50 max-md:max-w-full">
      "Discover the tools designed to connect, manage, and build communities effortlessly."
      </p>
    </section>
  );
}