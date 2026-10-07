import { useRef } from 'react';
import { CloudArrowUpFill } from 'react-bootstrap-icons';
import Loading from './Loading.jsx';

/** Opens the file picker and uploads the selected files straight away. */
const UploadButton = ({ uploading, onUpload }) => {
  const input = useRef(null);

  const onChange = (e) => {
    onUpload(e.target.files);
    // Allows selecting the same file again
    e.target.value = '';
  };

  return (
    <>
      <input
        ref={input}
        type="file"
        multiple
        hidden
        onChange={onChange}
      />
      <button
        className="button button-primary"
        onClick={() => input.current.click()}
        disabled={uploading}
      >
        {uploading ? (
          <Loading text="Uploading" small />
        ) : (
          <CloudArrowUpFill />
        )}
        {uploading ? 'Uploading...' : 'Upload'}
      </button>
    </>
  );
};

export default UploadButton;
