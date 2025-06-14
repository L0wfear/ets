import * as React from 'react';
import ExtField from 'components/@next/@ui/renderFields/Field';
import { groupBy, get } from 'lodash';
import { DivNone } from 'global-styled/global-styled';
import { FiledToCheck } from 'components/new/pages/inspection/autobase/components/vsible_warning/@types/visibleWarning';
import { IAVisibleWarningInputContainer } from '../../autobase/components/vsible_warning/styled/IAVisibleWarning';
import { isBoolean, isString } from 'util';
import { createValidDate, createValidDateTime } from 'components/@next/@utils/dates/dates';
import { FormErrorType, SchemaType } from 'components/old/ui/form/new/@types/validate.h';
import { SubHeader } from '../../pgm_base/components/vsible_warning/styled/IAVisibleWarning';
import { etsUseDispatch } from 'components/@next/ets_hoc/etsUseDispatch';
import { actionLoadTimeMoscow } from 'redux-main/reducers/modules/some_uniq/time_moscow/actions';
// import { FormErrorType } from 'components/old/ui/form/new/@types/validate.h';

type IAVisibleWarningProps = {
  onChange: (data: any) => any;
  data: any;
  errors?: FormErrorType<SchemaType<any, any>>;
  isPermitted?: boolean;
  filedToCheck: FiledToCheck<any>;
};

const getValueFromEvent = (key, value, filedToCheckByKey) => {
  switch (filedToCheckByKey[key][0].type) {
    case 'boolean': return get(value, 'target.checked', null);
    case 'number': {
      const valNumber = get(value, 'target.value', null);
      if(valNumber || valNumber === 0) {
        return parseFloat(
          isString(valNumber)
            ? valNumber.replace(',', '.')
            : valNumber
        );
      }
    }
    case 'text': return get(value, 'target.value', null) || null;
    case 'string': return value || null;
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
  const dispatch = etsUseDispatch();
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

  React.useEffect(() => {
    (async () => {
      const current_date = await dispatch(
        actionLoadTimeMoscow({}, { page: '' })
      );
      props.onChange({
        dataForValidation: {
          current_date: createValidDate(current_date.date),
        },
      });
    })();
  }, []);

  return (
    <>
      {
        filedToCheck.map((fieldData) => (
          <IAVisibleWarningInputContainer key={fieldData.key.toString()} sub={fieldData.sub}>
            {
              fieldData.sub_header ? (
                <SubHeader>
                  {fieldData.sub_header}
                </SubHeader>
              ) : (
                <DivNone />
              )
            }
            {
              !fieldData.hidden || fieldData.hidden && !data[fieldData.hidden]
                ? (
                  <ExtField
                    id={fieldData.key}
                    type={fieldData.type as any}
                    multi={fieldData.multi}
                    time={fieldData.time}
                    label={fieldData.title}
                    value={get(data, fieldData.key, null)}
                    boundKeys={fieldData.key}
                    onChange={handleChange}
                    className={fieldData.className}
                    options={fieldData.options}
                    disabled={!props.isPermitted}
                    error={get(props.errors, fieldData.key, '')}
                    readOnly={fieldData.readOnly}
                    inline={fieldData.inline}
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
