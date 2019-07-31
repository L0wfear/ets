import styled from 'styled-components';

export const ColorSensorDiv = styled.div<{ color: string }>`
  width: 30px;
  height: 10px;
  border: 1px solid black;
  margin-right: 10px;

  background-color: ${(props) => props.color};
`;
