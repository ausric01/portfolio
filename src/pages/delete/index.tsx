/* eslint-disable react/jsx-no-undef */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import Page from "~/components/containers/Page";
import Wrapper from "~/components/containers/Wrapper";
import Header from "~/components/containers/Header";
import { api } from "~/utils/api";
import { getServerAuthSession } from "~/server/auth";
import { Role } from "@prisma/client";
import { type Session } from "next-auth";
import { type NextPage } from "next";
import Footer from "~/components/containers/Footer";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { useRouter } from "next/router";
import FeedbackModal from "~/components/modals/FeedbackModal";

//TODO - Styling

export default function Delete({
  user,
}: NextPage & {
  user: Session["user"];
}) {
  const router = useRouter();

  const { data: tech, refetch } = api.technologies.get.useQuery({});
  const { mutate: deleteTech } = api.technologies.delete.useMutation();

  const [parent, _] = useAutoAnimate();

  return (
    <Page title="Delete">
      <main className="flex min-h-screen w-full flex-col items-center bg-slate-800">
        <Wrapper className="flex items-center">
          <Header user={user} />
          <div className="mt-8 flex w-full flex-col items-center p-4 pt-8">
            <div
              className="my-2 mt-4 grid w-full grid-flow-row grid-cols-4 gap-2"
              ref={parent}
            >
              {tech?.technologies &&
                tech.technologies.map((t) => (
                  <span
                    key={t.id}
                    className="flex select-none flex-row items-center gap-1 rounded bg-white p-1 pl-2 tracking-tight text-black"
                  >
                    <svg
                      onClick={() => {
                        deleteTech(
                          {
                            id: t.id,
                          },
                          {
                            onSuccess: () => {
                              void refetch();
                              void router.push(
                                "/delete?type=success&message=Technology+deleted+successfully"
                              );
                            },
                            onError: (e) => {
                              void router.push(
                                `/delete?type=error&message=${e.message}`
                              );
                            },
                          }
                        );
                      }}
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={3}
                      stroke="currentColor"
                      className="h-3 w-3 cursor-pointer text-red-400"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>

                    {t.name}
                  </span>
                ))}
            </div>
          </div>
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

  if (s === null || s.user.role !== Role.ADMIN) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {
      user: s.user,
    },
  };
}
