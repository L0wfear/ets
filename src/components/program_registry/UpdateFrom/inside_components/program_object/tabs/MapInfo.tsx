import * as React from 'react';
import { Col } from 'react-bootstrap';

import MapField from 'components/program_registry/UpdateFrom/inside_components/program_object/inside_fields/FieldMap';

class MapInfo extends React.Component<any, any> {
  render() {
    const {
      polys,
      manual = false,
    } = this.props;

    return (
      <div>
        <Col md={12}>
          <label>Отрисовка границ ремонта</label>
        </Col>
        <Col md={6}>
          <input
            type='radio'
            checked={!manual}
            onChange={this.props.setManualOnFalse}
          />Отрисовать весь объект
        </Col>
        { false &&
          <Col md={4}>
            <input
              type='radio'
              checked={manual}
              onChange={this.props.setManualOnTrue}
            />Отрисовать границы ремонта
          </Col>
        }
        <Col md={12}>
          <MapField
            polys={polys}
            manualDraw={manual}
          />
        </Col>
      </div>
    );
  }
}

export default MapInfo;
