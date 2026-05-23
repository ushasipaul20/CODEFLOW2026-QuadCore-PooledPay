import React from "react";

function Dashboard() {
  const user = {
    role: "RETAILER",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#0f172a",
        color: "white",
        fontSize: "2rem",
        fontWeight: "700",
      }}
    >
      {user.role === "RETAILER" && <h1>Hello Retailer 👋</h1>}
      {user.role === "SUPPLIER" && <h1>Hello Supplier 🚚</h1>}
      {user.role === "ADMIN" && <h1>Hello Admin ⚡</h1>}
    </div>
  );
}

export default Dashboard;