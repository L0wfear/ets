import * as React from 'react';
import LoadingComponent from 'components/ui/PreloaderMainPage';
import loadable from 'loadable-components';

import { DivNone } from 'global-styled/global-styled';

const GeoObjectsMapModal = loadable(
  () => import(/* webpackChunkName: "mission_info_form" */ 'components/directories/geoobjects/form/GeoObjectsMapModalNew'), {
  LoadingComponent,
});

type PropsGeoObjectsMapModalWrap = {
  showForm: boolean;
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
          {...props}
        />
      )
      :
      ( <DivNone /> )
    )
  }
}

export default GeoObjectsMapModalWrap;
