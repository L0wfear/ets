import * as React from 'react';

import ModalBodyPreloader from 'components/ui/new/preloader/modal-body/ModalBodyPreloader';

import RouteInfoMap from 'components/new/pages/routes_list/route-info/map/RouteInfoMap';

import { PropsRouteInfoForm } from 'components/new/pages/routes_list/route-info/RouteInfoForm.h';
import EtsBootstrap from 'components/new/ui/@bootstrap';

class RouteInfoForm extends React.PureComponent<PropsRouteInfoForm, {}> {
  render() {
    const { props } = this;
    const { route } = props;

    return (
      <EtsBootstrap.ModalContainer bsSize="large" show id="modal-current-duty-mission-route" onHide={props.onHide} backdrop="static">

        <EtsBootstrap.ModalHeader closeButton>
          <EtsBootstrap.ModalTitle>{props.title}</EtsBootstrap.ModalTitle>
        </EtsBootstrap.ModalHeader>

        <ModalBodyPreloader>
          <RouteInfoMap
            input_lines={route.input_lines}
            object_list={route.object_list}
            type={route.type}
            mapKey={this.props.mapKey}
          />
        </ModalBodyPreloader>

      </EtsBootstrap.ModalContainer>
    );
  }
}

export default RouteInfoForm;
