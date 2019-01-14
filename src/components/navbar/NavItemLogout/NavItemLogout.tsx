import * as React from 'react';
import * as PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

import NavItem from 'components/navbar/NavItem/NavItem';

const data = {
  title: 'Выйти',
  alwaysShow: true,
  path: '/logout',
};

class NavItemLogout extends React.PureComponent<any, any> {
  static get contextTypes() {
    return {
      flux: PropTypes.object,
    };
  }

  onSelect = () => {
    this.context.flux.getActions('session').logout()
      .then(() => this.props.history.push(data.path));
  }
  render() {
    return (
      <NavItem
        id={'link-logout'}
        href={`#${data.path}`}
        data={data}
        onSelect={this.onSelect}
      />
    );
  }
}

export default withRouter(NavItemLogout);
