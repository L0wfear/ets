import * as React from 'react';
import * as PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

import {
  DefaultFirstDt,
  LinkFirstLvl,
  DefaultFirstLvlMenu,
} from 'components/new/ui/app_header/styled';

class EtsLogout extends React.Component<any, {}> {
  node = React.createRef<any>();
  static get contextTypes() {
    return {
      flux: PropTypes.object,
    };
  }

  getSnapshotBeforeUpdate(prevProps) {
    if (prevProps.width < this.props.width) {
      const { current } = this.node;
      if (current) {
        return current.offsetWidth;
      }
    }
    return null;
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (snapshot !== null) {
      const { current } = this.node;
      if (current && this.props.changeStaticWidth) {
        this.props.changeStaticWidth(current.offsetWidth - snapshot);
      }
    }
  }

  componentDidMount() {
    const { current } = this.node;

    if (current && this.props.changeStaticWidth) {
      this.props.changeStaticWidth(current.offsetWidth);
    }
  }

  handleClick: React.MouseEventHandler<HTMLAnchorElement> = async (e) => {
    e.preventDefault();

    await this.context.flux.getActions('session').logout();
    this.props.history.push('/login');
  }

  render() {
    return (
      <DefaultFirstDt ref={this.node}>
        <LinkFirstLvl id={`link-logout`} to="" onClick={this.handleClick}>
          <DefaultFirstLvlMenu>
            <span>Выйти</span>
          </DefaultFirstLvlMenu>
        </LinkFirstLvl>
      </DefaultFirstDt>
    );
  }
}

export default withRouter(EtsLogout);
