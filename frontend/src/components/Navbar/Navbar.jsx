import React, { useContext, useEffect, useState } from "react";
import "./Navbar.css";
import { Link, useNavigate } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";
import { FiSearch, FiShoppingCart, FiUser, FiMenu, FiX } from "react-icons/fi";

const Navbar = ({ setShowLogin, hideMenuLink = false }) => {
  const [menu, setMenu] = useState("Home");
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { getTotalCartAmount, token, setToken } = useContext(StoreContext);
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    navigate("/");
    setIsMenuOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <nav className={`navbar ${isScrolled ? "scrolled" : ""}`}>
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="navbar-brand" onClick={closeMenu}>
          <img 
            src="./bhojan-logo.png" 
            alt="Bhojan Logo" 
            className="navbar-logo"
          />
        </Link>

        {/* Desktop Navigation */}
        <ul className="navbar-links">
          <li>
            <a
              href="#home"
              onClick={() => setMenu("Home")}
              className={menu === "Home" ? "active" : ""}
            >
              Home
            </a>
          </li>
          {!hideMenuLink && (
            <li>
              <a
                href="#explore-menu"
                onClick={() => setMenu("Menu")}
                className={menu === "Menu" ? "active" : ""}
              >
                Menu
              </a>
            </li>
          )}
          <li>
            <a
              href="#footer"
              onClick={() => setMenu("Contact-us")}
              className={menu === "Contact-us" ? "active" : ""}
            >
              Contact
            </a>
          </li>
        </ul>

        {/* Right Side Icons - Desktop */}
        <div className="navbar-actions">
          <button className="search-btn" aria-label="Search">
            <FiSearch size={20} />
          </button>
          
          <Link to="/cart" className="cart-btn" aria-label="Cart">
            <FiShoppingCart size={20} />
            {getTotalCartAmount() > 0 && <span className="cart-badge"></span>}
          </Link>
          
          {!token ? (
            <button 
              className="btn btn-outline"
              onClick={() => setShowLogin(true)}
            >
              Sign In
            </button>
          ) : (
            <div className="profile-dropdown">
              <button className="profile-btn" aria-label="Profile">
                <FiUser size={20} />
              </button>
              <ul className="dropdown-menu">
                <li>
                  <Link to="/myorders" className="dropdown-item">
                    <FiShoppingCart />
                    <span>My Orders</span>
                  </Link>
                </li>
                <li className="divider"></li>
                <li>
                  <button onClick={logout} className="dropdown-item">
                    <FiUser />
                    <span>Logout</span>
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* Mobile Menu Button - Right Side */}
        <button 
          className="navbar-toggler" 
          onClick={toggleMenu} 
          aria-label="Toggle navigation"
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>

        {/* Mobile Navigation */}
        <div className={`mobile-menu ${isMenuOpen ? "open" : ""}`}>
          <div className="mobile-menu-header">
            {token ? (
              <div className="mobile-profile">
                <FiUser size={24} />
                <span>My Account</span>
              </div>
            ) : (
              <button 
                className="btn btn-primary"
                onClick={() => {
                  setShowLogin(true);
                  closeMenu();
                }}
              >
                Sign In
              </button>
            )}
          </div>
          
          <ul className="mobile-nav-links">
            <li>
              <a
                href="#home"
                onClick={() => {
                  setMenu("Home");
                  closeMenu();
                }}
                className={menu === "Home" ? "active" : ""}
              >
                Home
              </a>
            </li>
            {!hideMenuLink && (
              <li>
                <a
                  href="#explore-menu"
                  onClick={() => {
                    setMenu("Menu");
                    closeMenu();
                  }}
                  className={menu === "Menu" ? "active" : ""}
                >
                  Menu
                </a>
              </li>
            )}
            <li>
              <a
                href="#footer"
                onClick={() => {
                  setMenu("Contact-us");
                  closeMenu();
                }}
                className={menu === "Contact-us" ? "active" : ""}
              >
                Contact
              </a>
            </li>
            
            {token && (
              <>
                <li>
                  <Link to="/cart" onClick={closeMenu} className="mobile-nav-item">
                    <FiShoppingCart />
                    <span>Cart</span>
                    {getTotalCartAmount() > 0 && <span className="mobile-cart-badge"></span>}
                  </Link>
                </li>
                <li>
                  <Link to="/myorders" onClick={closeMenu} className="mobile-nav-item">
                    <FiShoppingCart />
                    <span>My Orders</span>
                  </Link>
                </li>
                <li>
                  <button onClick={logout} className="mobile-nav-item logout-btn">
                    <FiUser />
                    <span>Logout</span>
                  </button>
                </li>
              </>
            )}
          </ul>
          
          <div className="mobile-search">
            <input type="text" placeholder="Search..." />
            <button className="search-submit">
              <FiSearch size={20} />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;