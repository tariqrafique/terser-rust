import { registerDecorators as _registerDecorators } from "lwc";
import _tmpl from "./verticalNavigationSection.html";
/*
 * Copyright (c) 2025, Salesforce, Inc.,
 * All rights reserved.
 * For full license text, see the LICENSE.txt file
 */
import { registerComponent as _registerComponent } from 'lwc';
import LightningShadowBaseClass from 'lightning/shadowBaseClassPrivate';
import { guid, isHeadingLevelValid } from 'lightning/utilsPrivate';
class LightningVerticalNavigationSection extends LightningShadowBaseClass {
  constructor(...args) {
    super(...args);
    this.headingId = guid();
    this._label = void 0;
    this._privateHeadingAriaLevel = void 0;
  }
  set label(label) {
    this._label = label;
  }
  get label() {
    return this._label || '';
  }
  handleOverflowRegister(event) {
    event.stopPropagation();
    const item = event.detail;
    item.callbacks.updateAssistiveText(this.label);
  }
  get headingLevel() {
    return this._privateHeadingAriaLevel;
  }
  set headingLevel(value) {
    if (isHeadingLevelValid(value)) {
      this._privateHeadingAriaLevel = value;
    }
  }
  /*LWC compiler v9.5.3*/
}
_registerDecorators(LightningVerticalNavigationSection, {
  publicProps: {
    label: {
      config: 3
    },
    headingLevel: {
      config: 3
    }
  },
  track: {
    _label: 1
  },
  fields: ["headingId", "_privateHeadingAriaLevel"]
});
const __lwc_component_class_internal = _registerComponent(LightningVerticalNavigationSection, {
  tmpl: _tmpl,
  sel: "lightning-vertical-navigation-section",
  apiVersion: 66
});
export default __lwc_component_class_internal;