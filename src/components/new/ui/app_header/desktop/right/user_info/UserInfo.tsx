import * as React from 'react';
import { get } from 'lodash';
import { DefaultFirstDt } from 'components/new/ui/app_header/styled';
import { connect } from 'react-redux';
import { ReduxState } from 'redux-main/@types/state';
import { getSessionState } from 'redux-main/reducers/selectors';
import { UserDataMenu, UserDataContainer, UserHeaderData, UserFio } from 'components/new/ui/app_header/desktop/right/user_info/styled';
import { UserImg } from './styled/index';
import ChangeThemePortal from 'components/new/ui/portals/change_theme/ChangeThemePortal';

const ROLES = {
  master: 'Мастер',
  dispatcher: 'Диспетчер',
  prefect: 'Префект',
  superuser: 'Администратор',
};

class UserInfo extends React.Component<any, {}> {
  state = {
    showThemes: false,
  };

  node = React.createRef<any>();

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

  handleDoubleClick = () => {
    if (__DEVELOPMENT__) {
      this.setState({ showThemes: true });
    }
  }

  handleCloseShowThemes = () => {
    if (__DEVELOPMENT__) {
      this.setState({ showThemes: false });
    }
  }

  componentDidMount() {
    const { current } = this.node;

    if (current && this.props.changeStaticWidth) {
      setImmediate(() => {
        this.props.changeStaticWidth(current.offsetWidth);
      });
    }
  }

  render() {
    const { currentUser } = this.props;
    const userRole = get(currentUser, 'role', '');
    const userFio = get(currentUser, 'fio', '');

    const role = get(ROLES, userRole, '');
    return (
      <React.Fragment>
        <DefaultFirstDt ref={this.node} onDoubleClick={this.handleDoubleClick}>
          <UserDataMenu id="info-user-data">
            <UserImg />
            <UserDataContainer>
              <UserHeaderData>{role}</UserHeaderData>
              <UserFio short={!role}>{userFio}</UserFio>
            </UserDataContainer>
          </UserDataMenu>
        </DefaultFirstDt>
        {
          this.state.showThemes && (
            <ChangeThemePortal onClose={this.handleCloseShowThemes} />
          )
        }
      </React.Fragment>
    );
  }
}

export default connect<any, any, any, ReduxState>(
  (state) => ({
    currentUser: getSessionState(state).userData,
  }),
)(UserInfo);
