import { registerDecorators as _registerDecorators } from "lwc";
import _tmpl from "./formattedLocation.html";
/*
 * Copyright (c) 2025, Salesforce, Inc.,
 * All rights reserved.
 * For full license text, see the LICENSE.txt file
 */
import { registerComponent as _registerComponent } from 'lwc';
import LightningShadowBaseClass from 'lightning/shadowBaseClassPrivate';
import { toFormattedLocation } from 'lightning/utilsPrivate';
class LightningFormattedLocation extends LightningShadowBaseClass {
  constructor(...args) {
    super(...args);
    this.latitude = void 0;
    this.longitude = void 0;
  }
  get formattedLocation() {
    return toFormattedLocation(this);
  }
  /*LWC compiler v9.5.3*/
}
_registerDecorators(LightningFormattedLocation, {
  publicProps: {
    latitude: {
      config: 0
    },
    longitude: {
      config: 0
    }
  }
});
const __lwc_component_class_internal = _registerComponent(LightningFormattedLocation, {
  tmpl: _tmpl,
  sel: "lightning-formatted-location",
  apiVersion: 66
});
export default __lwc_component_class_internal;