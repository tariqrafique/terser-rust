import { registerDecorators as _registerDecorators } from "lwc";
import _tmpl from "./formattedAddress.html";
import { registerComponent as _registerComponent } from "lwc";
/*
 * Copyright (c) 2025, Salesforce, Inc.,
 * All rights reserved.
 * For full license text, see the LICENSE.txt file
 */
import locale from '@salesforce/i18n/locale';
import LightningShadowBaseClass from 'lightning/shadowBaseClassPrivate';
import { normalizeBoolean, normalizeString } from 'lightning/utilsPrivate';
import { addressFormat } from 'lightning/internationalizationLibrary';
const MAP_HOST = 'https://www.google.com/maps?q=';
const VARIANT_TRUNCATE = 'truncate';
const VARIANT_PLAIN = 'plain';
class LightningFormattedAddress extends LightningShadowBaseClass {
  constructor(...args) {
    super(...args);
    this.state = {
      street: '',
      city: '',
      province: '',
      country: '',
      postalCode: '',
      latitude: '',
      longitude: '',
      disabled: false
    };
    this.href = void 0;
    this.locale = locale;
    this._variant = void 0;
    this._showStaticMap = void 0;
  }
  get street() {
    return this.state.street;
  }
  set street(value) {
    this.state.street = value;
  }
  get city() {
    return this.state.city;
  }
  set city(value) {
    this.state.city = value;
  }
  get province() {
    return this.state.province;
  }
  set province(value) {
    this.state.province = value;
  }
  get country() {
    return this.state.country;
  }
  set country(value) {
    this.state.country = value;
  }
  get postalCode() {
    return this.state.postalCode;
  }
  set postalCode(value) {
    this.state.postalCode = value;
  }
  get latitude() {
    return this.state.latitude;
  }
  set latitude(value) {
    this.state.latitude = value;
  }
  get longitude() {
    return this.state.longitude;
  }
  set longitude(value) {
    this.state.longitude = value;
  }
  get disabled() {
    return this.state.disabled;
  }
  set disabled(value) {
    this.state.disabled = normalizeBoolean(value);
  }
  get variant() {
    return this._variant || VARIANT_TRUNCATE;
  }
  set variant(value) {
    this._variant = normalizeString(value, {
      fallbackValue: VARIANT_TRUNCATE,
      validValues: [VARIANT_TRUNCATE, VARIANT_PLAIN]
    });
  }
  get showStaticMap() {
    return this._showStaticMap || false;
  }
  set showStaticMap(value) {
    this._showStaticMap = normalizeBoolean(value);
  }
  click() {
    if (this.addressLink) {
      this.addressLink.click();
    }
  }
  get showPlainText() {
    return this.hasValue && this.isPlainText;
  }
  get showMapLink() {
    return this.hasValue && this.isMapLink;
  }
  get isPlainText() {
    return this.disabled;
  }
  get isMapLink() {
    return !this.disabled;
  }
  get hasValue() {
    return !!(this.street || this.city || this.province || this.country || this.postalCode);
  }
  get address() {
    const [langCode, countryCode] = this.locale.split('-');
    return addressFormat.formatAddressAllFields(langCode, countryCode, {
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
  get mapQuery() {
    const {
      address,
      latitude,
      longitude
    } = this;
    return latitude && longitude ? `${latitude},${longitude}` : address;
  }
  get computedAriaLabel() {
    return this.address;
  }
  get internalTabIndex() {
    return this.getAttribute('tabindex');
  }
  get mapUrl() {
    return encodeURI(MAP_HOST) + encodeURIComponent(this.mapQuery);
  }
  get addressLink() {
    return this.template.querySelector('a');
  }
  get computedAddressLineClass() {
    return this.variant === VARIANT_TRUNCATE ? 'slds-truncate' : null;
  }
  /*LWC compiler v9.5.3*/
}
_registerDecorators(LightningFormattedAddress, {
  publicProps: {
    locale: {
      config: 0
    },
    street: {
      config: 3
    },
    city: {
      config: 3
    },
    province: {
      config: 3
    },
    country: {
      config: 3
    },
    postalCode: {
      config: 3
    },
    latitude: {
      config: 3
    },
    longitude: {
      config: 3
    },
    disabled: {
      config: 3
    },
    variant: {
      config: 3
    },
    showStaticMap: {
      config: 3
    }
  },
  publicMethods: ["click"],
  track: {
    state: 1,
    href: 1,
    _showStaticMap: 1
  },
  fields: ["_variant"]
});
const __lwc_component_class_internal = _registerComponent(LightningFormattedAddress, {
  tmpl: _tmpl,
  sel: "lightning-formatted-address",
  apiVersion: 66
});
export default __lwc_component_class_internal;