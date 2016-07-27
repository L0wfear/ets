import React, { Component, PropTypes } from 'react';
import { FluxContext, connectToStores } from 'utils/decorators';

export function enhanceWithPermissions(ComposedComponent) {
  return class extends Component {

    static get propTypes() {
      return {
        userPermissions: PropTypes.array.isRequired,
        permissions: PropTypes.array,
        oneOfPermissions: PropTypes.array
      }
    }

    static get defaultProps() {
      return {
        userPermissions: ['waybill.create', 'waybill.read', 'waybill.delete', 'car.list'],
        permissions: [],
        oneOfPermissions: []
      }
    }

  	constructor() {
  		super();
  	}

    /**
     * Определяет, доступен ли компонент для отображения пользователю в зависимости от требуемых прав
     * @return {boolean} isPermitted - доступен ли компонент для отображения
     */
  	isPermitted() {
      const { userPermissions, permissions, oneOfPermissions } = this.props;
      // В случае если достаточно наличия хоть одного доступа
      if (oneOfPermissions.length) {
        return userPermissions.filter(up => oneOfPermissions.indexOf(up) + 1).length;
      } else {
        // В случае если требуемые права не указаны
        if (permissions.length === 0) {
          return true;
        }
        // TODO переделать, когда появится бек
        return true;
    		return permissions.filter(p => userPermissions.indexOf(p) + 1).length;
      }
  	}

    /**
     * React render
     * проводит проверку на наличие прав у пользователя, в случае отсутствия - не отображает компонент
     * @return {?React.Component}
     */
  	render() {
      const { permissions } = this.props;
  		if (!this.isPermitted()) {
        return null;
      }
  		return <ComposedComponent {...this.props}/>;
  	}
  }
}
