import * as React from 'react';
import { get } from 'lodash';

import { ExtField, ExtFieldType } from 'components/old/ui/new/field/ExtField';
import { etsUseSelector, etsUseDispatch } from 'components/@next/ets_hoc/etsUseDispatch';
import { getListData } from 'components/new/ui/registry/module/selectors-registry';
import { registryChangeRenderSelectedRow } from 'components/new/ui/registry/module/actions-registy';
import EtsBootstrap from 'components/new/ui/@bootstrap';

type OwnProps = {
  renderParams: ExtFieldType | any;
  registryKey: string;
  metaKey: string;
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
        return valueEvent; // Переделать
        // return createValidDate(value) : createValidDateTime(value);
      }
      return valueEvent;
    }
    default:
      return null;
  }
};

const ExtFieldTdTitle: React.FC<Props> = React.memo(
  (props) => {
    const { renderParams } = props;
    const value = etsUseSelector((state) => get(getListData(state.registry, props.registryKey), `rendersFields.values.${props.metaKey}`, null));
    const dispatch = etsUseDispatch();

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
      [props.metaKey, props.renderParams],
    );

    return (
      <EtsBootstrap.Grid.GridBootstrapTbody.Td>
        <ExtField
          // id={renderParams.key} `${props.registryKey}.${props.indexRow}.${props.metaKey}`
          type={renderParams.type}
          multi={renderParams.multi}
          time={renderParams.time}
          label={renderParams.title}
          value={value}
          onChange={handleChange}
          className={renderParams.className}
          options={renderParams.options}
          // disabled={!props.isPermitted}
          // error={get(props.errors, renderParams.key, '')}
          readOnly={renderParams.readOnly}
          inline={renderParams.inline}
        />
      </EtsBootstrap.Grid.GridBootstrapTbody.Td>
    );
  },
);

export default ExtFieldTdTitle;
