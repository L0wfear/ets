import React, { Component, PropTypes } from 'react';
import { FluxContext, connectToStores } from 'utils/decorators';

/**
 * Компонент, выступающий в роли HoC (Higher order Component) для проверки
 * наличия прав доступа
 * @extends React.Component
 */
export default class RequirePermissions extends Component {

  static get propTypes() {
    return {
      userPermissions: PropTypes.array.isRequired,
      permissions: PropTypes.array
    }
  }

  static get defaultProps() {
    return {
      userPermissions: ['waybill.create', 'waybill.read', 'waybill.delete'],
      permissions: []
    }
  }

	constructor() {
		super();
	}

  /**
   * Определяет, доступен ли компонент для отображения пользователю в зависимости от требуемых прав
   * @param {string[]} requiredPermissions - требуемые права пользователя
   * @return {boolean} isPermitted - доступен ли компонент для отображения
   */
	isPermitted(requiredPermissions) {
    const { userPermissions } = this.props;
    // TODO переделать, когда появится бек
    return true;
		return requiredPermissions.filter(p => this.props.userPermissions.indexOf(p) + 1).length;
	}

  /**
   * React render
   * проводит проверку на наличие прав у пользователя, в случае отсутствия - не отображает компонент
   * @return {?React.Component}
   */
	render() {
    const { permissions } = this.props;
		if (!this.isPermitted(permissions)) {
      return null;
    }
		return this.props.children;
	}

}
