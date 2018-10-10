import * as React from 'react';
import { connect } from 'react-redux';
import { get } from 'lodash';
import Preloader from 'components/ui/new/preloader/Preloader';

import {
  DivNone,
} from 'global-styled/global-styled';
import { isArray, isUndefined, isNullOrUndefined } from 'util';

type TypeConfigToShow = {
  path: string[],
  checkErrorPath?: string[];
  canNull?: boolean;
  type?: 'loader-field' | 'small-loader-field' | 'hidden' | 'none',
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

const withShowByProps = (configToShow: TypeConfigToShow) => Component => (
  connect(
    state => {
      const { checkErrorPath } = configToShow;
      let show = false;
      const value = get(state, configToShow.path, -1);
      const error = isArray(checkErrorPath) ? get(state, checkErrorPath, false) : false;

      if (configToShow.canNull) {
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
    ({ show, error, ...props }) => (
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
    )
  )
);

export default withShowByProps;
