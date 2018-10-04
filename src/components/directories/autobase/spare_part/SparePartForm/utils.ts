import { defaultSelectListMapper } from 'components/ui/input/ReactSelect/utils';

export const componentDidMount = props => {
  props.flux.getActions('autobase').getAutobaseListByType('measureUnit', {}, { makeOptions: true, selectListMapper: defaultSelectListMapper });
  props.flux.getActions('autobase').getAutobaseListByType('sparePartGroup', {}, { makeOptions: true, selectListMapper: defaultSelectListMapper });
}