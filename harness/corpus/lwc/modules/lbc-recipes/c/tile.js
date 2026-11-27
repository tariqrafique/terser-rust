import { registerDecorators as _registerDecorators } from "lwc";
import _tmpl from "./tile.html";
import { registerComponent as _registerComponent } from "lwc";
/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

import labelShowActions from '@salesforce/label/c.lightning_LightningPrimitiveCellActions_showActions';
import { assert, classListMutation, normalizeString } from 'c/utilsPrivate';
import { LightningElement } from 'lwc';
import mediaTile from './mediaTile.html';
import standardTile from './standardTile.html';
const VALID_TYPE_VALUES = ['standard', 'media'];
const i18n = {
  showActions: labelShowActions
};
class cTile extends LightningElement {
  constructor(...args) {
    super(...args);
    this.label = void 0;
    this.href = '';
    this._type = 'standard';
    this._actions = [];
  }
  get actions() {
    return this._actions;
  }
  set actions(actions) {
    this._actions = actions;
  }
  get type() {
    return this._type;
  }
  set type(value) {
    assert(VALID_TYPE_VALUES.indexOf(value) !== -1, `Invalid type attribute value of ${value}. Must be one of ${VALID_TYPE_VALUES}.`);
    this._type = normalizeString(value, {
      fallbackValue: 'standard',
      validValues: VALID_TYPE_VALUES
    });
    if (this._connected) {
      this.setClassesAndTemplate();
    }
  }
  handleActionSelect(event) {
    this.dispatchEvent(new CustomEvent('actiontriggered', {
      detail: {
        action: event.detail.value
      }
    }));
  }
  setClassesAndTemplate() {
    classListMutation(this.classList, {
      'slds-media': this.isMedia,
      'slds-hint-parent': this.hasActions
    });
  }
  connectedCallback() {
    this._connected = true;
    this.classList.add('slds-tile');
    this.setClassesAndTemplate();
  }
  render() {
    return this.isMedia ? mediaTile : standardTile;
  }
  get isMedia() {
    return this.type === 'media';
  }
  get hasActions() {
    return Object.keys(this.actions).length > 0;
  }
  get buttonAlternateText() {
    return `${i18n.showActions}`;
  }
  /*LWC compiler v9.5.3*/
}
_registerDecorators(cTile, {
  publicProps: {
    label: {
      config: 0
    },
    href: {
      config: 0
    },
    actions: {
      config: 3
    },
    type: {
      config: 3
    }
  },
  track: {
    _type: 1,
    _actions: 1
  }
});
const __lwc_component_class_internal = _registerComponent(cTile, {
  tmpl: _tmpl,
  sel: "c-tile",
  apiVersion: 66
});
export default __lwc_component_class_internal;