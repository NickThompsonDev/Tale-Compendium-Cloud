"use client";

import { ClerkProvider, useAuth } from "@clerk/nextjs";
import { useEffect } from "react";
import { setAuthToken, clearAuth } from "@/api/axiosInstance";

const ApiProviderWithClerk = ({ children }: { children: React.ReactNode }) => {
  const { isLoaded, isSignedIn, getToken } = useAuth();

  useEffect(() => {
    const configureApiClient = async () => {
      if (isSignedIn) {
        const token = await getToken();
        setAuthToken(token);
      } else {
        clearAuth();
      }
    };

    if (isLoaded) {
      configureApiClient();
    }
  }, [isLoaded, isSignedIn, getToken]);

  return <>{children}</>;
};

const ApiClerkProvider = ({ children }: { children: React.ReactNode }) => (
  <ClerkProvider
    publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY as string}
    appearance={{
      layout: {
        socialButtonsVariant: "iconButton",
        logoImageUrl: "/icons/tclogo.svg",
      },
      variables: {
        colorBackground: "#15171c",
        colorPrimary: "",
        colorText: "white",
        colorInputBackground: "#1b1f29",
        colorInputText: "white",
      },
    }}
  >
    <ApiProviderWithClerk>
      {children}
    </ApiProviderWithClerk>
  </ClerkProvider>
);

export default ApiClerkProvider;
