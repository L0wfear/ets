import * as React from 'react';
import * as PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { saveData } from 'utils/functions';
import { parseFilename } from 'utils/content-disposition.js';
import config from 'config';
import _ from 'lodash';

// TODO поменять на urlencode и использовать для составления параметров
export function toUrlWithParams(url, data) {
  const params = _.map(data, (v, k) => `${k}=${encodeURIComponent(v)}`).join('&');
  return `${url}?${params}`;
}

export default function exportable(options) {
  return function decorateWithExportableFeatures(ComposedComponent) {
    return @autobind class Exportable extends React.Component {

      static get propTypes() {
        return {
          routeParams: PropTypes.object,
        };
      }

      constructor(props, context) {
        super(props, context);
        const { entity, path } = options;
        this.entity = entity;
        this.path = path;
      }

      exportFunction(payload = {}, useRouteParams) {
        const token = JSON.parse(window.localStorage.getItem(global.SESSION_KEY2));
        let id = '';
        if (useRouteParams) {
          id = this.props.routeParams.id;
        }

        payload = {
          ...payload,
          format: 'xls',
        };
        const URL = toUrlWithParams(
          `${config.backend}/${this.path || ''}${this.path ? '/' : ''}${this.entity}/${id}`,
          payload
        );
        // TODO blob
        return fetch(URL, {
          method: 'get',
          headers: {
            Authorization: `Token ${token}`,
            'Access-Control-Expose-Headers': 'Content-Disposition',
          },
        }).then((async) (r) => {
          const fileName = parseFilename(r.headers.get('Content-Disposition'));
          const blob = await r.blob();
          return {
            blob,
            fileName,
          };
        });
      }

      export(payload = {}, useRouteParams = false) {
        if (typeof this.exportFunction === 'function') {
          return this.exportFunction(payload, useRouteParams)
            .then(({ blob, fileName }) => {
              saveData(blob, fileName);
            });
        }
      }

      render() {
        return <ComposedComponent {...this.props} exportable export={this.export} />;
      }

    };
  };
}
