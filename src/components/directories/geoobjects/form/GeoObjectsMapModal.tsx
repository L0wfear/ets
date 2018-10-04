import * as React from 'react';
import { Modal } from 'react-bootstrap';
import ModalBodyPreloader from 'components/ui/new/preloader/modal-body/ModalBodyPreloader';

import {
  FlexWrapContainer,
  Flex,
} from 'global-styled/global-styled';

import FieldsData from 'components/directories/geoobjects/form/form-components/fields-data/FieldsData';
import MapGeoobjectWrap from 'components/directories/geoobjects/form/form-components/map-geoobject/MapGeoobjectWrap';

import {
  IDataTableSchema,
  ISchemaRenderer,
} from 'components/ui/table/@types/schema.h';

type PropsGeoObjectsMapModalNew = {
  onFormHide: () => any;
  meta: IDataTableSchema;
  renderers: ISchemaRenderer;
  entity: string;
  element: object;
  selectField: string;
};

type StateGeoObjectsMapModalNew = {
};

class GeoObjectsMapModalNew extends React.PureComponent<PropsGeoObjectsMapModalNew, StateGeoObjectsMapModalNew> {
  render() {
    const {
      element,
      entity,
      selectField,
    } = this.props;

    return (
      <Modal id="modal-geoobjects-map" show onHide={this.props.onFormHide} bsSize="large" backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>Просмотр объекта</Modal.Title>
        </Modal.Header>
        <ModalBodyPreloader page={entity} path={`${entity}/${element[selectField]}`} typePreloader="lazy">
          <FlexWrapContainer>
            <Flex grow={1} shrink={1} basis={200}>
              <FieldsData
                element={element}
                meta={this.props.meta}
                renderers={this.props.renderers}
              />
            </Flex>
            <Flex grow={2} shrink={2} basis={600}>
              <MapGeoobjectWrap
                geoobjectData={element}
                entity={this.props.entity}
              />
            </Flex>
          </FlexWrapContainer>
        </ModalBodyPreloader>
      </Modal>
    )
  }
}

export default GeoObjectsMapModalNew;
