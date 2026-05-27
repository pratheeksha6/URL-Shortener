import { Link, useLocation } from "react-router-dom";

function Navbar() {
  const location = useLocation();

  return (
    <div className="navbar">
      <div className="nav-tabs">
        <Link
          to="/"
          className={location.pathname === "/" ? "nav-tab active" : "nav-tab"}
        >
          URL Shortener
        </Link>
        <Link
          to="/users"
          className={
            location.pathname === "/users" ? "nav-tab active" : "nav-tab"
          }
        >
          Users
        </Link>
      </div>
    </div>
  );
}

export default Navbar;
