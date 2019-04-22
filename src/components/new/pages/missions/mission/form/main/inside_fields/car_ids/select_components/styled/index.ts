import styled from 'styled-components';

import * as CarAvailableIcon from 'assets/images/car_available.png';
import * as CarNotAvailableIcon from 'assets/images/car_not_available.png';

const DefaultCarWithStatus = styled.img`
  margin-right: 10px;
  margin-top: -2px;
`;

export const AvailableCarImg = styled(DefaultCarWithStatus).attrs({
  src: CarAvailableIcon,
})`
`;

export const NotAvailableCarImg = styled(DefaultCarWithStatus).attrs({
  src: CarNotAvailableIcon,
})`
`;
