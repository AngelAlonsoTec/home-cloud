import { useCallback, useEffect, useState } from 'react';
import {
  CloudArrowUp,
  ExclamationTriangle,
  FolderPlus,
} from 'react-bootstrap-icons';
import api from '../api.js';
import { joinPath } from '../paths.js';
import useAsyncAction from '../hooks/useAsyncAction.js';
import DropZone from './DropZone.jsx';
import Loading from './Loading.jsx';
import PathBar from './PathBar.jsx';
import Toast from './Toast.jsx';
import UploadButton from './UploadButton.jsx';
import { DirectoryEntry, FileEntry, NewFolderEntry } from './Entry.jsx';

const count = (n, word) => `${n} ${word}${n === 1 ? '' : 's'}`;

const EmptyState = () => (
  <div className="empty">
    <CloudArrowUp size={48} />
    <strong>This folder is empty</strong>
    Drop files here or use the Upload button
  </div>
);

const ErrorState = ({ message }) => (
  <div className="empty error-state">
    <ExclamationTriangle size={40} />
    <strong>{message}</strong>
  </div>
);

const Listing = ({ path, listing, newFolder }) => {
  if (!listing) {
    return <Loading text="Loading..." />;
  }
  if (!listing.success) {
    return <ErrorState message={listing.message} />;
  }

  const { directories, files } = listing.content;
  if (!directories.length && !files.length && !newFolder) {
    return <EmptyState />;
  }

  return (
    <>
      <ul className="entries">
        {newFolder}
        {directories.map((name) => (
          <DirectoryEntry key={name} name={name} path={joinPath(path, name)} />
        ))}
        {files.map((name) => (
          <FileEntry key={name} name={name} path={joinPath(path, name)} />
        ))}
      </ul>
      <div className="listing-footer">
        {count(directories.length, 'folder')}, {count(files.length, 'file')}
      </div>
    </>
  );
};

const Browser = ({ path }) => {
  const [listing, setListing] = useState(null);
  const [version, setVersion] = useState(0);
  const [notice, setNotice] = useState(null);
  const [creatingFolder, setCreatingFolder] = useState(false);
  const upload = useAsyncAction((files) => api.uploadFiles(path, files));

  useEffect(() => {
    // Ignores responses that arrive after leaving this directory
    let ignore = false;
    api.getContent(path).then((result) => !ignore && setListing(result));
    return () => {
      ignore = true;
    };
  }, [path, version]);

  const closeNotice = useCallback(() => setNotice(null), []);

  /** Shows the result of an action and reloads the content if it worked. */
  const handleResult = (result) => {
    setNotice(result);
    if (result.success) {
      setVersion((v) => v + 1);
    }
    return result.success;
  };

  const uploadFiles = async (files) => {
    if (!upload.running) {
      handleResult(await upload.run(files));
    }
  };

  const createFolder = async (name) => {
    if (handleResult(await api.mkDir(path, name))) {
      setCreatingFolder(false);
    }
  };

  const newFolder = creatingFolder && (
    <NewFolderEntry
      onCreate={createFolder}
      onCancel={() => setCreatingFolder(false)}
    />
  );

  return (
    <>
      <div className="toolbar">
        <PathBar path={path} />
        <div className="toolbar-actions">
          <button className="button" onClick={() => setCreatingFolder(true)}>
            <FolderPlus />
            New folder
          </button>
          <UploadButton uploading={upload.running} onUpload={uploadFiles} />
        </div>
      </div>
      <DropZone onDrop={uploadFiles}>
        <Listing path={path} listing={listing} newFolder={newFolder} />
      </DropZone>
      <Toast notice={notice} onClose={closeNotice} />
    </>
  );
};

export default Browser;
