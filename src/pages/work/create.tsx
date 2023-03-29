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
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import classNames from "classnames";
import base64 from "base-64";
import { buffer } from "stream/consumers";

type FormData = {
  title: string;
  description: string;
  technologies: string[];
  file: File | null;
};

function getBase64(file: File) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

export default function CreateWork({
  user,
}: NextPage & {
  user: Session["user"];
}) {
  const { data: tech } = api.technologies.get.useQuery({});

  const [parent, _] = useAutoAnimate();

  const [form, setForm] = useState<FormData>({
    title: "",
    description: "",
    technologies: [],
    file: null,
  });

  const { mutate } = api.work.insert.useMutation();

  const [errors, setErrors] = useState<{
    title: string;
    description: string;
    technologies: string;
    file: string;
  }>({
    title: "",
    description: "",
    technologies: "",
    file: "",
  });

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setForm((i) => ({
      ...i,
      file: acceptedFiles[0] ?? new File([""], "empty"),
    }));
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
  });

  function validateForm() {
    const e = {
      title: "",
      description: "",
      technologies: "",
      file: "",
    };
    if (form.title == "") {
      e.title = "Title is required";
    }
    if (form.description == "") {
      e.description = "Description is required";
    }
    if (form.technologies.length == 0) {
      e.technologies = "Technologies are required";
    }
    if (form.file == null) {
      e.file = "Image is required";
    }
    if (
      !(
        form.file?.type == "image/png" ||
        form.file?.type == "image/jpeg" ||
        form.file?.type == "image/jpg" ||
        form.file?.type == "image/webp"
      )
    ) {
      e.file = "Image must be of type PNG, JPG/JPEG or WEBP";
    }

    setErrors(e);
    return Object.values(e).every((i) => i == "");
  }

  return (
    <Page title="Home">
      <main className="flex min-h-screen w-full flex-col items-center bg-slate-800">
        <Wrapper className="flex items-center justify-center">
          <Header user={user} />
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setErrors({
                title: "",
                description: "",
                technologies: "",
                file: "",
              });
              if (validateForm()) {
                //@ts-ignore
                void getBase64(form.file).then((e) => {
                  mutate({
                    title: form.title,
                    description: form.description,
                    technologies: form.technologies,
                    fileName: form.file?.name ?? "",
                    base64String: e as string,
                  });
                });
              }
            }}
            className="w-full max-w-lg rounded bg-slate-800 p-6 px-8"
          >
            <div className="-mx-3 flex flex-wrap">
              <div className="w-full px-3 md:mb-0">
                <label
                  className="mb-2 flex justify-between text-xs font-medium text-gray-400"
                  htmlFor="grid-title"
                >
                  Title{" "}
                  {errors.title && (
                    <span className="text-red-600">{errors.title}</span>
                  )}
                </label>
                <input
                  className="mb-3 block w-full appearance-none rounded border border-gray-200 bg-gray-200 px-4 py-3 leading-tight text-gray-700 focus:border-gray-500 focus:bg-white focus:outline-none"
                  id="grid-title"
                  type="text"
                  value={form.title}
                  onChange={(e) => {
                    setForm((i) => ({ ...i, title: e.target.value }));
                  }}
                />
              </div>
              <div className="w-full px-3 md:w-1/2"></div>
            </div>
            <div className="-mx-3 flex flex-wrap">
              <div className="w-full px-3">
                <label
                  className="mb-2 flex justify-between text-xs font-medium text-gray-400"
                  htmlFor="grid-description"
                >
                  Description{" "}
                  {errors.description && (
                    <span className="text-red-600">{errors.description}</span>
                  )}
                </label>
                <textarea
                  className="mb-3 block w-full resize-none appearance-none rounded border border-gray-200 bg-gray-200 px-4 py-3 leading-tight text-gray-700 focus:border-gray-500 focus:bg-white focus:outline-none"
                  id="grid-description"
                  value={form.description}
                  onChange={(e) => {
                    setForm((i) => ({ ...i, description: e.target.value }));
                  }}
                />
              </div>
            </div>
            <div className="-mx-3 flex flex-wrap">
              <div className="w-full px-3 md:mb-0">
                <label
                  className="mb-2 flex justify-between text-xs font-medium text-gray-400"
                  htmlFor="grid-select"
                >
                  Technologies
                  {errors.technologies && (
                    <span className="text-red-600">{errors.technologies}</span>
                  )}
                </label>
                {/* <input
                  className="mb-3 block w-full appearance-none rounded border border-gray-200 bg-gray-200 px-4 py-3 leading-tight text-gray-700 focus:border-gray-500 focus:bg-white focus:outline-none"
                  id="grid-title"
                  type="text"
                /> */}
                <select
                  className="mb-3 block w-full appearance-none rounded border border-gray-200 bg-gray-200 px-4 py-3 leading-tight text-gray-700 focus:border-gray-500 focus:bg-white focus:outline-none"
                  id="grid-select"
                  onChange={(e) => {
                    if (
                      form.technologies.find((i) => i === e.target.value) ===
                        undefined &&
                      tech?.technologies?.find((i) => i.id === e.target.value)
                    ) {
                      setForm((i) => {
                        return {
                          ...i,
                          technologies: [...i.technologies, e.target.value],
                        };
                      });
                    }
                  }}
                >
                  <option value="">Select Technologies</option>
                  {tech?.technologies?.map((t) => {
                    if (
                      form.technologies.find((i) => i === t.id) === undefined
                    ) {
                      return (
                        <option key={t.id} value={t.id}>
                          {t.name}
                        </option>
                      );
                    }
                  })}
                </select>
                <div
                  className={classNames(
                    "my-2 mt-4 grid grid-flow-row grid-cols-4 gap-2",
                    form.technologies.length > 0 && "mb-8"
                  )}
                  ref={parent}
                >
                  {form.technologies.map((t) => (
                    <span
                      key={t}
                      className="flex select-none flex-row items-center gap-1 rounded bg-white p-1 pl-2 tracking-tight text-black"
                    >
                      <svg
                        onClick={() => {
                          setForm((i) => {
                            return {
                              ...i,
                              technologies: i.technologies.filter(
                                (i) => i !== t
                              ),
                            };
                          });
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

                      {tech?.technologies?.find((i) => i.id === t)?.name}
                    </span>
                  ))}
                </div>
              </div>
              <div className="w-full px-3 md:w-1/2" />
            </div>
            <div className="-mx-3 flex flex-wrap">
              <div className="flex w-full flex-col items-end px-3">
                {form.file == null && (
                  <>
                    {errors.file && (
                      <span className="text-xs text-red-600">
                        {errors.file}
                      </span>
                    )}
                    <div
                      className="mt-2 flex w-full resize-none flex-col items-center justify-center rounded bg-gray-200 p-8 outline-none focus:bg-white"
                      {...getRootProps()}
                    >
                      <input {...getInputProps()} />
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="h-12 w-12 text-blue-600"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m6.75 12l-3-3m0 0l-3 3m3-3v6m-1.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                        />
                      </svg>
                      {isDragActive ? (
                        <p className="text-xs text-blue-800/50">Drop mee ...</p>
                      ) : (
                        <p className="text-xs text-blue-800/50">
                          Drop your image here
                        </p>
                      )}
                      {form.file != null && (
                        <p className="text-xs text-blue-800/50">{form.file}</p>
                      )}
                    </div>
                  </>
                )}
                {form.file && (
                  <div className="mt-2 flex w-full flex-row items-center justify-between gap-2 rounded bg-gray-200 p-2 px-4">
                    <p>
                      {
                        //@ts-ignore
                        form.file?.path?.substring(0, 50)
                      }
                      {
                        //@ts-ignore
                        [...form.file?.path]?.length > 50 && "..."
                      }
                    </p>
                    <button
                      onClick={() => {
                        setForm((i) => {
                          return {
                            ...i,
                            file: null,
                          };
                        });
                      }}
                      className="text-xs text-red-400"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>
            </div>
            <button className="mt-6 w-full rounded bg-blue-600 p-3 uppercase tracking-wide text-white outline-none transition-colors hover:bg-blue-800">
              Create
            </button>
          </form>
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
