import * as React from 'react';
import { Modal } from 'react-bootstrap';
import ModalBody from 'components/ui/Modal';
import RouteInfo from 'components/route/RouteInfo.jsx';

type PropsRouteInfoForm = {
  show: boolean;
  route: any;
  title: string;
  onHide: any;
}

const RouteInfoForm: React.SFC<PropsRouteInfoForm> = (props) => (
  props.show ?
  (
    <Modal bsSize="large" show id="modal-current-duty-mission-route" onHide={props.onHide} backdrop="static">

      <Modal.Header closeButton>
        <Modal.Title>{props.title}</Modal.Title>
      </Modal.Header>

      <ModalBody>
        <RouteInfo route={props.route} mapOnly />
      </ModalBody>

    </Modal>
  )
  :
  (
    <div className="none"></div>
  )
);

export default RouteInfoForm;
