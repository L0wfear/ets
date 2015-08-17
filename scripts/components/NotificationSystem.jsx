import React from 'react';
import NotificationSystem from 'react-notification-system';

/*
  INFO
  https://github.com/igorprado/react-notification-system
 */

export default class AppNotificationSystem extends NotificationSystem {

  constructor(props){
    super(props)
    this._notify = this.notify.bind(this);
  }

  /**
   * показать сообщение
   * @param text
   * @param type success|error|warning|info
   */
  notify(text, type){

    if (this._notificationSystem === undefined ) return;

    this._notificationSystem.addNotification({
      message: text,
      level: type,
      position:'tc'
    });
  }


  componentDidMount(){

    this._notificationSystem = this.refs.notificationSystem;
    const notify = this._notify;

    if (global.NODE_ENV === 'development'){

      /*let newConsoleLog = () => {
        if ( arguments.length > 1 ){
          console.log( arguments )
        } else {
          let message = arguments[0]
          setTimeout(()=>notify( message, 'info'), 0)
        }
      }

      console.log = newConsoleLog;*/

     /* console.warn = (text) => {
        setTimeout(()=> notify( text, 'warning'), 0)
      }*/
    }
  }

  render(){
    return (
      <NotificationSystem ref="notificationSystem"/>
    )
  }
}
