import * as React from 'react';
import { InspectPgmBase } from 'redux-main/reducers/modules/inspect/pgm_base/@types/inspect_pgm_base';
import { ExtField } from 'components/ui/new/field/ExtField';
import { groupBy, get } from 'lodash';
import { IAVisibleWarningInputContainer } from './styled/IAVisibleWarning';
import { DivNone } from 'global-styled/global-styled';
import { FiledToCheck } from "components/new/pages/inspection/pgm_base/components/vsible_warning/@types/visibleWarning";

type IAVisibleWarningProps = {
  onChange: (data: InspectPgmBase['data']) => void;
  data: InspectPgmBase['data'];
  errors: Partial<Record<keyof InspectPgmBase['data'], string>>;
  isPermitted?: boolean;
  filedToCheck: FiledToCheck;
};

const getValueFromEvent = (key, value, filedToCheckByKey) => {
  switch (filedToCheckByKey[key][0].type) {
    case 'boolean': return get(value, 'target.checked', null);
    case 'number':
    case 'string': return get(value, 'target.value', null);
    case 'select': return value;
    case 'date': return value;
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
          <IAVisibleWarningInputContainer key={fieldData.key} sub={fieldData.sub}>
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

export default React.memo(IAVisibleWarning);
