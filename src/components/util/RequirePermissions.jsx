import React, { Component, PropTypes } from 'react';
import { connectToStores, FluxContext } from 'utils/decorators';

const defaultProps = {
  userPermissions: [],
  permissions: [],
  oneOfPermissions: [],
  addPermissionProp: false,
  includesPartOfText: false,
  hidden: false,
  omitPropsKeys: {},
};

const defaultPropsKeys = Object.keys(defaultProps).reduce((newData, key) => ({
  ...newData,
  [key]: true,
}), {});

export default function enhanceWithPermissions(ComposedComponent) {
  return @connectToStores('session') @FluxContext class extends Component {

    static get propTypes() {
      return {
        userPermissions: PropTypes.array.isRequired,
        permissions: PropTypes.array,
        oneOfPermissions: PropTypes.array,
        includesPartOfText: PropTypes.any,
        addPermissionProp: PropTypes.bool,
        hidden: PropTypes.bool,
        omitPropsKeys: PropTypes.any,
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
      const { includesPartOfText = false, userPermissions, permissions, oneOfPermissions } = this.props;
      // В случае, если в на
      if (includesPartOfText) {
        return userPermissions.some(d => includesPartOfText.some(p => d.includes(p)));
      }
      // В случае если достаточно наличия хоть одного доступа
      if (oneOfPermissions.length) {
        return userPermissions.some(up => oneOfPermissions.includes(up));
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
      const propsWithPermittedFlug = { ...this.props, isPermitted };

      const stateKeys = Object.keys(this.context.flux.getStore('session').state).reduce((newData, key) => ({
        ...newData,
        [key]: true,
      }), {});

      return (
        <ComposedComponent
          {
            ...Object.keys(propsWithPermittedFlug).reduce((newProps, key) => {
              if (!defaultPropsKeys[key] && !stateKeys[key] && !this.props.omitPropsKeys[key]) {
                newProps[key] = propsWithPermittedFlug[key];
              }

              return newProps;
            }, {})
          }
        />
      );
    }
  };
}
