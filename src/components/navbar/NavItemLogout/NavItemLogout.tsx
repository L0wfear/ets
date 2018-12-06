import * as React from 'react';
import * as PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import WithContext from 'components/compositions/vokinda-hoc/with-contetx/WithContext';
import WithClassMethod from 'components/compositions/vokinda-hoc/with-class-method/WithClassMethod';
import hocAll from 'components/compositions/vokinda-hoc/recompose';

import NavItem from 'components/navbar/NavItem/NavItem';

const data = {
  title: 'Выйти',
  alwaysShow: true,
  path: '/logout',
};

const NavItemLogout: React.FunctionComponent<any> = (props) => (
  <NavItem
    id={'link-logout'}
    href={`#${data.path}`}
    data={data}
    onSelect={props.onSelect}
  />
);

const onSelect = (props) => () =>
  props.flux.getActions('session').logout()
    .then(() => props.history.push(data.path));

export default withRouter(
  hocAll(
    WithContext({
      flux: PropTypes.object,
    }),
    WithClassMethod({
      onSelect,
    }),
  )(NavItemLogout));
