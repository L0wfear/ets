import * as React from 'react';
import * as PropTypes from 'prop-types';
import { saveData } from 'utils/functions';
import { parseFilename } from 'utils/content-disposition';
import config from 'config';
import { get, map } from 'lodash';

// TODO поменять на urlencode и использовать для составления параметров
export function toUrlWithParams(url, data) {
  const params = map(data, (v, k) => `${k}=${encodeURIComponent(v)}`).join(
    '&',
  );
  return `${url}?${params}`;
}

export default function exportable(options) {
  return function decorateWithExportableFeatures(ComposedComponent) {
    return class Exportable extends React.Component<any, any> {
      entity: string;
      path: string;

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

      exportFunction = (payloadOwn = {}, useRouteParams) => {
        const token = JSON.parse(
          window.localStorage.getItem(global.SESSION_KEY),
        );
        let id = '';
        if (useRouteParams) {
          id = this.props.routeParams.id;
        }

        const payload = {
          ...payloadOwn,
          format: 'xls',
        };
        const version = get(
          JSON.parse(localStorage.getItem(global.API__KEY) || '{}'),
          [config.backend],
          '',
        );

        const URL = version
          ? toUrlWithParams(
            `${config.backend}/v${version}/${this.path || ''}${
              this.path ? '/' : ''
            }${this.entity}/${id}`,
            payload,
          )
          : toUrlWithParams(
            `${config.backend}/${this.path || ''}${this.path ? '/' : ''}${
              this.entity
            }/${id}`,
            payload,
          );
        // TODO blob
        return fetch(URL, {
          method: 'get',
          headers: {
            'Authorization': `Token ${token}`,
            'Access-Control-Expose-Headers': 'Content-Disposition',
          },
        }).then(async (r) => {
          const fileName = parseFilename(r.headers.get('Content-Disposition'));
          const blob = await r.blob();
          return {
            blob,
            fileName,
          };
        });
      };

      exportByPostFunction = (bodyPayload = {}, urlPayload = {}) => {
        const token = JSON.parse(
          window.localStorage.getItem(global.SESSION_KEY),
        );
        const version = get(
          JSON.parse(localStorage.getItem(global.API__KEY) || '{}'),
          [config.backend],
          '',
        );

        const URL = version
          ? toUrlWithParams(
            `${config.backend}/v${version}/${this.path || ''}${
              this.path ? '/' : ''
            }${this.entity}`,
            {
              format: 'xls',
              ...urlPayload,
            },
          )
          : toUrlWithParams(
            `${config.backend}/${this.path || ''}${this.path ? '/' : ''}${
              this.entity
            }`,
            {
              format: 'xls',
              ...urlPayload,
            },
          );
        // TODO blob, <<< добавить обработчик 500х
        return fetch(URL, {
          method: 'post',
          body: JSON.stringify(bodyPayload),
          headers: {
            'Authorization': `Token ${token}`,
            'Access-Control-Expose-Headers': 'Content-Disposition',
          },
        }).then(async (r) => {
          const fileName = parseFilename(r.headers.get('Content-Disposition'));
          const blob = await r.blob();
          return {
            blob,
            fileName,
          };
        });
      };

      export = (payload = {}, useRouteParams = false) => {
        if (typeof this.exportFunction === 'function') {
          return this.exportFunction(payload, useRouteParams).then(
            ({ blob, fileName }) => {
              saveData(blob, fileName);
            },
          );
        }

        return Promise.resolve(false);
      };

      exportByPostData = (bodyPayload, urlPayload) => {
        if (typeof this.exportByPostFunction === 'function') {
          return this.exportByPostFunction(bodyPayload, urlPayload).then(
            ({ blob, fileName }) => {
              saveData(blob, fileName);
            },
          );
        }

        return Promise.resolve(false);
      };

      render() {
        return (
          <ComposedComponent
            {...this.props}
            exportable
            export={this.export}
            exportByPostData={this.exportByPostData}
          />
        );
      }
    };
  };
}
