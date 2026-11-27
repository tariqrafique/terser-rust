/*
 * Copyright (c) 2025, Salesforce, Inc.,
 * All rights reserved.
 * For full license text, see the LICENSE.txt file
 */
const SHOW_TOAST_EVENT_NAME = 'lightning__showtoast';
class ShowToastEvent extends CustomEvent {
  constructor(config) {
    const options = {
      bubbles: true,
      cancelable: true,
      composed: true
    };
    if (config) {
      const {
        label
      } = config;
      if (!label) {
        console.error('Toast: please provide at least the "label" property to show the toast');
      }
      options.detail = config;
    }
    super(SHOW_TOAST_EVENT_NAME, options);
  }
  /*LWC compiler v9.5.3*/
}

export { SHOW_TOAST_EVENT_NAME, ShowToastEvent };