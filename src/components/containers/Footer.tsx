import { type Session } from "next-auth";
import { signIn, signOut } from "next-auth/react";
import Link from "next/link";

type Props = {
  user: Session["user"];
};

export default function Footer({ user }: Props) {
  return (
    <footer className="sticky top-full flex w-full flex-row items-center justify-center gap-2 rounded-t-xl bg-white p-2 text-black">
      <div className="flex w-1/3 flex-row items-center justify-between text-xs font-medium">
        <h2 className="select-none text-gray-600/75">Austin Richard-Greer</h2>
        {!user && (
          <button
            className="rounded-full p-1 px-4 text-gray-600 transition-colors hover:bg-black hover:text-white"
            onClick={() => void signIn("google")}
          >
            Login
          </button>
        )}
        {user && (
          <button
            className="text-gray-600/75 hover:text-gray-600"
            onClick={() =>
              void signOut({
                callbackUrl: "/",
              })
            }
          >
            Logout
          </button>
        )}
      </div>
    </footer>
  );
}
