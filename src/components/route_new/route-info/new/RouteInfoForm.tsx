import * as React from 'react';
import * as Modal from 'react-bootstrap/lib/Modal';
import ModalBodyPreloader from 'components/ui/new/preloader/modal-body/ModalBodyPreloader';

import RouteInfoMap from 'components/route_new/route-info/map/RouteInfoMap';

import { PropsRouteInfoForm } from 'components/route_new/route-info/new/RouteInfoForm.h';

class RouteInfoForm extends React.PureComponent<PropsRouteInfoForm, {}> {
  render() {
    const { props } = this;
    const { route } = props;

    return (
      <Modal bsSize="large" show id="modal-current-duty-mission-route" onHide={props.onHide} backdrop="static">

        <Modal.Header closeButton>
          <Modal.Title>{props.title}</Modal.Title>
        </Modal.Header>

        <ModalBodyPreloader>
          <RouteInfoMap
            input_lines={route.input_lines}
            object_list={route.object_list}
            type={route.type}
            mapKey={this.props.mapKey}
          />
        </ModalBodyPreloader>

      </Modal>
    );
  }
}

export default RouteInfoForm;
