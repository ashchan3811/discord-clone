"use client";

import React, { PropsWithChildren, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

type QueryProviderProps = PropsWithChildren<{}>;

const QueryProvider = ({ children }: QueryProviderProps) => {
  const [client] = useState(() => {
    return new QueryClient();
  });

  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
};

export default QueryProvider;
