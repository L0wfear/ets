import * as React from 'react';
import { get } from 'lodash';
import { DefaultFirstDt } from 'components/app_header/styled';
import { connect } from 'react-redux';
import { ReduxState } from 'redux-main/@types/state';
import { getSessionState } from 'redux-main/reducers/selectors/index';
import { UserDataMenu, UserDataContainer, UserHeaderData, UserFio } from 'components/app_header/desktop/right/user_info/styled';
import { UserImg } from './styled/index';

const ROLES = {
  master: 'Мастер',
  dispatcher: 'Диспетчер',
  prefect: 'Префект',
  superuser: 'Администратор',
};

class UserInfo extends React.Component<any, {}> {
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
      <DefaultFirstDt ref={this.node}>
        <UserDataMenu id="info-user-data">
          <UserImg />
          <UserDataContainer>
            <UserHeaderData>{role}</UserHeaderData>
            <UserFio short={!role}>{userFio}</UserFio>
          </UserDataContainer>
        </UserDataMenu>
      </DefaultFirstDt>
    );
  }
}

export default connect<any, any, any, ReduxState>(
  (state) => ({
    currentUser: getSessionState(state).userData,
  }),
)(UserInfo);
