// src/components/Layout.jsx
import TopBar from "./TopBar";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gray-100">
      <TopBar />
      <main className="">{children}</main>
    </div>
  );
}
