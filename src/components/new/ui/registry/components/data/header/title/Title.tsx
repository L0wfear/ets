import * as React from 'react';
import { connect, DispatchProp } from 'react-redux';
import { getHeaderData } from 'components/new/ui/registry/module/selectors-registry';
import { EtsHeaderTitle } from 'components/new/ui/registry/components/data/header/title/styled/styled';
import { OneRegistryData } from 'components/new/ui/registry/module/registry';
import { ReduxState } from 'redux-main/@types/state';
import EtsBootstrap from 'components/new/ui/@bootstrap';

type HeaderStateProps = {
  title: OneRegistryData['header']['title'];
  titlePopover: OneRegistryData['header']['titlePopover'];
};
type HeaderDispatchProps = DispatchProp;
type HeaderOwnProps = {
  registryKey: string;
};
type HeaderMergedProps = (
  HeaderStateProps
  & HeaderDispatchProps
  & HeaderOwnProps
);
type HeaderProps = HeaderMergedProps;

const Header: React.FC<HeaderProps> = (props) => {
  return (
    <EtsHeaderTitle>
      <span>{props.title}</span>
      {
        Boolean(props.titlePopover) && (
          <EtsBootstrap.OverlayTrigger
            trigger={['hover', 'focus']}
            overlay={(
              <EtsBootstrap.Popover id={`${props.registryKey}_title-popover`} >
                {props.titlePopover}
              </EtsBootstrap.Popover>
            )}
            placement="bottom">
            <EtsBootstrap.Glyphicon glyph="info-sign" />
          </EtsBootstrap.OverlayTrigger>
        )
      }
    </EtsHeaderTitle>
  );
};

export default connect<HeaderStateProps, HeaderDispatchProps, HeaderOwnProps, ReduxState>(
  (state, { registryKey }) => ({
    title: getHeaderData(state.registry, registryKey).title,
    titlePopover: getHeaderData(state.registry, registryKey).titlePopover,
  }),
)(Header);
