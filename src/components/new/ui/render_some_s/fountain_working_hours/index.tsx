import * as React from 'react';
import { FountainsWorkingHour } from 'redux-main/reducers/modules/geoobject/actions_by_type/fountains/@types';

const FountainWorkingHours = React.memo(
  ({ data }: { data: Array<FountainsWorkingHour>; }) => (
    <div>
      {
        data.map((item, index) => (
          <div key={index}>
            <span>{`${item.DayOfWeek}: ${item.Hours}`}</span>
          </div>
        ))
      }
    </div>
  ),
);

export default FountainWorkingHours;
