/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import Page from "~/components/containers/Page";
import Wrapper from "~/components/containers/Wrapper";
import Header from "~/components/containers/Header";
import { api } from "~/utils/api";
import Work from "~/components/Work";
import Footer from "~/components/containers/Footer";
import { getServerAuthSession } from "~/server/auth";
import { type NextPage } from "next";
import { type Session } from "next-auth";
import { useState } from "react";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import classNames from "classnames";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import FeedbackModal from "~/components/modals/FeedbackModal";
import { Role } from "@prisma/client";

export default function Home({
  user,
}: NextPage & {
  user: Session["user"];
}) {
  const { data, refetch } = api.work.get.useQuery({});
  const { mutate: deleteWork } = api.work.delete.useMutation();

  const [parent, _] = useAutoAnimate();
  const [currentPage, setCurrentPages] = useState(1);
  const router = useRouter();

  const numberPages = Math.ceil((data?.work?.length ?? 0) / 6);

  return (
    <Page title="Home">
      <main className="flex min-h-screen w-full flex-col items-center bg-slate-800">
        <Wrapper>
          <Header user={user} />
          <h1 className="pb-6 pt-12 text-5xl font-medium text-gray-200">
            My Projects
          </h1>
          <div
            ref={parent}
            className="relative grid grid-flow-row gap-4 p-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
          >
            {data?.work
              ?.filter((_, i) => {
                return i >= (currentPage - 1) * 6 && i < currentPage * 6;
              })
              .map((work) => {
                return (
                  <Work
                    key={work.id}
                    admin={user?.role === Role.ADMIN}
                    onEdit={() => void router.push(`/work/${work.id}`)}
                    onDelete={() =>
                      deleteWork(
                        { id: work.id },
                        {
                          onSuccess: () => {
                            void refetch();
                          },
                        }
                      )
                    }
                    {...work}
                  />
                );
              })}
          </div>
          {data?.work?.length == 0 && (
            <div className="absolute flex h-full w-full flex-col items-center justify-center">
              <motion.svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={0.5}
                stroke="currentColor"
                className="h-64 w-64 text-center text-white"
              >
                <motion.path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 011.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.56.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.893.149c-.425.07-.765.383-.93.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 01-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.397.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 01-.12-1.45l.527-.737c.25-.35.273-.806.108-1.204-.165-.397-.505-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.107-1.204l-.527-.738a1.125 1.125 0 01.12-1.45l.773-.773a1.125 1.125 0 011.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894z"
                  //add a spin animation
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 15,
                    repeat: Infinity,
                    repeatType: "loop",
                    ease: "linear",
                  }}
                />
                <motion.path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </motion.svg>

              <h2 className="px-4 pt-4 text-center text-3xl font-medium tracking-tight text-white">
                This Page Is Under Construction
              </h2>
              <p className="px-4 text-center tracking-wide text-white">
                Check back later to see my list of projects that I&apos;ve
                worked on.
              </p>
            </div>
          )}
          {data?.work && data?.work?.length > 0 && (
            <div className="mb-8 flex w-full justify-center justify-self-end">
              <motion.button
                whileTap={{ scale: 0.9 }}
                className="rounded-md bg-gray-800 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-700"
                onClick={() => {
                  currentPage > 1 && setCurrentPages((e) => e - 1);
                }}
              >
                Previous
              </motion.button>
              {Array.from({ length: numberPages }).map((_, i) => {
                return (
                  <button
                    key={i}
                    className={classNames(
                      "ml-2 rounded-md px-4 py-2 text-sm font-medium transition-all hover:bg-gray-300 hover:text-gray-700",
                      i + 1 == currentPage
                        ? "bg-gray-300 text-gray-700"
                        : "bg-gray-700 text-gray-300"
                    )}
                    onClick={() => {
                      if (currentPage != i + 1) {
                        setCurrentPages(i + 1);
                      }
                    }}
                  >
                    {i + 1}
                  </button>
                );
              })}
              <motion.button
                whileTap={{ scale: 0.9 }}
                className="ml-2 rounded-md bg-gray-800 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-700"
                onClick={() => {
                  currentPage != numberPages && setCurrentPages((e) => e + 1);
                }}
              >
                Next
              </motion.button>
            </div>
          )}
          <Footer user={user} />
          {router.query?.type == "success" && (
            <FeedbackModal
              type={"success"}
              message={(router.query?.message as string) ?? ""}
            />
          )}
          {router.query?.type == "error" && (
            <FeedbackModal
              type={"error"}
              message={(router.query?.message as string) ?? ""}
            />
          )}
        </Wrapper>
      </main>
    </Page>
  );
}

export async function getServerSideProps({ req, res }: any) {
  const s = await getServerAuthSession({
    req,
    res,
  });

  if (s !== null) {
    return {
      props: {
        user: s.user,
      },
    };
  } else {
    return {
      props: {},
    };
  }
}
