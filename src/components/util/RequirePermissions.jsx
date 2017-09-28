import React, { Component, PropTypes } from 'react';
import { connectToStores } from 'utils/decorators';

export default function enhanceWithPermissions(ComposedComponent) {
  return @connectToStores('session') class extends Component {

    static get propTypes() {
      return {
        userPermissions: PropTypes.array.isRequired,
        permissions: PropTypes.array,
        oneOfPermissions: PropTypes.array,
        includesPartOfText: PropTypes.array,
        addPermissionProp: PropTypes.bool,
        hidden: PropTypes.bool,
      };
    }

    static get defaultProps() {
      return {
        userPermissions: [],
        permissions: [],
        oneOfPermissions: [],
        addPermissionProp: false,
        includesPartOfText: false,
        hidden: false,
      };
    }

    /**
     * Определяет, доступен ли компонент для отображения пользователю в зависимости от требуемых прав
     * @return {boolean} isPermitted - доступен ли компонент для отображения
     */
    isPermitted() {
      const { includesPartOfText = false, userPermissions, permissions, oneOfPermissions } = this.props;
      // В случае, если в на
      if (includesPartOfText) {
        return userPermissions.some(d => includesPartOfText.some(p => d.includes(p)));
      }
      // В случае если достаточно наличия хоть одного доступа
      if (oneOfPermissions.length) {
        return userPermissions.filter(up => oneOfPermissions.indexOf(up) + 1).length;
      }

      // В случае если требуемые права не указаны
      if (permissions.length === 0) {
        return true;
      }

      return !!permissions.filter(p => userPermissions.indexOf(p) + 1).length;
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
      return <ComposedComponent isPermitted={isPermitted} {...this.props} />;
    }
  };
}
