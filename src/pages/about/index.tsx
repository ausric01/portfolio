/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import Page from "~/components/containers/Page";
import Wrapper from "~/components/containers/Wrapper";
import Header from "~/components/containers/Header";
import { getServerAuthSession } from "~/server/auth";
import { type Session } from "next-auth";
import { type NextPage } from "next";

export default function Contact({
  user,
}: NextPage & {
  user: Session["user"];
}) {
  return (
    <Page title="About">
      <main className="flex min-h-screen w-full flex-col items-center bg-slate-800">
        <Wrapper className="bg-white">
          <Header user={user} />
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
