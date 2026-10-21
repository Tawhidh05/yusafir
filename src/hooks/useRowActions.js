import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { getErrorInfo } from '../api/client';

/** Runs a table action, shows a success/error notice, and refreshes the listed queries. */
export default function useRowActions(queryKeys) {
  const queryClient = useQueryClient();
  const [notice, setNotice] = useState(null);
  const [busy, setBusy] = useState(false);

  const run = async (action, successText) => {
    setBusy(true);
    try {
      await action();
      setNotice({ type: 'success', text: successText });
      queryKeys.forEach((key) => queryClient.invalidateQueries({ queryKey: [key] }));
      return true;
    } catch (error) {
      setNotice({ type: 'error', text: getErrorInfo(error).message });
      return false;
    } finally {
      setBusy(false);
    }
  };

  return { notice, setNotice, run, busy };
}
