/* eslint-disable no-tabs */
import * as React from 'react';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import styled from 'styled-components';

const FuelNavLinkStyled = styled(EtsBootstrap.NavItem)`
	font-size: 18px;
`;

type Props = {
	isActive: boolean;
	title: string;
	tabKey: string;
	handleTabChange: (tab: string) => any;
};

const FuelNavLink: React.FC<Props> = React.memo(
  (props) => {
    const {
      isActive,
      title,
      tabKey,
    } = props;

    const handleClick = React.useCallback(
      () => {
        props.handleTabChange(tabKey);
      },
      [tabKey, props.handleTabChange],
    );

    return (
      <FuelNavLinkStyled role="button" active={isActive} onClick={handleClick}>
        {title}
      </FuelNavLinkStyled>
    );
  },
);

export default FuelNavLink;
