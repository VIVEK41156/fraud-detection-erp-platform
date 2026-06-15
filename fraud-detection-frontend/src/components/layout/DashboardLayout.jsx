import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

function DashboardLayout({
  children,
}) {
  return (
    <div className="flex min-h-screen bg-slate-950">

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="ml-[280px] w-full p-8">

        {/* Navbar */}
        <Navbar />

        {/* Page Content */}
        <div>
          {children}
        </div>

      </div>

    </div>
  );
}

export default DashboardLayout;