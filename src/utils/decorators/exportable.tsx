import * as React from 'react';
import * as PropTypes from 'prop-types';
import { saveData } from 'utils/functions';
import config from 'config';
import { get, map } from 'lodash';
import { postBlob } from 'api/adapterBlob';
import { processResponse } from 'api/APIService';

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

      exportByPostFunction = async (bodyPayload = {}, urlPayload = {}) => {
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

        const result = await postBlob(URL, bodyPayload);
        processResponse(result);
        const blob = get(result, 'blob', null);
        const fileName = get(result, 'fileName', '');

        if (blob && fileName) {
          saveData(blob, fileName);
        }
      };

      exportByPostData = (bodyPayload, urlPayload) => {
        if (typeof this.exportByPostFunction === 'function') {
          this.exportByPostFunction(bodyPayload, urlPayload);
          return Promise.resolve(true);
        }

        return Promise.resolve(false);
      };

      render() {
        return (
          <ComposedComponent
            {...this.props}
            exportable
            exportByPostData={this.exportByPostData}
          />
        );
      }
    };
  };
}
