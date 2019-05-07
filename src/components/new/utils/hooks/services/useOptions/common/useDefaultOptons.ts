import * as React from 'react';
import { defaultSelectListMapper } from 'components/ui/input/ReactSelect/utils';

const useDefaultOptons = <T extends { id: number, name: string, [k: string]: any }>(list: Array<T>) => {
  const options = React.useMemo(
    () => {
      return list.map(defaultSelectListMapper);
    },
    [list],
  );

  return options;
};

export default useDefaultOptons;
