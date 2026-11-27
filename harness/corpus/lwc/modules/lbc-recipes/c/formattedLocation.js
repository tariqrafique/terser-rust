import { registerDecorators as _registerDecorators } from "lwc";
import _tmpl from "./formattedLocation.html";
/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

import { LightningElement, registerComponent as _registerComponent } from 'lwc';
const MAX_LONGITUDE = 180.0;
const MAX_LATITUDE = 90.0;
function isNumber(value) {
  return value !== '' && value !== null && isFinite(value);
}
function isLongitude(longitude) {
  return isNumber(longitude) && Math.abs(longitude) <= MAX_LONGITUDE;
}
function isLatitude(latitude) {
  return isNumber(latitude) && Math.abs(latitude) <= MAX_LATITUDE;
}
class cFormattedLocation extends LightningElement {
  constructor(...args) {
    super(...args);
    this.latitude = void 0;
    this.longitude = void 0;
  }
  get isValid() {
    const valid = isLatitude(this.latitude) && isLongitude(this.longitude);
    if (!valid) {
      // eslint-disable-next-line no-console
      console.warn(`<c-formatted-location> expects latitude in range [-90.0, 90.0], longitude in range [-180.0, 180.0].`);
    }
    return valid;
  }
  /*LWC compiler v9.5.3*/
}
_registerDecorators(cFormattedLocation, {
  publicProps: {
    latitude: {
      config: 0
    },
    longitude: {
      config: 0
    }
  }
});
const __lwc_component_class_internal = _registerComponent(cFormattedLocation, {
  tmpl: _tmpl,
  sel: "c-formatted-location",
  apiVersion: 66
});
export default __lwc_component_class_internal;