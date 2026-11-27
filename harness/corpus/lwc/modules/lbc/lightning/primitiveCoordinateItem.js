import { registerDecorators as _registerDecorators } from "lwc";
import _tmpl from "./primitiveCoordinateItem.html";
/*
 * Copyright (c) 2025, Salesforce, Inc.,
 * All rights reserved.
 * For full license text, see the LICENSE.txt file
 */
import { registerComponent as _registerComponent } from 'lwc';
import labelSelectedItem from '@salesforce/label/LightningPrimitiveCoordinate.selected';
import LightningShadowBaseClass from 'lightning/shadowBaseClassPrivate';
const i18n = {
  labelSelectedItemString: labelSelectedItem
};
class LightningPrimitiveCoordinateItem extends LightningShadowBaseClass {
  constructor(...args) {
    super(...args);
    this.itemAddress = void 0;
    this.itemTitle = void 0;
    this.iconName = void 0;
    this.guid = void 0;
    this.selected = false;
  }
  get i18n() {
    return i18n;
  }
  connectedCallback() {
    super.connectedCallback();
    if (!import.meta.env.SSR) {
      this.dispatchEvent(new CustomEvent('privatecoordinateregister', {
        bubbles: true,
        cancelable: true,
        composed: true,
        detail: {
          key: this.guid
        }
      }));
    }
  }
  get computedAssistiveText() {
    if (this.selected === true) {
      return `${this.itemTitle} ${i18n.labelSelectedItemString}`;
    }
    return '';
  }
  handleMouseOver() {
    const coordinatehover = new CustomEvent('coordinatesmouseover', {
      detail: {
        key: this.guid
      }
    });
    this.dispatchEvent(coordinatehover);
  }
  handleClick() {
    const coordinateclick = new CustomEvent('coordinateclick', {
      detail: {
        key: this.guid
      }
    });
    this.dispatchEvent(coordinateclick);
  }
  /*LWC compiler v9.5.3*/
}
_registerDecorators(LightningPrimitiveCoordinateItem, {
  publicProps: {
    itemAddress: {
      config: 0
    },
    itemTitle: {
      config: 0
    },
    iconName: {
      config: 0
    },
    guid: {
      config: 0
    },
    selected: {
      config: 0
    }
  }
});
const __lwc_component_class_internal = _registerComponent(LightningPrimitiveCoordinateItem, {
  tmpl: _tmpl,
  sel: "lightning-primitive-coordinate-item",
  apiVersion: 66
});
export default __lwc_component_class_internal;