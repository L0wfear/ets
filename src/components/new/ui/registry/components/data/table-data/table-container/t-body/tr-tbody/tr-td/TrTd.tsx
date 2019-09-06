import * as React from 'react';
import { EtsTbodyTrTd, EtsTbodyScrollContainer, EtsTbodyTextContainer, EtsTdInnerWrapper } from 'components/new/ui/registry/components/data/table-data/table-container/t-body/tr-tbody/tr-td/styled/styled';
import { isString } from 'util';
import { ExtFieldType, ExtField } from 'components/old/ui/new/field/ExtField';
import { get } from 'lodash';
import { etsUseDispatch } from 'components/@next/ets_hoc/etsUseDispatch';
import { registryChangeRenderSelectedRow } from 'components/new/ui/registry/module/actions-registy';
import { StatePropsTrTbody } from 'components/new/ui/registry/components/data/table-data/table-container/t-body/tr-tbody/TrTbody.h';

export type PropsTrTd = {
  registryKey: string;
  rowData: any;
  metaKey: string;
  value: any;
  selected: boolean;
  renderParams?: ExtFieldType;
  rendersFields?: StatePropsTrTbody['rendersFields'];
  style?: any; // not use
};

const TrTd: React.FC<PropsTrTd> = React.memo(
  (props) => {
    const [showAll, setShowAll] = React.useState(false);
    const dispatch = etsUseDispatch();
    const {
      selected,
      rendersFields,
    } = props;

    const getValueFromEvent = React.useCallback((valueEvent) => {
      switch (get(props, 'renderParams.type', null)) {
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
    }, [props.renderParams]);

    const handleChange = React.useCallback((key, fieldValue) => {
      dispatch(registryChangeRenderSelectedRow(props.registryKey, {key, value: getValueFromEvent(fieldValue)}));
    }, [rendersFields, selected]);

    const value = React.useMemo(
      () => {
        let valueRaw = props.value;
        if ( props.renderParams ) {
          const renderParamsData =  get(props, 'renderParams', null);
          if ( renderParamsData && selected && !renderParamsData.hidden || renderParamsData.hidden ) {
            return (
              <ExtField
                id={renderParamsData.key}
                type={renderParamsData.type as any}
                multi={renderParamsData.multi}
                time={renderParamsData.time}
                label={renderParamsData.title}
                value={get(props.rendersFields, `values.${renderParamsData.key}`, null)}
                boundKeys={renderParamsData.key}
                onChange={handleChange}
                className={renderParamsData.className}
                options={renderParamsData.options}
                // disabled={!props.isPermitted}
                // error={get(props.errors, renderParamsData.key, '')}
                readOnly={renderParamsData.readOnly}
                inline={renderParamsData.inline}
              />
            );
          }
        }

        if (isString(valueRaw)) {
          valueRaw = (
            valueRaw
              .split('\n')
              .map(
                (oneLineComment, i) => {
                  let text = oneLineComment;

                  if (!showAll || !selected) {
                    const shortTest = valueRaw.slice(0, 300);
                    if (shortTest.length >= 300) {
                      text = `${shortTest} ...`;
                    }

                  }
                  if (text.length > 300) {
                    return (
                      <EtsTbodyScrollContainer key={i}>{text}</EtsTbodyScrollContainer>
                    );
                  } else {
                    return (
                      <EtsTbodyTextContainer key={i}>{text}</EtsTbodyTextContainer>
                    );
                  }
                },
              )
          );
        }

        return valueRaw;
      },
      [props.value, showAll, selected, rendersFields],
    );

    const handleClick = React.useCallback(
      () => {
        if ( !selected ) {
          setShowAll(false);
        } else {
          setShowAll(!showAll);
        }
      },
      [selected, showAll],
    );

    return (
      <EtsTbodyTrTd onClick={handleClick}>
        <EtsTdInnerWrapper>
          {value}
        </EtsTdInnerWrapper>
      </EtsTbodyTrTd>
    );
  },
);

export default TrTd;
