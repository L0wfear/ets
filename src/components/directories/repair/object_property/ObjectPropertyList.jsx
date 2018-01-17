import React, { Component } from 'react';
import { Button, ButtonGroup } from 'react-bootstrap';

import { connectToStores, staticProps, exportable } from 'utils/decorators';
import REPAIR from 'constants/repair';
import ElementsList from 'components/ElementsList.jsx';
import ObjectPropertyTable from './ObjectPropertyTable.tsx';

@connectToStores(['repair', 'session'])
@exportable({ entity: `${REPAIR.objectProperty}` })
@staticProps({
  entity: 'ets_object_properties',
  listName: 'objectPropertyList',
  tableComponent: ObjectPropertyTable,
  operations: ['LIST'],
})
class ObjectPropertyList extends ElementsList {
  constructor(props) {
    super(props);

    this.setExportType(props.typeData);
  }

  setExportType(object_type) {
    this.exportPayload = { object_type };
  }

  async componentDidMount() {
    super.componentDidMount();
    const { flux } = this.context;

    await flux.getActions('repair').getObjectProperty({ object_type: 'odh' }, { name: 'odh' });
    flux.getActions('repair').setActiveList('objectPropertyList', 'objectPropertyOdhList');
  }

  getAdditionalProps() {
    return {
      typeData: this.props.typeData,
    };
  }
  async inheritedComponentWillReceiveProps(props) {
    const { typeData } = props;
    const { iHaveType = { 'odh': true } } = this.state;

    if (typeData !== this.props.typeData) {
      const { flux } = this.context;
      this.setExportType(typeData);

      if (!iHaveType[typeData]) {
        iHaveType[typeData] = true;

        await flux.getActions('repair').getObjectProperty({ object_type: typeData }, { name: typeData });

        this.setState({ iHaveType });
      }
      flux.getActions('repair').setActiveList('objectPropertyList', `objectProperty${typeData[0].toUpperCase()}${typeData.slice(1)}List`);
    }
  }
}

export default class ObjectProperty extends Component {
  state = {
    typeData: 'odh',
  }
  setNewType = ({ target: { id } }) => {
    let { typeData } = this.state;

    if (typeData !== id) {
      typeData = id;
      this.setState({
        typeData,
      });
    }
  }
  render() {
    const {
      typeData,
    } = this.state;

    return (
      <div>
        <div className="cleaning-rate-header">
          <ButtonGroup>
            <Button id="odh" active={typeData === 'odh'} onClick={this.setNewType}>ОДХ</Button>
            <Button id="dt" active={typeData === 'dt'} onClick={this.setNewType}>ДТ</Button>
          </ButtonGroup>
        </div>
        <ObjectPropertyList typeData={typeData} />
      </div>
    );
  }
}
