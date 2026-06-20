import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

function DashboardLayout({ children }) {
  return (
    <div className="main-layout">
      <Sidebar />
      <div className="main-content">
        <Navbar />
        <div className="fade-in-up">
          {children}
        </div>
      </div>
    </div>
  );
}

export default DashboardLayout;