import * as React from 'react';
import { connect } from 'react-redux';
import { get } from 'lodash';
import PreloadNew from 'components/old/ui/new/preloader/PreloadNew';

import {
  DivNone,
} from 'global-styled/global-styled';
import { isArray, isUndefined, isNullOrUndefined, isObject } from 'util';
import { ReduxState } from 'redux-main/@types/state';

type TypeConfigToShow = {
  path: string | string[],                                                  // path.to.проверяемое.свойство
  checkErrorPath?: string[];                                                // path.to.error
  canNull?: boolean;                                                        // может ли значение быть нуловом после ответа
  type?: 'loader-field' | 'small-loader-field' | 'hidden' | 'none',         // что отображать вместо (прелоадер/ ничего)
  isObj?: boolean;                                                          // может ли значение быть объектом после ответа
};

const HiddenComponent: React.FC<any> = ({ type }) => {
  if (type === 'loader-field') {
    return (
      <div className="center-preloader">
        <PreloadNew typePreloader="field" />
      </div>
    );
  }
  if (type === 'small-loader-field') {
    return (
      <PreloadNew typePreloader="field" />
    );
  }
  return <DivNone />;
};

type StateProps = {
  show: boolean;
  error: boolean;
};

type OwnerProps = {
  [key: string]: any;
};

type PropsShowByProps = StateProps & OwnerProps;

/**
 *
 * @todo добработать
 * добавить ключ, означабщий загрузку | например Symbol.for('loading')
 */
const withShowByProps = <OwnProps extends any>(configToShow: TypeConfigToShow) => (Component: React.ComponentType<OwnProps> | any) => (
  connect<StateProps, {}, OwnProps, ReduxState>(
    (state) => {
      const { checkErrorPath } = configToShow;
      let show = false;
      const value = get(state, configToShow.path, -1);
      const error = isArray(checkErrorPath) ? get(state, checkErrorPath, false) : false;

      if (configToShow.isObj && isObject(value)) {
        show = !!Object.values(value).length;
      } else if (configToShow.canNull) {
        show = !isUndefined(value) ? value !== -1 : false;
      } else {
        show = !isNullOrUndefined(value) ? value !== -1 : false;
      }

      return {
        show,
        error,
      };
    },
  )
  (
    class ShowByProps extends React.Component<PropsShowByProps & OwnProps, {}> {
      render() {
        const { show, error, ...props } = this.props;

        return (
          error
          ? (
            <span>Ошибка загрузки данных</span>
          )
          : (
            show
            ? (
              <Component {...props} />
            )
            : (
              <HiddenComponent type={configToShow.type} />
            )
          )
        );
      }
    },
  )
);

export default withShowByProps;
