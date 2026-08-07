import { useState } from "react";
import { Link } from "react-router-dom";
import { FaBars, FaTimes, FaRobot } from "react-icons/fa";
import { MdLanguage } from "react-icons/md";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [language, setLanguage] = useState("EN");

  return (
    <nav className="fixed top-0 w-full z-50 backdrop-blur-md bg-white/70 shadow-md">
      <div className="flex justify-between items-center px-6 py-4">
        
        {/* Logo */}
        <h1 className="text-2xl font-bold text-blue-600">
          Aacharyshree Hospital
        </h1>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-6 items-center font-medium">
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/doctors">Doctors</Link>
          <Link to="/rooms">Rooms</Link>
          <Link to="/contact">Contact</Link>

          {/* Language Switch */}
          <div className="flex items-center gap-2 cursor-pointer">
            <MdLanguage />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-transparent outline-none"
            >
              <option value="EN">EN</option>
              <option value="HI">HI</option>
              <option value="MR">MR</option>
            </select>
          </div>

          {/* Chatbot */}
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700">
            <FaRobot /> Chat
          </button>
        </div>

        {/* Mobile Menu Icon */}
        <div className="md:hidden text-2xl">
          {menuOpen ? (
            <FaTimes onClick={() => setMenuOpen(false)} />
          ) : (
            <FaBars onClick={() => setMenuOpen(true)} />
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white shadow-lg px-6 py-4 flex flex-col gap-4">
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/doctors">Doctors</Link>
          <Link to="/rooms">Rooms</Link>
          <Link to="/contact">Contact</Link>

          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="EN">English</option>
            <option value="HI">Hindi</option>
            <option value="MR">Marathi</option>
          </select>

          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2">
            <FaRobot /> Chat
          </button>
        </div>
      )}
    </nav>
  );
}

export default Navbar;