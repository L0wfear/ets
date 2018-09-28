import * as React from 'react';
import LoadingComponent from 'components/ui/PreloaderMainPage';
import loadable from 'loadable-components';

import { DivNone } from 'global-styled/global-styled';
import withRequirePermissionsNew from 'components/util/RequirePermissionsNewRedux';

import {
  IDataTableSchema,
  ISchemaRenderer,
} from 'components/ui/table/@types/schema.h';

const GeoObjectsMapModal = loadable(
  () => import(/* webpackChunkName: "mission_info_form" */ 'components/directories/geoobjects/form/GeoObjectsMapModalNew'), {
  LoadingComponent,
});

type PropsGeoObjectsMapModalWrap = {
  showForm: boolean;
  onFormHide: () => any;
  meta: IDataTableSchema;
  renderers: ISchemaRenderer;
  entity: string;
  element: object;
  selectField: string;
  [key: string]: any;
};

class GeoObjectsMapModalWrap extends React.PureComponent<PropsGeoObjectsMapModalWrap, {}> {
  render() {
    const {
      showForm,
      ...props
    } = this.props;

    return (
      showForm ?
      (
        <GeoObjectsMapModal
          onFormHide={props.onFormHide}
          meta={props.meta}
          renderers={props.renderers}
          entity={props.entity}
          element={props.element}
          selectField={props.selectField}
        />
      )
      :
      ( <DivNone /> )
    )
  }
}

export default withRequirePermissionsNew({
  byEntity: true,
  type: 'read',
})(GeoObjectsMapModalWrap);
