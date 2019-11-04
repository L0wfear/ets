import { components } from 'react-select';
import styled, { css } from 'styled-components';

export const ClearIndicator = styled(components.ClearIndicator)`
`;

export const CrossIcon = styled(components.CrossIcon)`
`;

export const DownChevron = styled(components.DownChevron)`
`;

export const DropdownIndicator = styled(components.DropdownIndicator)`
`;

export const Group = styled(components.Group)`
`;

export const GroupHeading = styled(components.GroupHeading)`
`;

export const IndicatorSeparator = styled(components.IndicatorSeparator)`
`;

export const IndicatorsContainer = styled(components.IndicatorsContainer)`

`;
export const Input = styled(components.Input)`

`;
export const LoadingIndicator = styled(components.LoadingIndicator)`
`;

export const LoadingMessage = styled(components.LoadingMessage)`
`;

export const MenuPortal = styled(components.MenuPortal)`
`;

const notValidStyle = css`
  background-color: #ff000087;
  border: 1px solid #ff00004a!important;
  color: white!important;
`;

export const MultiValue = styled(components.MultiValue)`
  &&& {
    ${({ data: { is_invalid } }) => (
    is_invalid && notValidStyle
  )
}
  }
`;

export const MultiValueContainer = styled(components.MultiValueContainer)`

`;
export const MultiValueLabel = styled(components.MultiValueLabel)`
`;

export const MultiValueRemove = styled(components.MultiValueRemove)`
`;

export const NoOptionsMessage = styled(components.NoOptionsMessage)`
`;

export const Placeholder = styled(components.Placeholder)`
`;

export const Control = styled(components.Control)`
`;

export const Option = styled(components.Option)`
  &&& {
    cursor: pointer;
    color: black;

    background-color: ${({ isSelected }: any) => isSelected ? 'rgba(222, 235, 255, 0.8)' : 'initial'};
    &:hover {
      background-color: ${({ isSelected }: any) => isSelected ? 'rgba(222, 235, 255, 0.65)' : 'rgba(127, 198, 80, 0.5)'};
    }
  }
`;

export const MenuList = styled(components.MenuList).attrs({ className: 'menu-list-container' })`
  &.menu-list-container {
    cursor: pointer;
    padding-bottom: 0;
    padding-top: 0;
  }
`;

export const Menu = styled(components.Menu).attrs({ className: 'menu-container' })`
  &.menu-container {
    margin-bottom: initial;
    margin-top: initial;
    border-radius: 0;
    border-right: 1px solid hsl(0,0%,80%);
    border-bottom: 1px solid hsl(0,0%,80%);
    border-left: 1px solid hsl(0,0%,80%);
  }
`;

export const SelectContainer = styled(components.SelectContainer)`
`;

export const SingleValue: any = styled(components.SingleValue)`
`;

export const ValueContainer = styled(components.ValueContainer)`
`;

export const styledComponents = {
  ClearIndicator,
  Option,
  CrossIcon,
  Control,
  DownChevron,
  DropdownIndicator,
  Group,
  GroupHeading,
  IndicatorSeparator,
  IndicatorsContainer,
  Input,
  LoadingIndicator,
  LoadingMessage,
  Menu,
  MenuList,
  MenuPortal,
  MultiValue,
  MultiValueContainer,
  MultiValueLabel,
  MultiValueRemove,
  NoOptionsMessage,
  Placeholder,
  SelectContainer,
  SingleValue,
  ValueContainer,
};
