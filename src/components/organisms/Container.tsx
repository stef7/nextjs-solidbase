import clsx from "clsx";
import React, { PropsWithChildren } from "react";

export const Container: React.FC<
  {
    relative?: boolean;
  } & PropsWithChildren
> = ({ children, relative }) => <div className={clsx(`p-container`, relative && `relative`)}>{children}</div>;
