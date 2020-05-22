import * as React from 'react';
import { getHeaderData } from 'components/new/ui/registry/module/selectors-registry';
import { EtsHeaderTitle, TitleContainer, FlexContainerWrap } from 'components/new/ui/registry/components/data/header/title/styled/styled';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import { getRegistryState } from 'redux-main/reducers/selectors';
import { etsUseSelector } from 'components/@next/ets_hoc/etsUseDispatch';

type HeaderProps = {
  registryKey?: string;
  title?: string;
  hint?: string;
};

const Title: React.FC<HeaderProps> = React.memo(
  (props) => {
    // const format = etsUseSelector(
    //   (state) => getHeaderData(getRegistryState(state), props.registryKey).format,
    // );
    const title = props.registryKey
      ? etsUseSelector((state) => getHeaderData(getRegistryState(state), props.registryKey).title)
      : props.title;
    const titlePopover = props.registryKey
      ? etsUseSelector((state) => getHeaderData(getRegistryState(state), props.registryKey).titlePopover,)
      : props.hint;

    return (
      <EtsHeaderTitle>
        <FlexContainerWrap direction="column">
          <TitleContainer>
            <span>{title}</span>
            {
              Boolean(titlePopover) && (
                <EtsBootstrap.OverlayTrigger
                  trigger={['hover', 'focus']}
                  overlay={(
                    <EtsBootstrap.Popover id={`${props.registryKey}_title-popover`} >
                      {titlePopover}
                    </EtsBootstrap.Popover>
                  )}
                  placement="bottom">
                  <EtsBootstrap.Glyphicon glyph="info-sign" />
                </EtsBootstrap.OverlayTrigger>
              )
            }
          </TitleContainer>
        </FlexContainerWrap>
      </EtsHeaderTitle>
    );
  },
);

export default Title;
