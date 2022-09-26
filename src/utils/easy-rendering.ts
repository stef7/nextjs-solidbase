import hashSum from "hash-sum";
import React from "react";

export const easyMap = <Item extends object>(
  array: (Item | undefined)[] | undefined,
  mapFunction: (item: Item, key: React.Key) => React.ReactNode | undefined,
  wrapFunction?: (children: React.ReactNode[]) => React.ReactNode | undefined,
): React.ReactNode => {
  if (!array?.length) return null;
  const children: React.ReactNode[] = array
    .map((item, index) => {
      if (!item) return null;
      const key = `${index}-${hashSum(item)}`;
      return mapFunction(item, key) || null;
    })
    .filter(Boolean);
  return children.length > 0 ? wrapFunction?.(children) ?? children : null;
};
