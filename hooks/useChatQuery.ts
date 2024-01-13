import qs from "query-string";
import { useInfiniteQuery } from "@tanstack/react-query";

import { ChatParamTypes, IChatQueryData } from "@/types";
import { useSocket } from "@/components/providers/SocketProvider";

type ChatQueryProps = {
  queryKey: string;
  apiUrl: string;
  paramKey: ChatParamTypes;
  paramValue: string;
};

export const useChatQuery = ({
  queryKey,
  paramKey,
  paramValue,
  apiUrl,
}: ChatQueryProps) => {
  const { isConnected } = useSocket();

  const fetchMessages = async ({ pageParam = undefined }) => {
    const url = qs.stringifyUrl(
      {
        url: apiUrl,
        query: {
          cursor: pageParam,
          [paramKey]: paramValue,
        },
      },
      { skipNull: true },
    );

    const res = await fetch(url);
    return res.json();
  };

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useInfiniteQuery({
      initialPageParam: undefined,
      queryKey: [queryKey],
      queryFn: fetchMessages,
      getNextPageParam: (lastPage) => lastPage?.nextCursor,
      refetchInterval: isConnected ? false : 1000,
    });

  return {
    data: data as IChatQueryData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  };
};
