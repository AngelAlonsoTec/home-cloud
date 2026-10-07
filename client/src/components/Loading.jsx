const Loading = ({ text, small = false }) => (
  <div className={small ? 'spinner spinner-small' : 'spinner'} role="status">
    <span className="visually-hidden">{text}</span>
  </div>
);

export default Loading;
