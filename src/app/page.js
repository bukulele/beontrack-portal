"use client";

import { useEffect, useRef } from "react";
import ThreeDotsLoader from "./components/loader/ThreeDotsLoader";
import { useLoader } from "./context/LoaderContext";
import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Button from "./components/button/Button";

const Home = () => {
  const hasStartedLoading = useRef(false);

  const router = useRouter();

  const { startLoading, stopLoading } = useLoader();
  const { data: session, status } = useSession();

  const handleSignIn = () => {
    startLoading();
    signIn("azure-ad");
  };

  useEffect(() => {
    if (!hasStartedLoading.current) {
      startLoading();
      hasStartedLoading.current = true;
    }
  }, []);

  useEffect(() => {
    if (status !== "loading" && hasStartedLoading.current) {
      stopLoading();
    }
    if (status === "authenticated") {
      router.push("/table");
    }
  }, [status]);

  return (
    <>
      <ThreeDotsLoader />
      {status === "unauthenticated" && (
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
              <p className="text-center">
                Please sign in with your Microsoft account to enter the
                application.
              </p>
              <Button
                content={"Sign In"}
                style={"classicButton"}
                fn={handleSignIn}
                highlighted={true}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Home;
