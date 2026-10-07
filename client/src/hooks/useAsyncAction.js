import { useState } from 'react';

/**
 * Runs an API action keeping track of whether it is running and of its
 * result ({ success, message }), which is meant to be shown in a ResultAlert.
 */
const useAsyncAction = (action) => {
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState(null);

  const run = async (...args) => {
    setRunning(true);
    setResult(null);
    const actionResult = await action(...args);
    setResult(actionResult);
    setRunning(false);

    return actionResult;
  };

  return { running, result, run, clearResult: () => setResult(null) };
};

export default useAsyncAction;
