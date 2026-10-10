import { Bell, ChevronDown } from "lucide-react";
import { useSelector } from "react-redux";

const Header = () => {
  const { user } = useSelector((state) => state.auth);

  const initials = user?.name
    ? user.name
        .trim()
        .split(/\s+/)
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "U";

  return (
    <header className="header">
      <div className="header-search">
        {/* <input type="text" placeholder="Search tasks..." /> */}
      </div>

      <div className="header-right">
        <button
          type="button"
          className="icon-button"
          aria-label="Notifications">
          <Bell size={19} />
        </button>

        <div className="user-menu">
          {user?.avatar ? (
            <img
              className="avatar"
              src={user?.avatar}
              alt={`${user?.name}'s avatar`}
            />
          ) : (
            <div className="avatar">{initials}</div>
          )}

          <div className="user-info">
            <strong>{user?.name || "User"}</strong>
            <span>{user?.email || ""}</span>
          </div>

          <ChevronDown size={16} />
        </div>
      </div>
    </header>
  );
};

export default Header;
//=================================================
// import { Bell, ChevronDown, Menu, Search } from "lucide-react";
// import React from "react";

// const Header = () => {
//   return (
//     <header className="header">
//       <button className="mobile-menu-button">
//         <Menu size={22} />
//       </button>
//       <div className="header-search">
//         <Search size={18} />

//         <input type="text" placeholder="Search tasks..." />
//       </div>
//       <div className="header-right">
//         <button className="icon-button">
//           <Bell size={19} />
//         </button>
//         <div className="user-menu">
//           <div className="avatar">RV</div>
//           <div className="user-info">
//             <strong>Rishabh</strong>
//             <span>Frontend Developer</span>
//           </div>
//           <ChevronDown size={16} />
//         </div>
//       </div>
//     </header>
//   );
// };

// export default Header;
//=============================================
