import * as React from 'react';
import { connect } from 'react-redux';
import { get } from 'lodash';
import Preloader from 'components/ui/new/preloader/Preloader';

import {
  DivNone,
} from 'global-styled/global-styled';

type TypeConfigToShow = {
  path: string[],
  type?: 'loader-field' | 'hidden' | 'none',
}

const HiddenComponent: React.SFC<any> = ({ type }) => {
  if (type === 'loader-field') {
    return (
      <div className="center-preloader">
        <Preloader typePreloader="field" />
      </div>
    );
  }
  return <DivNone />
}

const withShowByProps = (configToShow: TypeConfigToShow) => Component => (
  connect(
    state => {
      const value = get(state, configToShow.path, -1);

      return { show: !!value ? value !== -1 : false };
    }
  )
  (
    ({ show, ...props }) => (
      show ?
        <Component {...props} />
      :
        <HiddenComponent type={configToShow.type} />
    )
  )
);

export default withShowByProps;
