import { ReactNode } from "react";
import { Sidebar } from "./sidebar";
import { Header } from "./header";

interface MainLayoutProps {
  children: ReactNode;
  title: string;
  description: string;
  onRunTests?: () => void;
}

export function MainLayout({ children, title, description, onRunTests }: MainLayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <Header title={title} description={description} onRunTests={onRunTests} />
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
