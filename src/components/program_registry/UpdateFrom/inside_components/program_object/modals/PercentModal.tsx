import * as React from 'react';

import { FluxContext } from 'utils/decorators';


const TableMeta: any = [
  {
    key: 'reviewed_at',
    title: 'Дата осмотра',
    style: (value) => ({
      minWidth: 200,
    }),
  },
  {
    key: 'percent',
    title: 'Процент выполнения',
  },
  {
    key: 'measure_unit_name',
    title: 'Ед. измерения',
  },
  {
    key: 'plan',
    title: 'План',
  },
  {
    key: 'fact',
    title: 'Факт',
    style: {
      maxWidth: 100,
    },
  },
  {
    key: 'warranty_up_to',
    title: 'Гарантийные обязательства до',
  },
];

console.log(TableMeta);

@FluxContext
class PercentModal extends React.Component<any, any> {
  state = {
    objData: {},
  };
  componentDidMount() {
    const {
      id,
    } = this.props;
    this.context.flux.getActions('repair').getDataAboutObjectById(id).then(objData => this.setState({ objData }));
    this.context.flux.getActions('repair').postDataToUpdateObject({ id }).then(objData => this.setState({ objData }));
  }

  render() {
    console.log(this.state);
    return <div></div>;
  }
}

export default PercentModal;
