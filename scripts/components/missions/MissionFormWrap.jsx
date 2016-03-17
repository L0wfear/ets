import React, { Component } from 'react';
import moment from 'moment';
import _ from 'lodash';
import Div from '../ui/Div.jsx';
import MissionForm from './MissionForm.jsx';
import FormWrap from '../compositions/FormWrap.jsx';
import { getDefaultMission } from '../../stores/MissionsStore.js';
import { isNotNull, isEmpty } from '../../utils/functions.js';
import { missionSchema, missionClosingSchema } from '../models/MissionModel.js';

function toDataUrl(url, callback){
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'blob';
    xhr.onload = function() {
      var reader  = new FileReader();
      reader.onloadend = function () {
          callback(reader.result);
      }
      reader.readAsDataURL(xhr.response);
    };
    xhr.open('GET', url);
    xhr.send();
}

var saveData = (function () {
    var a = document.createElement("a");
    document.body.appendChild(a);
    a.style = "display: none";
    return function (blob, fileName) {
        var url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download = fileName;
        a.click();
        window.URL.revokeObjectURL(url);
    };
}());


function dataURItoBlob(dataURI) {
    // convert base64/URLEncoded data component to raw binary data held in a string
    var byteString;
    if (dataURI.split(',')[0].indexOf('base64') >= 0)
        byteString = atob(dataURI.split(',')[1]);
    else
        byteString = unescape(dataURI.split(',')[1]);

    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to a typed array
    var ia = new Uint8Array(byteString.length);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ia], {type:mimeString});
}


class MissionFormWrap extends FormWrap {

	constructor(props) {
		super(props);

		this.schema = missionSchema;
	}

	componentWillReceiveProps(props) {

		if (props.showForm && props.showForm !== this.props.showForm) {
			let mission = props.element === null ? getDefaultMission() : _.clone(props.element);
			let formErrors = this.validate(mission, {});
			this.setState({
				formState: mission,
				canSave: ! !!_.filter(formErrors).length,//false,
				formErrors,
			});
		}

	}

	handlePrint() {
		let f = this.state.formState;
		const { flux } = window.__ETS_CONTAINER__;

	  const token = flux.getStore('session').getSession();
		let URL = `http://ods.mos.ru/ssd/ets/services/plate_mission/?token=${token}&mission_id=${f.id}`;
		let data = {};
		global.map.once('postcompose', function(event) {
      data.image = event.context.canvas.toDataURL('image/png');
			// console.log(data.image.length);
			// var blob = dataURItoBlob(event.context.canvas.toDataURL('image/png'));
			// console.log(blob);
			// saveData(blob, 'qqq.png');
			// var reader = new window.FileReader();
			//  reader.onloadend = function() {
			//                 var base64data = reader.result;
			//                 console.log(base64data.length);
			//   }
			//
			// 	 reader.readAsDataURL(blob);
			fetch(URL, {
				method: 'post',
				body: JSON.stringify(data)
			}).then((r) => {
				console.log(r);
				 r.blob().then(b => {
					saveData(b, `Задание №${f.number}.docx`);
				});
			});
    });
		global.map.render();

		//data.image = event.context.canvas.toDataURL('image/png');
		// toDataUrl('images/qqq.png', (base64Data) => {
		// 	data.image = base64Data;
		// 	fetch(URL, {
		// 		method: 'post',
		// 		body: JSON.stringify(data)
		// 	}).then((r) => {
		// 		console.log(r);
		// 		 r.blob().then(b => {
		// 			saveData(b, 'abc.docx');
		// 		});
		// 	});
		// });
	}

	handleFormSubmit(formState) {
		const { flux } = this.context;

		if (isEmpty(formState.id)) {
			flux.getActions('missions').createMission(formState);
		} else {
			flux.getActions('missions').updateMission(formState);
		}

		this.props.onFormHide();

		return;
	}

	render() {

		return 	<Div hidden={!this.props.showForm}>
							<MissionForm formState = {this.state.formState}
													 onSubmit={this.handleFormSubmit.bind(this)}
													 handleFormChange={this.handleFormStateChange.bind(this)}
													 handlePrint={this.handlePrint.bind(this)}
													 show={this.props.showForm}
													 onHide={this.props.onFormHide}
													 fromWaybill={this.props.fromWaybill}
													 {...this.state}/>
						</Div>

	}

}

export default MissionFormWrap;
