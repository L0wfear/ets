import * as React from 'react';
import { connect } from 'react-redux';
import { get } from 'lodash';
import Preloader from 'components/ui/new/preloader/Preloader';

import {
  DivNone,
} from 'global-styled/global-styled';
import { isArray, isUndefined, isNullOrUndefined, isObject } from 'util';
import { ReduxState } from 'redux-main/@types/state';

type TypeConfigToShow = {
  path: string[],
  checkErrorPath?: string[];
  canNull?: boolean;
  type?: 'loader-field' | 'small-loader-field' | 'hidden' | 'none',
  isObj?: boolean;
}

const HiddenComponent: React.SFC<any> = ({ type }) => {
  if (type === 'loader-field') {
    return (
      <div className="center-preloader">
        <Preloader typePreloader="field" />
      </div>
    );
  }
  if (type === 'small-loader-field') {
    return (
      <Preloader typePreloader="field" />
    );
  }
  return <DivNone />
}

type StateProps = {
  show: boolean;
  error: boolean;
}

type OwnerProps = {
  [key: string]: any;
}

type PropsShowByProps = StateProps & OwnerProps;


const withShowByProps = (configToShow: TypeConfigToShow) => Component => (
  connect<StateProps, {}, OwnerProps, ReduxState>(
    state => {
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
    }
  )
  (
    class ShowByProps extends React.Component<PropsShowByProps, {}> {
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
    }
  )
);

export default withShowByProps;
