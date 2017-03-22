import Raven from 'raven-js';

export function checkInternalErrors(r) {
  const { warnings = [] } = r;
  warnings.forEach((w) => {
    if (w.internal) {
      Raven.captureException(new Error(w.message));
    }
  });
}
