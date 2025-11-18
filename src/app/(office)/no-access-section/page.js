"use client";

import { useEffect } from "react";
import { useSession } from "@/lib/auth-client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useLoader } from "@/app/context/LoaderContext";
import Link from "next/link";
import { Button } from "@/components/ui/button";

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
          <Button asChild>
            <Link href="/">
              Return To Portal
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NoAccess;
