/* eslint-disable @typescript-eslint/no-explicit-any */
import classNames from "classnames";

type Props = {
  maxWidth?: string;
};

export default function Wrapper({
  maxWidth,
  children,
  className,
}: Props & {
  children?: any;
  className?: string;
}) {
  return (
    <>
      <div
        className={classNames(
          "flex min-h-screen w-full flex-col items-center",
          maxWidth ?? "max-w-[1024px]",
          className
        )}
      >
        {children}
      </div>
    </>
  );
}
