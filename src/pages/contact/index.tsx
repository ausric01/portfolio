/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import Page from "~/components/containers/Page";
import Wrapper from "~/components/containers/Wrapper";
import Header from "~/components/containers/Header";
import { getServerAuthSession } from "~/server/auth";
import { type Session } from "next-auth";
import { type NextPage } from "next";
import Footer from "~/components/containers/Footer";
import { useState } from "react";

export default function Contact({
  user,
}: NextPage & {
  user: Session["user"];
}) {
  const [formData, setFormData] = useState<{
    name: string;
    email: string;
    phone: string;
  }>({
    name: "",
    email: "",
    phone: "",
  });
  const [formErrors, setFormErrors] = useState({
    name: "",
    email: "",
    phone: "",
  });
  return (
    <Page title="Contact Me">
      <main className="flex min-h-screen w-full flex-col items-center justify-center bg-slate-800">
        <Wrapper className="flex h-full w-full items-center justify-center">
          <Header user={user} />
          <div className="mx-auto mb-16 max-w-6xl sm:px-6 lg:px-8">
            <div className="mt-8 overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="mr-2 p-6 sm:rounded-lg">
                  <h1 className="text-4xl font-extrabold tracking-tight text-gray-800 dark:text-white sm:text-5xl">
                    Get in touch
                  </h1>
                  <p className="text-normal mt-2 text-lg font-medium text-gray-600 dark:text-gray-400 sm:text-2xl">
                    Fill in the form to start a conversation
                  </p>

                  <div className="mt-8 flex items-center text-gray-600 dark:text-gray-400">
                    <svg
                      fill="none"
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="1.5"
                      viewBox="0 0 24 24"
                      className="h-8 w-8 text-gray-500"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="1.5"
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="1.5"
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <div className="text-md ml-4 w-40 font-semibold tracking-wide">
                      Moncton, New Brunswick, Canada
                    </div>
                  </div>

                  <div className="mt-4 flex items-center text-gray-600 dark:text-gray-400">
                    <svg
                      fill="none"
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="1.5"
                      viewBox="0 0 24 24"
                      className="h-8 w-8 text-gray-500"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="1.5"
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                    <div className="text-md ml-4 w-40 font-semibold tracking-wide">
                      +1 5062334099
                    </div>
                  </div>

                  <div className="mt-2 flex items-center text-gray-600 dark:text-gray-400">
                    <svg
                      fill="none"
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="1.5"
                      viewBox="0 0 24 24"
                      className="h-8 w-8 text-gray-500"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="1.5"
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    <div className="text-md ml-4 w-40 font-semibold tracking-wide">
                      austingreer@hotmail.com
                    </div>
                  </div>
                </div>

                <form
                  onSubmit={(i) => {
                    i.preventDefault();

                    const e = {
                      name: "",
                      email: "",
                      phone: "",
                    };

                    if (formData.name == "") {
                      e.name = "Please enter your name";
                    }
                    if (formData.email == "") {
                      e.email = "Please enter your email";
                    }
                    if (formData.phone == "") {
                      e.phone = "Please enter your phone number";
                    }
                    if (/\S+@\S+\.\S+/.test(formData.email) == false) {
                      e.email = "Please enter a valid email";
                    }
                    if (/\d{3}-\d{3}-\d{4}/.test(formData.phone) == false) {
                      e.phone = "Please enter a valid phone number";
                    }

                    if (Object.values(e).every((i) => i == "")) {
                      setFormData({
                        name: "",
                        email: "",
                        phone: "",
                      });
                      //submit form
                    } else {
                      setFormErrors(e);
                    }
                  }}
                  className="flex flex-col justify-center p-6"
                >
                  <div className="flex flex-col">
                    <label htmlFor="name" className="hidden">
                      Full Name
                    </label>
                    <small className="text-red-500">{formErrors.name}</small>
                    <input
                      type="name"
                      name="name"
                      id="name"
                      value={formData.name}
                      onChange={(e) => {
                        setFormData({ ...formData, name: e.target.value });
                      }}
                      placeholder="Full Name"
                      className="w-100 mt-2 rounded-lg border border-gray-400 bg-white px-3 py-3 font-semibold text-white focus:border-indigo-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800"
                    />
                  </div>

                  <div className="mt-2 flex flex-col">
                    <label htmlFor="email" className="hidden">
                      Email
                    </label>
                    <small className="text-red-500">{formErrors.email}</small>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      value={formData.email}
                      onChange={(e) => {
                        setFormData({ ...formData, email: e.target.value });
                      }}
                      placeholder="Email"
                      className="w-100 mt-2 rounded-lg border border-gray-400 bg-white px-3 py-3 font-semibold text-white focus:border-indigo-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800"
                    />
                  </div>

                  <div className="mt-2 flex flex-col">
                    <label htmlFor="tel" className="hidden">
                      Number
                    </label>
                    <small className="text-red-500">{formErrors.phone}</small>
                    <input
                      type="tel"
                      name="tel"
                      value={formData.phone}
                      onChange={(e) => {
                        setFormData({ ...formData, phone: e.target.value });
                      }}
                      id="tel"
                      placeholder="Telephone Number"
                      className="w-100 mt-2 rounded-lg border border-gray-400 bg-white px-3 py-3 font-semibold text-white focus:border-indigo-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800"
                    />
                  </div>

                  <button
                    type="submit"
                    className="hover:bg-blue-dark mt-3 rounded-lg bg-indigo-600 px-6 py-3 font-bold text-white transition duration-300 ease-in-out hover:bg-indigo-500 md:w-32"
                  >
                    Submit
                  </button>
                </form>
              </div>
            </div>
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
