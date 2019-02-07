import * as React from 'react';
import * as Modal from 'react-bootstrap/lib/Modal';
import ModalBodyPreloader from 'components/ui/new/preloader/modal-body/ModalBodyPreloader';

import {
  FlexContainer,
  Flex,
} from 'global-styled/global-styled';

import FieldsData from 'components/new/pages/nsi/geoobjects/ui/form/form-components/fields-data/FieldsData';
import MapGeoobjectWrap from 'components/new/pages/nsi/geoobjects/ui/form/form-components/map-geoobject/MapGeoobjectWrap';

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
          <FlexContainer isWrap>
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
          </FlexContainer>
        </ModalBodyPreloader>
      </Modal>
    );
  }
}

export default GeoObjectsMapModalNew;
