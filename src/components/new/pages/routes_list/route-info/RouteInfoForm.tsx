import * as React from 'react';

import ModalBodyPreloader from 'components/old/ui/new/preloader/modal-body/ModalBodyPreloader';

import RouteInfoMap from 'components/new/pages/routes_list/route-info/map/RouteInfoMap';

import { PropsRouteInfoForm } from 'components/new/pages/routes_list/route-info/RouteInfoForm.h';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import RouteGeoList from 'components/new/pages/routes_list/route-info/geo-list/RouteGeoList';

class RouteInfoForm extends React.PureComponent<PropsRouteInfoForm, {}> {
  render() {
    const { props } = this;
    const { route } = props;

    return (
      <EtsBootstrap.ModalContainer bsSize="large" show id="modal-current-duty-mission-route" onHide={props.onHide}>

        <EtsBootstrap.ModalHeader closeButton>
          <EtsBootstrap.ModalTitle>{props.title}</EtsBootstrap.ModalTitle>
        </EtsBootstrap.ModalHeader>

        <ModalBodyPreloader>
          <EtsBootstrap.Row>
            <EtsBootstrap.Col md={8}>
              <RouteInfoMap
                input_lines={route.input_lines}
                object_list={route.object_list}
                type={route.type}
                mapKey={this.props.mapKey}
              />
            </EtsBootstrap.Col>
            <EtsBootstrap.Col md={4}>
              <RouteGeoList
                type={route.type}
                object_list={route.object_list}
                draw_object_list={route.draw_object_list}
              />
            </EtsBootstrap.Col>
          </EtsBootstrap.Row>
        </ModalBodyPreloader>

      </EtsBootstrap.ModalContainer>
    );
  }
}

export default RouteInfoForm;
