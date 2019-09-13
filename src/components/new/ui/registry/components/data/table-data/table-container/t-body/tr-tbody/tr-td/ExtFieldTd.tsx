import * as React from 'react';
import { get } from 'lodash';

import { ExtField, ExtFieldType } from 'components/old/ui/new/field/ExtField';
import { etsUseSelector, etsUseDispatch } from 'components/@next/ets_hoc/etsUseDispatch';
import { getListData } from 'components/new/ui/registry/module/selectors-registry';
import { registryChangeRenderSelectedRow } from 'components/new/ui/registry/module/actions-registy';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import { validate } from 'components/old/ui/form/new/validate';
import { getSomeUniqState } from 'redux-main/reducers/selectors';
import { isBoolean } from 'util';
import { createValidDate, createValidDateTime } from 'components/@next/@utils/dates/dates';

type OwnProps = {
  renderParams: ExtFieldType | any;
  registryKey: string;
  metaKey: string;
  indexRow: number;
};
type Props = OwnProps & {};

const getValueFromEvent = (valueEvent, renderParams) => {
  switch (renderParams.type) {
    case 'boolean': return get(valueEvent, 'target.checked', null);
    case 'number':
    case 'text':
    case 'string': return get(valueEvent, 'target.value', null) || null;
    case 'select': return valueEvent;
    case 'date': {
      if (valueEvent) {
        return isBoolean(renderParams.time) && !renderParams.time ? createValidDate(valueEvent) : createValidDateTime(valueEvent);
      }
      return valueEvent;
    }
    default:
      return null;
  }
};

const ExtFieldTd: React.FC<Props> = React.memo(
  (props) => {
    const [error, setError] = React.useState(null);
    const [optionsRenderRow, setOptionsRenderRow] = React.useState(null);
    const { renderParams } = props;
    const valuesRenderRow = etsUseSelector((state) => get(getListData(state.registry, props.registryKey), `rendersFields.values`, null));
    const renderFieldsSchema = etsUseSelector((state) => getListData(state.registry, props.registryKey).meta.renderFieldsSchema);

    const value = get(valuesRenderRow, props.metaKey, null);
    const dispatch = etsUseDispatch();

    React.useEffect(
      () => {
        if (valuesRenderRow) {
          const formErrors = validate(renderFieldsSchema, valuesRenderRow, {...valuesRenderRow, ...props}, valuesRenderRow);
          setError(get(formErrors, props.metaKey, null));
        }
      }, [valuesRenderRow],
    );

    const handleChange = React.useCallback(
      (fieldValue) => {
        dispatch(
          registryChangeRenderSelectedRow(
            props.registryKey,
            {
              key: props.metaKey,
              value: getValueFromEvent(fieldValue, props.renderParams),
            },
          ),
        );
      },
      [props.metaKey, props.renderParams, props.registryKey],
    );

    if (props.registryKey === 'InspectCarsConditionsCarsExtendedRegistry') {
      const inspectionConfig = etsUseSelector((reduxState) => get( getSomeUniqState(reduxState), `inspectionConfig`, null));

      React.useEffect(() => {
        setOptionsRenderRow(inspectionConfig);
      }, [inspectionConfig]);
    }

    return (
      <EtsBootstrap.Grid.GridBootstrapTbody.Td>
        <ExtField
          id={`${props.registryKey}.${props.indexRow}.${props.metaKey}`}
          type={renderParams.type}
          multi={renderParams.multi}
          time={renderParams.time}
          label={renderParams.title}
          value={value}
          onChange={handleChange}
          className={renderParams.className}
          options={get(optionsRenderRow, props.metaKey, [])}
          // disabled={!props.isPermitted}
          error={error}
          readOnly={renderParams.readOnly}
          inline={renderParams.inline}
        />
      </EtsBootstrap.Grid.GridBootstrapTbody.Td>
    );
  },
);

export default ExtFieldTd;
