import * as React from 'react';
import { get } from 'lodash';
import { isArray, isUndefined, isNullOrUndefined, isObject } from 'util';

import PreloadNew, { Props } from 'components/old/ui/new/preloader/PreloadNew';
import { etsUseSelector } from 'components/@next/ets_hoc/etsUseDispatch';

type TypeConfigToShow = {
  path: string | Array<string>;                                                  // path.to.проверяемое.свойство
  checkErrorPath?: Array<string>;                                                // path.to.error
  canNull?: boolean;                                                        // может ли значение быть нуловом после ответа
  type?: Props['typePreloader'] | 'none';                                   // что отображать вместо (прелоадер/ ничего)
  isObj?: boolean;                                                          // может ли значение быть объектом после ответа
};

const withShowByProps = <OwnProps extends any>(configToShow: TypeConfigToShow) => (Component: React.ComponentType<OwnProps>) => {
  const showByProps: React.FC<OwnProps> = React.memo(
    (props) => {
      const { checkErrorPath } = configToShow;
      let show = false;
      const value = etsUseSelector((state) => get(state, configToShow.path, -1));
      const error = etsUseSelector((state) => isArray(checkErrorPath) ? get(state, checkErrorPath, false) : false);

      if (configToShow.isObj && isObject(value)) {
        show = !!Object.values(value).length;
      } else if (configToShow.canNull) {
        show = !isUndefined(value) ? value !== -1 : false;
      } else {
        show = !isNullOrUndefined(value) ? value !== -1 : false;
      }

      if (error) {
        return (
          <span>Ошибка загрузки данных</span>
        );
      }

      return (
        show
          ? <Component {...props} />
          : configToShow.type !== 'none' && <PreloadNew typePreloader={configToShow.type} />
      );
    },
  );

  return showByProps;
};

export default withShowByProps;
