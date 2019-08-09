import styled from 'styled-components';
import { lighten } from 'polished';

export const EtsTheadTh = styled.th<{ canClick?: boolean, width?: number, widthUnits?: string, alignCenter?: boolean, }>`
    vertical-align: middle;
    background-color: #eee;
    padding: 8px;
    border: 1px solid white;
    border-bottom: 1px solid #c1c1c1 !important;
    position: sticky;
    top: 0;
    z-index: 1;

    cursor: ${({ canClick }) => canClick ? 'pointer' : 'default'};
    width: ${({ width, widthUnits }) => width ? `${width}${widthUnits ? widthUnits : 'px'} ` : 'auto'};
    text-align: ${ ({ alignCenter }) => alignCenter ? 'center' : 'left' };
    &:hover {
      background-color: ${({ canClick }) => canClick ? lighten(0.04, '#eee') : '#eee'};
    }
    input {
      cursor: ${({ canClick }) => canClick ? 'pointer' : 'default'};
    }
`;
