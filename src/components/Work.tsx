/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-explicit-any */
import autoAnimate from "@formkit/auto-animate";
import { useEffect, useRef } from "react";

export default function Work() {
  return (
    <div className="max-w-sm overflow-hidden rounded bg-zinc-200 shadow-lg">
      <img
        className="w-full"
        src="/work/image1.png"
        alt="Sunset in the mountains"
      />
      <div className="px-6 py-4">
        <div className="mb-2 text-xl font-bold">The Coldest Sunset</div>
        <p className="text-base text-gray-700">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatibus
          quia, nulla! Maiores et perferendis eaque, exercitationem praesentium
          nihil.
        </p>
      </div>
      <div className="px-6 pb-2 pt-4">
        <span className="mb-2 mr-2 inline-block rounded-full bg-gray-300 px-3 py-1 text-sm font-semibold text-gray-700">
          Next.js
        </span>
        <span className="mb-2 mr-2 inline-block rounded-full bg-gray-300 px-3 py-1 text-sm font-semibold text-gray-700">
          React.js
        </span>
        <span className="mb-2 mr-2 inline-block rounded-full bg-gray-300 px-3 py-1 text-sm font-semibold text-gray-700">
          TypeScript
        </span>
      </div>
    </div>
  );
}
