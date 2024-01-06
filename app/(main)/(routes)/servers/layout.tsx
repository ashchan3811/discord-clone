import React, { PropsWithChildren } from "react";

type ServersLayoutProps = PropsWithChildren<{}>;

const ServersLayout = ({ children }: ServersLayoutProps) => {
  return <div className={"h-full"}>{children}</div>;
};

export default ServersLayout;
