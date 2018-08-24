import * as React from 'react';

type SubItemInSubItem = {
  title: string;
  id: number;
}

type SubItem = {
  title: string;
  subItems: SubItemInSubItem[];
}

type PropsDashboardDlList = {
  subItem: SubItem;
  selectMission: (id: number) => any;
}

type StateDashboardDlList = {
  hiddenSubItems: boolean;
}

class DashboardDlList extends React.Component<PropsDashboardDlList, StateDashboardDlList> {
  state = {
    hiddenSubItems: true,
  };

  toggleList: React.MouseEventHandler<HTMLDListElement> = () => (
    this.setState({
      hiddenSubItems: !this.state.hiddenSubItems,
    })
  );

  handleClick: React.MouseEventHandler<HTMLLIElement> = ({ currentTarget: { dataset: { id } } }) => {
    this.props.selectMission(Number(id));
  }

  render() {
    const { subItem } = this.props;

    return (
      <dl>
        <dt onClick={this.toggleList}>{subItem.title || subItem}</dt>
          {
            this.state.hiddenSubItems ?
            <dd></dd>
            :
            <dd>
              {
                subItem.subItems.map(({ title, id }) => (
                  <li key={id} data-id={id} onClick={this.handleClick} >{title}</li>
                ))
              }
            </dd>
          }
        </dl>
    )
  }
}

export default DashboardDlList;
