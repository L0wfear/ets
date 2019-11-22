import * as React from 'react';
import { get } from 'lodash';

import { ExtField } from 'components/old/ui/new/field/ExtField';
import withSearch, { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';
import { getBooleanValueFromSerch } from 'components/new/utils/hooks/useStateUtils';
import { actionChangeGlobalPaylaodInServiceData, actionUnselectSelectedRowToShow } from 'components/new/ui/registry/module/actions-registy';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import { getHeaderData } from 'components/new/ui/registry/module/selectors-registry';
import { getRegistryState, getSessionState } from 'redux-main/reducers/selectors';
import { ChangeIsCurrentStructureWrap } from './styled';
import { etsUseSelector, etsUseDispatch } from 'components/@next/ets_hoc/etsUseDispatch';

type HeaderProps = {
  registryKey: string;
} & WithSearchProps;

const Title: React.FC<HeaderProps> = (props) => {
  const is_current_structure = getBooleanValueFromSerch(props.searchState.is_current_structure);

  const dispatch = etsUseDispatch();

  const is_current_structure_popover = etsUseSelector(
    (state) => getHeaderData(getRegistryState(state), props.registryKey).is_current_structure_popover,
  );
  const userStructureId = etsUseSelector(
    (state) => getSessionState(state).userData.structure_id,
  );

  const handleChange = React.useCallback(
    () => {
      const value = get(event, 'target.checked', event);

      const filterKey = `${props.registryKey}_filters`;

      props.setDataInSearch({
        is_current_structure: value ? value : null,
        [filterKey]: null,
        [`${props.registryKey}_page`]: null,
      });
    },
    [props.setDataInSearch],
  );

  React.useEffect(
    () => {
      const payload = {
        getRegistryData: {
          is_current_structure: is_current_structure ? true : null,
        },
        getBlobData: {
          format: 'xls',
          is_current_structure: is_current_structure ? true : null,
        },
      };
      dispatch(
        actionUnselectSelectedRowToShow(props.registryKey, true),
      );
      dispatch(
        actionChangeGlobalPaylaodInServiceData(props.registryKey, payload),
      );
    },
    [is_current_structure, dispatch, props.registryKey],
  );
  return React.useMemo(
    () => (
      userStructureId &&
        <ChangeIsCurrentStructureWrap>
          <ExtField
            type="boolean"
            value={is_current_structure}
            onChange={handleChange}
            label="Вывести данные по текущему подразделению"
            className="checkbox-input flex-reverse default-boolean-input"
          />
          <EtsBootstrap.OverlayTrigger
            trigger={['hover', 'focus']}
            overlay={(
              <EtsBootstrap.Popover id={`${props.registryKey}_title-popover`} >
                {is_current_structure_popover}
              </EtsBootstrap.Popover>
            )}
            placement="top">
            <EtsBootstrap.Glyphicon glyph="info-sign" />
          </EtsBootstrap.OverlayTrigger>
        </ChangeIsCurrentStructureWrap>
    ),
    [
      handleChange,
      props.registryKey,
      is_current_structure,
      is_current_structure_popover,
    ],
  );
};

export default withSearch(Title);
