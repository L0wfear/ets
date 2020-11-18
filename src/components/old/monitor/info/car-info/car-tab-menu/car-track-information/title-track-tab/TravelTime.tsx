import * as React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import TravelTimeValue from 'components/old/monitor/info/car-info/car-tab-menu/car-track-information/title-track-tab/TravelTimeValue';

const Container = styled.div`
  font-weight: 500;
  padding: 5px 5px;
`;

type PropsTravelTime = {};

const TravelTime: React.FC<PropsTravelTime> = () => (
  <Container>
    <span>Время движения общее, ч: </span>
    <TravelTimeValue />
  </Container>
);

export default connect()(TravelTime);
