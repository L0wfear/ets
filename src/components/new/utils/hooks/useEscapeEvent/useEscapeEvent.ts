import * as React from 'react';

const useEscapeEvent = (handler: (...arg: any[]) => void) => {
  React.useEffect(() => {
    const escFunction = (event: KeyboardEvent) => {

      if (event.keyCode === 27) {
        handler();
      }
    };

    document.addEventListener("keydown", escFunction, false);

    return () => {
      document.removeEventListener("keydown", escFunction, false);
    };
  });
};

export default useEscapeEvent;
