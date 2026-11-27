import { registerDecorators as _registerDecorators } from "lwc";
import _tmpl from "./formattedLookup.html";
/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

import { LightningElement, registerComponent as _registerComponent } from 'lwc';
import { normalizeBoolean } from 'c/utilsPrivate';
import { getLinkInfo } from 'c/routingService';
class cFormattedLookup extends LightningElement {
  set recordId(value) {
    this.state.recordId = value;
    this.updateLinkData();
  }
  get recordId() {
    return this.state.recordId;
  }
  get disabled() {
    return this.state.disabled;
  }
  set disabled(value) {
    this.state.disabled = normalizeBoolean(value);
    this.state.isNavigable = !this.disabled && !!this.dispatcher && !!this.state.url;
  }
  constructor() {
    super();
    this.displayValue = void 0;
    this._connected = void 0;
    this.dispatcher = void 0;
    this.state = {
      disabled: false,
      recordId: null,
      url: null,
      isNavigable: false
    };
    this._connected = false;
    this.dispatcher = null;
  }
  connectedCallback() {
    this._connected = true;
    this.updateLinkData();
  }
  disconnectedCallback() {
    this._connected = false;
  }
  updateLinkData() {
    if (this._connected && this.state.recordId) {
      getLinkInfo(this, {
        stateType: 'standard__recordPage',
        attributes: {
          recordId: this.state.recordId,
          actionName: 'view'
        }
      }).then(linkInfo => {
        this.state.url = linkInfo.url;
        this.dispatcher = linkInfo.dispatcher;
        this.state.isNavigable = !this.disabled && !!this.dispatcher && !!this.state.url;
      });
    }
  }
  handleClick(event) {
    this.dispatcher(event);
  }
  /*LWC compiler v9.5.3*/
}
_registerDecorators(cFormattedLookup, {
  publicProps: {
    displayValue: {
      config: 0
    },
    recordId: {
      config: 3
    },
    disabled: {
      config: 3
    }
  },
  track: {
    state: 1
  },
  fields: ["_connected", "dispatcher"]
});
const __lwc_component_class_internal = _registerComponent(cFormattedLookup, {
  tmpl: _tmpl,
  sel: "c-formatted-lookup",
  apiVersion: 66
});
export default __lwc_component_class_internal;