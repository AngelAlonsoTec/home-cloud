import { Link } from 'react-router';
import { BoxArrowRight, CloudFill } from 'react-bootstrap-icons';

const Header = ({ onLogout }) => (
  <header className="topbar">
    <div className="topbar-content">
      <Link to="/" className="logo">
        <CloudFill size={22} />
        Home Cloud
      </Link>
      {onLogout && (
        <button className="button" onClick={onLogout}>
          <BoxArrowRight />
          Logout
        </button>
      )}
    </div>
  </header>
);

export default Header;
