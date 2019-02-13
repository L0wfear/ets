import { css } from 'styled-components';

const countOfDeepLvl = 66;
const arrayDeepLvl = Array(countOfDeepLvl)
  .fill(1)
  .map((_, index) => index);

const GlobalModalZIndexStyle = css`
  ${arrayDeepLvl.map(
    (index) =>
      css`
        .fade.${`bs_deep_${index}`} {
          z-index: ${1051 + index};
        }
        .fade.${`backdrop_deep_${index}`} {
          z-index: ${1050 + index};
        }
      `,
  )}
`;

export default GlobalModalZIndexStyle;
