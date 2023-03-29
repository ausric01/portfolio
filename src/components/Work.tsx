/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Technology, Work as TypeWork } from "@prisma/client";
import Image from "next/image";

type Props = {
  title: TypeWork["title"];
  description: TypeWork["description"];
  image: TypeWork["image"];
  technologies: Technology[];
};

export default function Work({
  title,
  description,
  image,
  technologies,
}: Props) {
  return (
    <div className="flex grow flex-col overflow-hidden rounded bg-zinc-200 shadow-lg">
      <Image
        src={`/work/${image ?? ""}`}
        alt={title}
        width={1000}
        height={1000}
        quality={100}
        className="h-full max-h-[250px] object-cover"
      />
      <div className="py-4">
        <div className="mb-2 px-6 text-xl font-bold">{title}</div>
        <p className="max-h-[125px] overflow-y-auto break-words px-6 text-gray-700">
          {description}{" "}
        </p>
        <div className="mt-4 px-6 pb-2 pt-4">
          {technologies?.map((e) => {
            return (
              <span
                key={e.id}
                className="mb-2 mr-2 inline-block rounded-full bg-gray-300 px-3 py-1 text-sm font-semibold text-gray-700"
              >
                {e.name}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}
