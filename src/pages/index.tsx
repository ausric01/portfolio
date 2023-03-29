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
import { useSession } from "next-auth/react";
import { type Session } from "next-auth";
import autoAnimate from "@formkit/auto-animate";
import { useRef, useEffect, useState } from "react";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import classNames from "classnames";

export default function Home({
  user,
}: NextPage & {
  user: Session["user"];
}) {
  const { data } = api.work.get.useQuery({});
  const [parent, _] = useAutoAnimate();
  const [currentPage, setCurrentPages] = useState(1);

  const numberPages = Math.ceil((data?.work?.length ?? 0) / 6);
  console.log(currentPage);
  return (
    <Page title="Home">
      <main className="flex min-h-screen w-full flex-col items-center bg-slate-800">
        <Wrapper>
          <Header user={user} />
          <h1 className="pb-6 pt-12 text-5xl font-medium text-gray-200">
            Projects
          </h1>
          <div
            ref={parent}
            className="grid grid-flow-row gap-4 p-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
          >
            {data?.work
              ?.filter((_, i) => {
                return i >= (currentPage - 1) * 6 && i < currentPage * 6;
              })
              .map((work) => {
                return <Work key={work.id} {...work} />;
              })}
          </div>
          {data?.work && data?.work?.length > 0 && (
            <div className="mb-8 flex w-full justify-center justify-self-end">
              <button
                className="rounded-md bg-gray-800 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-700"
                onClick={() => {
                  currentPage > 1 && setCurrentPages((e) => e - 1);
                }}
              >
                Previous
              </button>
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
              <button
                className="ml-2 rounded-md bg-gray-800 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-700"
                onClick={() => {
                  currentPage != numberPages && setCurrentPages((e) => e + 1);
                }}
              >
                Next
              </button>
            </div>
          )}
          <Footer user={user} />
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
