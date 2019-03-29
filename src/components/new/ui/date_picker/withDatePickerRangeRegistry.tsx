import * as React from 'react';
import { Col } from 'react-bootstrap';
import DatePickerRange from './DatePickerRange';
import { WithDatePickerRangeRegistry } from './styled';

type WithDatePickerRangeRegistryConfig = {
  init_date_from: any;
  init_date_to: any;
};

export const withDatePickerRangeRegistry = (config: WithDatePickerRangeRegistryConfig) => (Component) => {
  const withDatePickerRange: React.FC<any> = (props) => {
    const [date_from, setDateFrom] = React.useState(config.init_date_from);
    const [date_to, setDateTo] = React.useState(config.init_date_to);

    const handleChangeDate = React.useCallback(
      (key, value) => {
        if (key === 'date_from') {
          setDateFrom(value);
        }
        if (key === 'date_to') {
          setDateTo(value);
        }
      },
      [],
    );

    return (
      <>
        <WithDatePickerRangeRegistry>
          <Col md={6} mdOffset={3} sm={6} smOffset={3}>
            <DatePickerRange
              date_start_id="date_from"
              date_start_value={date_from}
              date_end_id="date_to"
              date_end_value={date_to}

              onChange={handleChangeDate}
            />
          </Col>
        </WithDatePickerRangeRegistry>
        <Component
          {...props}
          date_from={date_from}
          date_to={date_to}
        />
      </>
    );
  };

  return withDatePickerRange;
};

export default withDatePickerRangeRegistry;
