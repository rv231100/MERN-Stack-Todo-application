import {
  Circle,
  CircleCheck,
  Clock3,
  Folder,
  KanbanSquare,
  LayoutDashboard,
  ListTodo,
  LogOut,
  Settings,
} from "lucide-react";
import React from "react";
import { useDispatch } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { logoutUser } from "../../features/auth/authSlice";

const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      navigate("/login", { replace: true });
    } catch (err) {
      console.error("Logout Failed: ", err);
    }
  };

  const menuItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "All Tasks",
      path: "/tasks",
      icon: ListTodo,
    },
    // {
    //   name: "Pending",
    //   path: "/tasks?status=todo",
    //   icon: Clock3,
    // },
    // {
    //   name: "Completed",
    //   path: "/tasks?status=completed",
    //   icon: CircleCheck,
    // },
    // {
    //   name: "Kanban Board",
    //   path: "/kanban",
    //   icon: KanbanSquare,
    // },
    // {
    //   name: "Categories",
    //   path: "/categories",
    //   icon: Folder,
    // },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-icon">✓</div>
        <span>TodoPlanner</span>
      </div>
      <nav className="sidebar-nav">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                isActive ? "nav-item active" : "nav-item"
              }>
              <Icon size={19} />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>
      <div className="sidebar-bottom">
        <NavLink to="/settings" className="nav-item">
          <Settings size={19} />
          <span>Settings</span>
        </NavLink>
        <button type="button" className="logout-button" onClick={handleLogout}>
          <LogOut size={19} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
