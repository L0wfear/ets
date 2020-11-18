import * as React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import DistanceOverSpeedValue from 'components/old/monitor/info/car-info/car-tab-menu/car-track-information/title-track-tab/DistanceOverSpeedValue';

const Container = styled.div`
  font-weight: 500;
  padding: 5px 5px;
`;

type PropsDistanceOverSpeed = {};

const DistanceOverSpeed: React.FC<PropsDistanceOverSpeed> = () => (
  <Container>
    <span>Дистанция с превышением скорости, км: </span>
    <DistanceOverSpeedValue />
  </Container>
);

export default connect()(DistanceOverSpeed);
