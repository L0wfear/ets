import { createGlobalStyle } from 'styled-components';
import { constantColor } from 'global-styled/global-constants';

export const ColorForTable = createGlobalStyle`
  &&& {
    .griddle-body table tbody td.highlight-td-pink, .griddle-body table tbody tr:hover > td.highlight-td-pink {
      background-color: ${constantColor.colorPink} !important;
    }

    .griddle-body table tbody tr:nth-child(even) > td.highlight-td-pink {
      background-color: ${constantColor.colorPink} !important;
    }

    .griddle-body table tbody td.highlight-td-green,
    .griddle-body table tbody tr:hover > td.highlight-td-green {
      background-color: ${constantColor.colorHalfGreen} !important;
    }

    .griddle-body table tbody tr:nth-child(even) > td.highlight-td-green {
      background-color: ${constantColor.colorHalfGreen} !important;
    }

    .griddle-body table tbody tr.highlight-tr-pink > td {
      background-color: ${constantColor.colorPink} !important;
    }
    .griddle-body table tbody tr.highlight-tr-green > td {
      background-color: ${constantColor.colorHalfGreen} !important;
    }
  }
`;
