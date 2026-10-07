import { useState } from 'react';
import { Link } from 'react-router';
import {
  ChevronRight,
  Download,
  FileEarmarkImageFill,
  FileEarmarkMusicFill,
  FileEarmarkPlayFill,
  FileEarmarkTextFill,
  FileEarmarkZipFill,
  FolderFill,
  XLg,
} from 'react-bootstrap-icons';
import api from '../api.js';
import { browseUrl } from '../paths.js';

const ICON_SIZE = 22;

const fileTypes = [
  {
    icon: FileEarmarkImageFill,
    className: 'icon-image',
    extensions: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp', 'heic'],
  },
  {
    icon: FileEarmarkPlayFill,
    className: 'icon-video',
    extensions: ['mp4', 'mkv', 'mov', 'avi', 'webm'],
  },
  {
    icon: FileEarmarkMusicFill,
    className: 'icon-audio',
    extensions: ['mp3', 'wav', 'flac', 'ogg', 'm4a'],
  },
  {
    icon: FileEarmarkZipFill,
    className: 'icon-archive',
    extensions: ['zip', 'rar', '7z', 'tar', 'gz'],
  },
];

const defaultFileType = { icon: FileEarmarkTextFill, className: 'icon-file' };

const extension = (name) =>
  name.includes('.') ? name.split('.').pop().toLowerCase() : '';

const fileType = (name) =>
  fileTypes.find((type) => type.extensions.includes(extension(name))) ??
  defaultFileType;

export const DirectoryEntry = ({ name, path }) => (
  <li>
    <Link className="entry" to={browseUrl(path)}>
      <FolderFill size={ICON_SIZE} className="icon-folder" />
      <span className="entry-name">{name}</span>
      <ChevronRight className="entry-action" />
    </Link>
  </li>
);

export const FileEntry = ({ name, path }) => {
  const { icon: Icon, className } = fileType(name);

  return (
    <li>
      <a
        className="entry"
        href={api.downloadUrl(path)}
        download={name}
        title={`Download ${name}`}
      >
        <Icon size={ICON_SIZE} className={className} />
        <span className="entry-name">{name}</span>
        <Download className="entry-action" />
      </a>
    </li>
  );
};

/** Inline form shown as the first entry of the list. */
export const NewFolderEntry = ({ onCreate, onCancel }) => {
  const [name, setName] = useState('');
  const [creating, setCreating] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setCreating(true);
    await onCreate(name);
    setCreating(false);
  };

  return (
    <li>
      <div className="entry">
        <FolderFill size={ICON_SIZE} className="icon-folder" />
        <form onSubmit={onSubmit}>
          <input
            className="input"
            placeholder="Folder name"
            aria-label="Folder name"
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === 'Escape' && onCancel()}
          />
          <button
            className="button button-primary"
            type="submit"
            disabled={creating || !name.trim()}
          >
            Create
          </button>
          <button
            className="icon-button"
            type="button"
            onClick={onCancel}
            aria-label="Cancel"
          >
            <XLg />
          </button>
        </form>
      </div>
    </li>
  );
};
