import { createFileRoute } from "@tanstack/react-router";
import { SolarisApp } from "@/components/solaris/solaris-app";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return <SolarisApp />;
}
