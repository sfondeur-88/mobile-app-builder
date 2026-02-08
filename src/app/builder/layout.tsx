import { AppHeader } from "@/components/layout/AppHeader";

export default function BuilderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AppHeader />
      {children}
    </>
  );
}