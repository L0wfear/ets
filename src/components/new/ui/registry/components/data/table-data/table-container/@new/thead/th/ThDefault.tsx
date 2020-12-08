import * as React from 'react';
import { getListData } from 'components/new/ui/registry/module/selectors-registry';

import EtsBootstrap from 'components/new/ui/@bootstrap';
import { etsUseSelector } from 'components/@next/ets_hoc/etsUseDispatch';
import { OneRegistryData } from 'components/new/ui/registry/module/@types/registry';
import { get } from 'lodash';
import ThGroupSpoiler from 'components/new/ui/registry/components/data/table-data/table-container/@new/thead/th/ThGroupSpoiler';
import styled from 'styled-components';

export const ThDefaultWrapper = styled.div`
  display: inline-flex;
  align-content: center;
`;

export const getGlyphName = <F extends any>(key: ValuesOf<ValuesOf<OneRegistryData<F>['list']['meta']['fieldsInDeepArr']>>['key'], sort: OneRegistryData<F>['list']['processed']['sort']) => {
  if (key === sort.field) {
    return sort.reverse ? 'sort-by-attributes-alt' : 'sort-by-attributes';
  }

  return null;
};

export const ThOverlayTrigger = styled.div`
  &&& {
    margin-left: 5px;
    display: inline-flex;
    align-items: center;
  }
`;

type Props = {
  metaField: ValuesOf<ValuesOf<OneRegistryData['list']['meta']['fieldsInDeepArr']>>;
  registryKey: string;
  tableScrollXPos: number;
  isHorizontalStickyTh: boolean;
};

const ThDefault: React.FC<Props> = React.memo(
  (props) => {
    const {
      metaField,
    } = props;

    const sort = etsUseSelector((state) => getListData(state.registry, props.registryKey).processed.sort);

    const groupOpt = get(metaField, 'groupOpt', null);
    const sortBy = get(metaField, 'sortBy');

    return (
      <ThDefaultWrapper>
        {
          groupOpt
          && (<ThGroupSpoiler
            metaField={metaField}
            registryKey={props.registryKey}
            tableScrollXPos={props.tableScrollXPos}
            isHorizontalStickyTh={props.isHorizontalStickyTh}
          />)
        }
        {metaField.title}
        {metaField.fieldTitlePopup 
        && <ThOverlayTrigger>
          <EtsBootstrap.OverlayTrigger
            trigger={['hover', 'focus']}
            overlay={(
              <EtsBootstrap.Popover id={`${props.registryKey}_${metaField.key}_title-popover`} >
                {metaField.fieldTitlePopup}
              </EtsBootstrap.Popover>
            )}
            placement="bottom">
            <EtsBootstrap.Glyphicon glyph="info-sign" />
          </EtsBootstrap.OverlayTrigger>
        </ThOverlayTrigger> 
        
        }
        <EtsBootstrap.Glyphicon glyph={getGlyphName(sortBy ? sortBy : metaField.key, sort)} />
      </ThDefaultWrapper>
    );
  },
);

export default ThDefault;
