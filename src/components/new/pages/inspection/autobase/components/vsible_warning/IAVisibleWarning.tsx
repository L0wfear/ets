import * as React from 'react';
import { InspectAutobase } from 'redux-main/reducers/modules/inspect/autobase/@types/inspect_autobase';
import { ExtField } from 'components/ui/new/field/ExtField';
import { groupBy, get } from 'lodash';
import { IAVisibleWarningInputContainer } from './styled/IAVisibleWarning';
import { DivNone } from 'global-styled/global-styled';
import { FiledToCheck } from "components/new/pages/inspection/autobase/components/vsible_warning/@types/visibleWarning";
import { InspectContainer } from 'redux-main/reducers/modules/inspect/container/@types/container';
import { isBoolean } from 'util';
import { createValidDate, createValidDateTime } from 'utils/dates';
import { CarsConditionCars } from 'redux-main/reducers/modules/inspect/cars_condition/@types/inspect_cars_condition';

type IAVisibleWarningProps = {
  onChange: (data: InspectAutobase['data'] | InspectContainer['data'] | CarsConditionCars['data']) => void;
  data: InspectAutobase['data'] | InspectContainer['data'] | CarsConditionCars['data'];
  errors?: Partial<Record<keyof InspectAutobase['data'] | keyof InspectContainer['data'] | keyof CarsConditionCars['data'], string>>;
  isPermitted?: boolean;
  filedToCheck: FiledToCheck;
};

const getValueFromEvent = (key, value, filedToCheckByKey) => {
  switch (filedToCheckByKey[key][0].type) {
    case 'boolean': return get(value, 'target.checked', null);
    case 'number':
    case 'text':
    case 'string': return get(value, 'target.value', null) || null;
    case 'select': return value;
    case 'date': {
      if (value) {
        return isBoolean(filedToCheckByKey[key][0].time) && !filedToCheckByKey[key][0].time ? createValidDate(value) : createValidDateTime(value);
      }

      return value;
    }
  }
};

const IAVisibleWarning: React.FC<IAVisibleWarningProps> = (props) => {
  const { data, filedToCheck } = props;
  const filedToCheckByKey: any = groupBy(filedToCheck, 'key');

  const handleChange = React.useCallback(
    (key, value) => {
      const changeObj = {
        ...data,
        [key]: getValueFromEvent(key, value, filedToCheckByKey),
      };
      if (filedToCheckByKey[key][0].reset) {
        filedToCheckByKey[key][0].reset.forEach((keyResetField) => {
          changeObj[keyResetField] = null;
        });
      }
      props.onChange(changeObj);
    },
    [data],
  );

  return (
    <>
      {
        filedToCheck.map((fieldData) => (
          <IAVisibleWarningInputContainer key={fieldData.key.toString()} sub={fieldData.sub}>
            {
              !fieldData.hidden || fieldData.hidden && !data[fieldData.hidden]
                ? (
                  <ExtField
                    id={fieldData.key}
                    type={fieldData.type}
                    label={fieldData.title}
                    value={get(data, fieldData.key, null)}
                    boundKeys={fieldData.key}
                    onChange={handleChange}
                    className={fieldData.className}
                    options={fieldData.options}
                    disabled={!props.isPermitted}
                    error={get(props.errors, fieldData.key, '')}
                    time={fieldData.time}
                  />
                )
                : (
                  <DivNone />
                )
            }
          </IAVisibleWarningInputContainer>
        ))
      }
    </>
  );
};

export default React.memo(IAVisibleWarning);
