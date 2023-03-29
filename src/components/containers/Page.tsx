/* eslint-disable @typescript-eslint/no-explicit-any */
import Head from "next/head";

type Props = {
  title?: string;
  description?: string;
};

export default function Page({
  title,
  description,
  children,
}: Props & {
  children: any;
}) {
  return (
    <>
      <Head>
        <title>{title ?? ""}</title>
        <meta name="description" content={description ?? ""} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {children}
    </>
  );
}
