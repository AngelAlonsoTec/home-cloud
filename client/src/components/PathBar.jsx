import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { HouseFill, PencilFill } from 'react-bootstrap-icons';
import { browseUrl, normalizePath, pathSegments } from '../paths.js';

const Breadcrumbs = ({ path }) => (
  <ol className="breadcrumbs">
    <li>
      <Link to={browseUrl('')}>
        <HouseFill />
        Home
      </Link>
    </li>
    {pathSegments(path).map((segment) => (
      <li key={segment.path}>
        <Link to={browseUrl(segment.path)} title={segment.name}>
          {segment.name}
        </Link>
      </li>
    ))}
  </ol>
);

const PathForm = ({ path, onDone }) => {
  const [value, setValue] = useState(`/${path}`);
  const navigate = useNavigate();

  const onSubmit = (e) => {
    e.preventDefault();
    navigate(browseUrl(normalizePath(value)));
    onDone();
  };

  return (
    <form className="path-form" onSubmit={onSubmit}>
      <input
        className="input"
        aria-label="Path"
        autoFocus
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => e.key === 'Escape' && onDone()}
      />
      <button className="button" type="submit">
        Go
      </button>
    </form>
  );
};

/** Shows the current path as breadcrumbs, which can be edited as text. */
const PathBar = ({ path }) => {
  const [editing, setEditing] = useState(false);

  if (editing) {
    return (
      <nav className="path-bar" aria-label="Path">
        <PathForm path={path} onDone={() => setEditing(false)} />
      </nav>
    );
  }

  return (
    <nav className="path-bar" aria-label="Path">
      <Breadcrumbs path={path} />
      <button
        className="icon-button"
        onClick={() => setEditing(true)}
        title="Edit path"
        aria-label="Edit path"
      >
        <PencilFill size={13} />
      </button>
    </nav>
  );
};

export default PathBar;
