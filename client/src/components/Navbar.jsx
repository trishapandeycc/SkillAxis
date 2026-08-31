import logo from "../assets/logo/skillAxis-logo.png";
import { FaUserCircle } from "react-icons/fa";

function Navbar({ role = "Admin" }) {
  return (
    <header className="navbar">
      <div className="navbar-logo">
        <img src={logo} alt="SkillAxis" className="skillaxis-logo" />
      </div>

      <div className="navbar-user">
        <span className="user-role">{role}</span>

        <button className="profile-button" aria-label="Profile">
          <FaUserCircle />
        </button>
      </div>
    </header>
  );
}

export default Navbar;
