import Sidebar from '@/app/components/Sidebar';
import Topbar from '@/app/components/Topbar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="layout-shell">
      <Sidebar />
      <div className="main-content">
        <Topbar title="TechJob" />
        <main className="page-content animate-fade-in">
          {children}
        </main>
      </div>
    </div>
  );
}
