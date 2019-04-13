import * as React from 'react';
import { ExtField } from 'components/ui/new/field/ExtField';
import { groupBy, get } from 'lodash';
import { DivNone } from 'global-styled/global-styled';
import { FiledToCheck } from "components/new/pages/inspection/autobase/components/vsible_warning/@types/visibleWarning";
import { InspectContainer } from 'redux-main/reducers/modules/inspect/container/@types/container';
import { IAVisibleWarningInputContainer } from '../../autobase/components/vsible_warning/styled/IAVisibleWarning';
import { isBoolean } from 'util';
import { createValidDate, createValidDateTime } from 'utils/dates';
import { FormErrorType } from 'components/ui/form/new/@types/validate.h';

type IAVisibleWarningProps = {
  onChange: (data: Partial<InspectContainer>) => void;
  data: InspectContainer;
  errors: FormErrorType<InspectContainer>;
  isPermitted?: boolean;
  filedToCheck: FiledToCheck;
};

const getValueFromEvent = (key, value, filedToCheckByKey) => {
  switch (filedToCheckByKey[key][0].type) {
    case 'boolean': return get(value, 'target.checked', null);
    case 'number':
    case 'string': return get(value, 'target.value', null);
    case 'select': return value;
    case 'date': {
      if (value) {
        return isBoolean(filedToCheckByKey[key][0].time) && !filedToCheckByKey[key][0].time ? createValidDate(value) : createValidDateTime(value);
      }

      return value;
    }
  }
};

const IAVisibleWarningContainer: React.FC<IAVisibleWarningProps> = (props) => {
  const { data, filedToCheck } = props;
  const filedToCheckByKey: any = groupBy(filedToCheck, 'key');

  const handleChange = React.useCallback(
    (key, value) => {
      const changeObj = {
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
          <IAVisibleWarningInputContainer key={fieldData.key} sub={fieldData.sub}>
            {
              !fieldData.hidden || fieldData.hidden && !data[fieldData.hidden]
                ? (
                  <ExtField
                    id={fieldData.key}
                    type={fieldData.type}
                    time={fieldData.time}
                    label={fieldData.title}
                    value={get(data, fieldData.key, null)}
                    boundKeys={fieldData.key}
                    onChange={handleChange}
                    className={fieldData.className}
                    options={fieldData.options}
                    disabled={!props.isPermitted}
                    error={props.errors[fieldData.key]}
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

export default React.memo(IAVisibleWarningContainer);
