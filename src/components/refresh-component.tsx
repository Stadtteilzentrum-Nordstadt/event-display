"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function RefreshComponent(props: {
  refreshInterval: number;
  children?: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    const id = setInterval(() => {
      router.refresh();
    }, props.refreshInterval * 1000);

    return () => clearInterval(id);
  }, [props.refreshInterval, router]);
  return <>{props.children}</>;
}
