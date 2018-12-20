import * as React from 'react';
import LoadingComponent from 'components/ui/PreloaderMainPage';
import ErrorBoundaryForm from 'components/error_boundary_registry/ErrorBoundaryForm';

import { DivNone } from 'global-styled/global-styled';
import withRequirePermissionsNew from 'components/util/RequirePermissionsNewRedux';

import {
  IDataTableSchema,
  ISchemaRenderer,
} from 'components/ui/table/@types/schema.h';

const GeoObjectsMapModal = React.lazy(() => (
  import(/* webpackChunkName: "geo-objects_map_modal" */ 'components/directories/geoobjects/form/GeoObjectsMapModal')
));

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
        <ErrorBoundaryForm>
          <React.Suspense fallback={<LoadingComponent />}>
            <GeoObjectsMapModal
              onFormHide={props.onFormHide}
              meta={props.meta}
              renderers={props.renderers}
              entity={props.entity}
              element={props.element}
              selectField={props.selectField}
            />
          </React.Suspense>
        </ErrorBoundaryForm>
      )
      :
      ( <DivNone /> )
    );
  }
}

export default withRequirePermissionsNew({
  byEntity: true,
  type: 'read',
})(GeoObjectsMapModalWrap);
