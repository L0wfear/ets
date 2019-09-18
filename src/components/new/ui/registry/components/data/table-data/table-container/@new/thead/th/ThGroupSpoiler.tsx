import * as React from 'react';
import { OneRegistryData } from 'components/new/ui/registry/module/@types/registry';
import { etsUseSelector, etsUseDispatch } from 'components/@next/ets_hoc/etsUseDispatch';
import { getListData } from 'components/new/ui/registry/module/selectors-registry';
import styled from 'styled-components';
import { get } from 'lodash';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import { GlyphiconStyled } from 'components/new/ui/@bootstrap/01-glyphicon/EtsGlyphicon';
import { registryChangeGroupActiveColumn } from 'components/new/ui/registry/module/actions-registy';

export const ThGroupSpoilerFirstStyled = styled.div`
  background: #fff;
  position: absolute;
  top: -15px;
  right: 10px;
  transform: translate(100%, -100%);
  border: 1px solid #ddd;
  border-radius: 3px;
  box-shadow: 0 1px 0 0 rgba(0,0,0,.1), 0 1px 15px 0 rgba(0,0,0,.1);
  font-size: 12px;
  padding: 5px 10px;
  display: inline-flex;
  align-items: center;
  justify-content: flex-start;
  white-space: nowrap;
  ${GlyphiconStyled} {
    margin-right: 5px;
  }
  &:before, &:after {
    content: '';
    display: block;
    position: absolute;
    top: 100%;
    width: 0;
    height: 0;
  }
  &:before {
    left: -2px;
    border: 11px solid transparent;
    border-top-color: #ddd;
  }
  &:after {
    left: 1px;
    border: 8px solid transparent;
    border-top-color: #ffffff;
  }
`;

export const ThGroupSpoilerStyled = styled.div`
`;

export const ThGroupDelimeter = styled.div`
  background: red;
  width: 100%;
  height: 2px;
  position: absolute;
  top: -3px;
  left: 0px;
`;

type Props = {
  metaField: ValuesOf<ValuesOf<OneRegistryData['list']['meta']['fieldsInDeepArr']>>;
  registryKey: string;
};

const ThGroupSpoiler: React.FC<Props> = React.memo(
  (props) => {
    const {
      metaField,
      registryKey,
    } = props;

    const groupColumn = etsUseSelector((state) => getListData(state.registry, props.registryKey).meta.groupColumn);
    const dispatch = etsUseDispatch();

    const changeGroupActiveColumn = React.useCallback((eventClick) => {
      eventClick.stopPropagation();
      const groupKey = get(metaField, 'groupOpt.key', null);
      const isActive = !get(groupColumn, `${metaField.groupOpt.key}.isActive`, true);
      if (groupKey) {
        dispatch(
          registryChangeGroupActiveColumn(
            registryKey,
            {
              key: groupKey,
              value: {
                isActive,
                label: get(groupColumn, `${metaField.groupOpt.key}.label`, 'Определи key в groupOpt'),
              },
            },
          ),
        );
      }
    }, [registryKey, metaField, groupColumn]);

    return (
      <ThGroupSpoilerStyled>
        {
          groupColumn && metaField.groupOpt.firstElem &&
            (
              <ThGroupSpoilerFirstStyled  onClick={changeGroupActiveColumn}>
                <EtsBootstrap.Glyphicon glyph='resize-horizontal' />
                {get(groupColumn, `${metaField.groupOpt.key}.label`, 'Определи key в groupOpt')}
              </ThGroupSpoilerFirstStyled>
            )
        }
        {
          metaField.groupOpt && !metaField.groupOpt.firstElem &&
          (
            <React.Fragment>
              <ThGroupDelimeter />
            </React.Fragment>
          )
        }
      </ThGroupSpoilerStyled>
    );
  },
);

export default ThGroupSpoiler;
