import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin | UVT Advertising",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return (
    <div className="min-h-full flex flex-col bg-background text-foreground">
      {children}
    </div>
  );
}
