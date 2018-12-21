import * as React from 'react';
import * as Modal from 'react-bootstrap/lib/Modal';
import ModalBodyPreloader from 'components/ui/new/preloader/modal-body/ModalBodyPreloader';
import { ButtonUpdateMainCarpool } from 'components/directories/geoobjects/pages/carpool/form/buttons/buttons';

import {
  FlexContainer,
  Flex,
} from 'global-styled/global-styled';

import FieldsData from 'components/directories/geoobjects/form/form-components/fields-data/FieldsData';
import MapGeoobjectWrap from 'components/directories/geoobjects/form/form-components/map-geoobject/MapGeoobjectWrap';
import {
  IDataTableSchema,
  ISchemaRenderer,
} from 'components/ui/table/@types/schema.h';
import {
  ICarpoolElement,
} from 'components/directories/geoobjects/pages/carpool/@types/carpool.h';
import { FluxContext, connectToStores } from 'utils/decorators';

type PropsGeoObjectsMapModalNew = {
  onFormHide: () => any;
  meta: IDataTableSchema;
  renderers: ISchemaRenderer;
  entity: string;
  element: ICarpoolElement;
  selectField: string;
};

type StateGeoObjectsMapModalNew = {
};

@connectToStores(['geoObjects', 'session'])
@FluxContext
class GeoObjectsMapModalNew extends React.PureComponent<PropsGeoObjectsMapModalNew, StateGeoObjectsMapModalNew> {
  state = {
    element: this.props.element,
  };

  carpoolIsMain = (id: number) => {
    const { flux } = this.context;
    const payload = {
      id,
      is_main: true,
    };
    flux.getActions('geoObjects').updateCarpool(payload)
      .then(({ result }) => {
        this.setState({element: result.rows[0]});
        flux.getActions('geoObjects').getGeozoneByType('carpool');
      })
      // tslint:disable-next-line:no-console
      .catch((e) => console.error(e));
  }

  render() {
    const {
      entity,
      selectField,
    } = this.props;
    const { element } = this.state;
    const renderers = {
      is_main: ({ data }) => <span> {!!data ? 'Да' : 'Нет'} </span>,
    };

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
                renderers={ renderers }
              />
            </Flex>
            <Flex grow={2} shrink={2} basis={600}>
              <MapGeoobjectWrap
                geoobjectData={element}
                entity={this.props.entity}
              />
            </Flex>
          </FlexContainer>
          <FlexContainer isWrap>
          </FlexContainer>
        </ModalBodyPreloader>
        <Modal.Footer>
            <ButtonUpdateMainCarpool disabled={ element.is_main } onClick={ () => this.carpoolIsMain(element.id) }>
              Сделать основной
            </ButtonUpdateMainCarpool>
          </Modal.Footer>
      </Modal>
    );
  }
}

export default GeoObjectsMapModalNew;
