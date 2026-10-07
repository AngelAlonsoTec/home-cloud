import { useRef, useState } from 'react';
import { CloudArrowUpFill } from 'react-bootstrap-icons';

const isDraggingFiles = (e) => e.dataTransfer.types.includes('Files');

/** Uploads the files dropped anywhere over its content. */
const DropZone = ({ onDrop, children }) => {
  const [dragging, setDragging] = useState(false);
  // Drag events also fire when moving over children, so they are counted to
  // know when the pointer really leaves the zone
  const depth = useRef(0);

  const onDragEnter = (e) => {
    if (!isDraggingFiles(e)) {
      return;
    }
    depth.current += 1;
    setDragging(true);
  };

  const onDragLeave = () => {
    depth.current = Math.max(0, depth.current - 1);
    if (depth.current === 0) {
      setDragging(false);
    }
  };

  // Prevents the browser from opening the dropped files
  const onDragOver = (e) => e.preventDefault();

  const onDropFiles = (e) => {
    e.preventDefault();
    depth.current = 0;
    setDragging(false);
    if (e.dataTransfer.files.length) {
      onDrop(e.dataTransfer.files);
    }
  };

  return (
    <div
      className="listing"
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDragOver={onDragOver}
      onDrop={onDropFiles}
    >
      {children}
      {dragging && (
        <div className="drop-overlay">
          <CloudArrowUpFill size={36} />
          Drop files to upload them here
        </div>
      )}
    </div>
  );
};

export default DropZone;
