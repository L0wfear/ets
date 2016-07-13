import React from 'react';

export function FluxContext(target) {
	target.contextTypes = {
		flux: React.PropTypes.object,
	};
}
