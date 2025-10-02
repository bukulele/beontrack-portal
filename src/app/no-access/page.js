"use client";

import { useEffect } from "react";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Button from "../components/button/Button";
import { useLoader } from "../context/LoaderContext";

const NoAccess = () => {
  const router = useRouter();
  const { status } = useSession();

  const { startLoading, stopLoading } = useLoader();

  const handleSignOut = () => {
    startLoading();
    signOut({ redirect: false });
  };

  useEffect(() => {
    if (status === "unauthenticated") {
      stopLoading();
      router.push("/");
    }
  }, [status]);

  return (
    <div className="flex items-center justify-center min-h-screen max-h-screen w-screen">
      <div className="w-96 w-max-full shadow rounded bg-white p-2">
        <Image
          src="/logo.png"
          alt="Logo"
          width={400}
          height={92}
          className="border-b border-gray-100"
        />
        <div className="w-full flex flex-col gap-2 items-center p-2">
          <p className="text-center text-red-500 font-semibold">
            {
              " You don't have an access to 4Tracks portal. Please contact IT department."
            }
          </p>
          <Button
            content={"Sign Out"}
            style={"classicButton"}
            fn={handleSignOut}
          />
        </div>
      </div>
    </div>
  );
};

export default NoAccess;
