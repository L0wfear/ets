import * as React from 'react';
import * as PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getSessionState } from 'redux-main/reducers/selectors';

const defaultProps = {
  userPermissions: [],
  permissions: [],
  addPermissionProp: false,
  hidden: false,
};

const enhanceWithPermissions = (ComposedComponent) =>
  connect((state) => ({
    userPermissionsSet: getSessionState(state).userData.permissionsSet,
  }))(
    class RequirePermissions extends React.Component {
      static get propTypes() {
        return {
          userPermissionsSet: PropTypes.object,
          userPermissions: PropTypes.array.isRequired,
          permissions: PropTypes.array,
          addPermissionProp: PropTypes.bool,
          hidden: PropTypes.bool,
        };
      }

      static get defaultProps() {
        return { ...defaultProps };
      }

      /**
       * Определяет, доступен ли компонент для отображения пользователю в зависимости от требуемых прав
       * @return {boolean} isPermitted - доступен ли компонент для отображения
       */
      isPermitted() {
        const { userPermissionsSet, permissions } = this.props;

        if (permissions.length === 0) {
          return true;
        }

        return !!permissions.filter((p) => userPermissionsSet.has(p)).length;
      }

      /**
       * React render
       * проводит проверку на наличие прав у пользователя, в случае отсутствия - не отображает компонент
       * @return {?React.Component}
       */
      render() {
        if (this.props.hidden) return null;
        const isPermitted = this.isPermitted();

        if (!isPermitted && !this.props.addPermissionProp) {
          return null;
        }

        return <ComposedComponent {...this.props} isPermitted={isPermitted} />;
      }
    },
  );

export default enhanceWithPermissions;
