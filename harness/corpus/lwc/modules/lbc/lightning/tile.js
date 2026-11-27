import { registerDecorators as _registerDecorators } from "lwc";
import _tmpl from "./tile.html";
import { registerComponent as _registerComponent } from "lwc";
/*
 * Copyright (c) 2025, Salesforce, Inc.,
 * All rights reserved.
 * For full license text, see the LICENSE.txt file
 */
import labelShowActions from '@salesforce/label/LightningPrimitiveCellActions.showActions';
import { assert, classListMutation, normalizeString, sanitizeURL } from 'lightning/utilsPrivate';
import LightningShadowBaseClass from 'lightning/shadowBaseClassPrivate';
import mediaTile from './mediaTile.html';
import standardTile from './standardTile.html';
const VALID_TYPE_VALUES = ['standard', 'media'];
const i18n = {
  showActions: labelShowActions
};
class LightningTile extends LightningShadowBaseClass {
  constructor(...args) {
    super(...args);
    this.label = void 0;
    this._type = 'standard';
    this._actions = [];
    this._href = void 0;
  }
  get actions() {
    return this._actions;
  }
  set actions(actions) {
    this._actions = actions;
  }
  get href() {
    return this._href;
  }
  set href(value) {
    this._href = sanitizeURL(value);
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
    super.connectedCallback();
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
LightningTile.validationOptOut = ['class'];
_registerDecorators(LightningTile, {
  publicProps: {
    label: {
      config: 0
    },
    actions: {
      config: 3
    },
    href: {
      config: 3
    },
    type: {
      config: 3
    }
  },
  track: {
    _type: 1,
    _actions: 1
  },
  fields: ["_href"]
});
const __lwc_component_class_internal = _registerComponent(LightningTile, {
  tmpl: _tmpl,
  sel: "lightning-tile",
  apiVersion: 66
});
export default __lwc_component_class_internal;