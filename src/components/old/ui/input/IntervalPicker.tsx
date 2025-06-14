import * as React from 'react';
import DatePicker from 'components/old/ui/input/date-picker/DatePicker';
import EtsBootstrap from 'components/new/ui/@bootstrap';

type Props = {
  interval?: boolean;
  defDate?: boolean;
  time?: boolean;

  onChange: (arg: any) => any;
};

export default class IntervalPicker extends React.Component<Props, any> {
  getInterval() {
    return this.props.interval || this.props.defDate || [null, null];
  }

  handleChange(index, data) {
    const interval = this.getInterval();

    interval[index] = data;

    this.props.onChange(interval);
  }

  render() {
    const interval = this.getInterval();

    return (
      <div className="interval-picker">
        <EtsBootstrap.Row style={{ margin: '0 0 5px 0' }}>
          <EtsBootstrap.Col
            md={1}
            style={{ padding: '6px 6px 0 0', fontWeight: 'bold' }}>
            с
          </EtsBootstrap.Col>
          <EtsBootstrap.Col md={11} style={{ padding: 0 }}>
            <DatePicker
              time={this.props.time}
              date={interval[0]}
              onChange={this.handleChange.bind(this, 0)}
            />
          </EtsBootstrap.Col>
        </EtsBootstrap.Row>
        <EtsBootstrap.Row style={{ margin: 0 }}>
          <EtsBootstrap.Col
            md={1}
            style={{ padding: '6px 6px 0 0', fontWeight: 'bold' }}>
            по
          </EtsBootstrap.Col>
          <EtsBootstrap.Col md={11} style={{ padding: 0 }}>
            <DatePicker
              time={this.props.time}
              date={interval[1]}
              onChange={this.handleChange.bind(this, 1)}
            />
          </EtsBootstrap.Col>
        </EtsBootstrap.Row>
      </div>
    );
  }
}
