/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Technology, Work as TypeWork } from "@prisma/client";
import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";

type Props = {
  title: TypeWork["title"];
  description: TypeWork["description"];
  image: TypeWork["image"];
  technologies: Technology[];
  admin?: boolean;
  onDelete: () => void;
  onEdit: () => void;
};

export default function Work({
  title,
  description,
  image,
  technologies,
  admin,
  onDelete,
  onEdit,
}: Props) {
  const [modal, toggleModal] = useState(false);
  return (
    <div className="relative flex grow flex-col overflow-hidden rounded bg-zinc-200 shadow-lg">
      {modal && (
        <div className="absolute flex h-full w-full flex-col items-center justify-center gap-2 bg-slate-800/90 p-6">
          <h2 className="pb-4 text-center text-3xl font-medium tracking-tight text-white">
            Are you sure you want to delete this?
          </h2>
          <p className="text-md pb-6 text-center tracking-wide text-white">
            This change is irreversable and cannot be undone.
          </p>
          <motion.button
            whileHover={{ scale: 1.025 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onDelete()}
            className="w-full rounded bg-red-500 p-2 font-medium uppercase tracking-wide text-gray-100"
          >
            Delete
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.025 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => toggleModal(false)}
            className="w-full rounded bg-gray-100 p-2 font-medium uppercase tracking-wide text-gray-700"
          >
            Cancel
          </motion.button>
        </div>
      )}
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
      {admin && !modal && (
        <div className="absolute right-0 top-0 flex flex-row justify-between gap-1 p-2">
          <motion.button
            whileHover={{ scale: 1.25 }}
            onClick={() => onEdit()}
            className="rounded-full border border-black/25 bg-white p-1"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-4 w-4 text-black"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
              />
            </svg>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.25 }}
            onClick={() => toggleModal(true)}
            className="rounded-full border border-black/25 bg-white p-1"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="h-4 w-4 text-black"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </motion.button>
        </div>
      )}
    </div>
  );
}
