import { registerDecorators as _registerDecorators } from "lwc";
import _tmpl from "./formattedAddress.html";
/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

import { LightningElement, registerComponent as _registerComponent } from 'lwc';
import { addressFormat } from 'c/internationalizationLibrary';
class FormattedAddress extends LightningElement {
  constructor(...args) {
    super(...args);
    this.city = void 0;
    this.country = void 0;
    this.disabled = void 0;
    this.latitude = void 0;
    this.longitude = void 0;
    this.postalCode = void 0;
    this.province = void 0;
    this.showStaticMap = void 0;
    this.street = void 0;
  }
  get address() {
    return addressFormat.formatAddressAllFields('en', 'US', {
      address: this.street,
      city: this.city,
      state: this.province,
      country: this.country,
      zipCode: this.postalCode
    }) || '';
  }
  get addressLines() {
    return this.address.split('\n');
  }
  /*LWC compiler v9.5.3*/
}
_registerDecorators(FormattedAddress, {
  publicProps: {
    city: {
      config: 0
    },
    country: {
      config: 0
    },
    disabled: {
      config: 0
    },
    latitude: {
      config: 0
    },
    longitude: {
      config: 0
    },
    postalCode: {
      config: 0
    },
    province: {
      config: 0
    },
    showStaticMap: {
      config: 0
    },
    street: {
      config: 0
    }
  }
});
const __lwc_component_class_internal = _registerComponent(FormattedAddress, {
  tmpl: _tmpl,
  sel: "lightning-formatted-address",
  apiVersion: 66
});
export default __lwc_component_class_internal;