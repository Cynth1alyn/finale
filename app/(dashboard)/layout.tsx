import Sidebar from '@/app/components/Sidebar';
import Topbar from '@/app/components/Topbar';
import RoleGuard from '@/app/components/RoleGuard';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard>
      <div className="layout-shell">
        <Sidebar />
        <div className="main-content">
          <Topbar title="TechJob" />
          <main className="page-content animate-fade-in">
            {children}
          </main>
        </div>
      </div>
    </RoleGuard>
  );
}
