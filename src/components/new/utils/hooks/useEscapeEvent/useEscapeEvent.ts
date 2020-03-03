import * as React from 'react';

const useEscapeEvent = (handler: (...arg: Array<any>) => void) => {
  const [saveEvent, setSaveEvent] = React.useState(null);

  React.useEffect(
    () => {
      setSaveEvent(
        (oldSaveEvent) => {
          if (oldSaveEvent) {
            document.removeEventListener('keydown', oldSaveEvent, false);
          }
          const escFunction = (event: KeyboardEvent) => {

            if (event.keyCode === 27) {
              handler();
            }
          };

          document.addEventListener('keydown', escFunction, false);

          return escFunction;
        },
      );
    },
    [handler],
  );

  React.useEffect(
    () => {
      return () => {
        document.removeEventListener('keydown', saveEvent, false);
      };
    },
    [saveEvent],
  );
};

export default useEscapeEvent;
