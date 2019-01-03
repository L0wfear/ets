import * as React from 'react';
import { getChildrenData } from 'utils/routes/getChildrenData';
import * as Glyphicon from 'react-bootstrap/lib/Glyphicon';

import master from 'components/new/pages/doc_header/master/_config-data/index';
import dispatcher from 'components/new/pages/doc_header/dispatcher/_config-data/index';
import okrug from 'components/new/pages/doc_header/okrug/_config-data/index';
import common from 'components/new/pages/doc_header/common/_config-data/index';
import techMaintenance from 'components/new/pages/doc_header/tech-maintenance/_config-data/index';

const children = {
  master,
  dispatcher,
  okrug,
  common,
  techMaintenance,
};

export default {
  title: <Glyphicon glyph="book" />,
  children,
  ...getChildrenData(children),
};
