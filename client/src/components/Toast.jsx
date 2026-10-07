import { useEffect } from 'react';
import { XLg } from 'react-bootstrap-icons';

const AUTO_CLOSE_MS = 4000;

/** Shows the { success, message } result of an API call. */
const Toast = ({ notice, onClose }) => {
  // Successful notices go away by themselves, errors stay until closed
  useEffect(() => {
    if (notice?.success) {
      const timer = setTimeout(onClose, AUTO_CLOSE_MS);
      return () => clearTimeout(timer);
    }
  }, [notice, onClose]);

  if (!notice) {
    return null;
  }

  return (
    <div
      className={notice.success ? 'toast' : 'toast toast-error'}
      role={notice.success ? 'status' : 'alert'}
    >
      <span>{notice.message}</span>
      <button className="icon-button" onClick={onClose} aria-label="Close">
        <XLg />
      </button>
    </div>
  );
};

export default Toast;
