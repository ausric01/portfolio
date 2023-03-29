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
import { useRef, useEffect } from "react";
import { useAutoAnimate } from "@formkit/auto-animate/react";

export default function Home({
  user,
}: NextPage & {
  user: Session["user"];
}) {
  const { data: work } = api.work.get.useQuery({});

  const [parent, enableAnimations] = useAutoAnimate();

  return (
    <Page title="Home">
      <main className="flex min-h-screen w-full flex-col items-center bg-slate-800">
        <Wrapper>
          <Header user={user} />
          <div
            ref={parent}
            className="grid grid-flow-row gap-4 p-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
          >
            <Work />
            <Work />
            <Work />
          </div>
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
