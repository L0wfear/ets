import * as React from 'react';
import withSearch, { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';

type Props = {
  isActive: boolean;
  tabKey: string;
  title: string;
} & WithSearchProps;

const CarFormLink: React.FC<Props> = React.memo(
  (props) => {
    const {
      title,
      tabKey,
    } = props;

    const handleClick = React.useCallback(
      (e) => {
        e.preventDefault();
        props.setParams({
          tabKey,
        });
      },
      [tabKey, props.setParams, props.match.params],
    );

    return (
      <li role="presentation">
        <a role="menuitem" onClick={handleClick}>{title}</a>
      </li>
    );
  },
);

export default withSearch(CarFormLink);
