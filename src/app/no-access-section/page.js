"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useLoader } from "../context/LoaderContext";
import Link from "next/link";

const NoAccess = () => {
  const router = useRouter();
  const { status } = useSession();

  const { startLoading, stopLoading } = useLoader();

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
              " You don't have an access to this section at 4Tracks portal. Please contact IT department."
            }
          </p>
          <Link
            href="/"
            className="border-none py-3 px-2 shadow-sm bg-stone-200 rounded font-norma hover:bg-[#b92531] hover:text-white hover:shadow-sm active:bg-orange-600 cursor-pointer"
          >
            Return To Portal
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NoAccess;
