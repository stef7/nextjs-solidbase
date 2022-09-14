import React, { PropsWithChildren } from "react";

export const Container: React.FC<PropsWithChildren> = ({ children }) => (
  <div className="container contain">{children}</div>
);
