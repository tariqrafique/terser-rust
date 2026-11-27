import { registerDecorators as _registerDecorators } from "lwc";
import _tmpl from "./staticMap.html";
import { registerComponent as _registerComponent } from "lwc";
/*
 * Copyright (c) 2025, Salesforce, Inc.,
 * All rights reserved.
 * For full license text, see the LICENSE.txt file
 */
import lang from '@salesforce/i18n/lang';
import formFactor from '@salesforce/client/formFactor';
import labelTitleWithAddress from '@salesforce/label/LightningMap.titleWithAddress';
import labelTitleWithoutAddress from '@salesforce/label/LightningMap.iframeTitle';
import { ratioToScale, calculateSize } from './util';
import { registerMessageHandler, unregisterMessageHandler, createMessage, postMessage } from 'lightning/messageDispatcher';
import { buildMapSourceUrl } from 'lightning/mapUtils';
import { isEmptyString } from 'lightning/inputUtils';
import { formatLabel } from 'lightning/utils';
import LightningShadowBaseClass from 'lightning/shadowBaseClassPrivate';
const EVENT_NAME = {
  LOADING_MAP: 'loadingMap',
  STATIC_MAP_LOADED: 'lightning:staticMapLoaded'
};
const i18n = {
  titleWithAddress: labelTitleWithAddress,
  titleWithoutAddress: labelTitleWithoutAddress
};
class LightningStaticMap extends LightningShadowBaseClass {
  constructor(...args) {
    super(...args);
    this.width = void 0;
    this.height = void 0;
    this.street = void 0;
    this.city = void 0;
    this.province = void 0;
    this.postalCode = void 0;
    this.country = void 0;
    this.title = void 0;
    this._zoom = 14;
    this._scale = 1;
    this._mapType = 'roadmap';
    this._format = 'png';
    this.apiDomain = `*`;
    this._mapLoaded = false;
    this.canRenderIframe = false;
    this._latitude = void 0;
    this._longitude = void 0;
  }
  connectedCallback() {
    if (!import.meta.env.SSR) {
      this._dispatchId = registerMessageHandler(event => {
        this.handleMessage(event);
      });
      this._scale = ratioToScale();
    }
    this.canRenderIframe = !import.meta.env.SSR && !this.template.querySelector('.slds-iframe-container');
  }
  renderedCallback() {
    this.canRenderIframe = true;
  }
  disconnectedCallback() {
    if (this._dispatchId) {
      unregisterMessageHandler(this._dispatchId);
    }
  }
  get latitude() {
    return this._latitude;
  }
  set latitude(value) {
    if (value != null && value !== '') {
      this._latitude = parseFloat(value);
    }
  }
  get longitude() {
    return this._longitude;
  }
  set longitude(value) {
    if (value != null && value !== '') {
      this._longitude = parseFloat(value);
    }
  }
  get size() {
    if (!this._size) {
      this._size = calculateSize(this.width, this.height, formFactor);
    }
    return `${this._size.width}x${this._size.height}`;
  }
  get markers() {
    return `color:red|${this.address}`;
  }
  get mapStyle() {
    if (this._mapLoaded) {
      return 'border: 0px; top: 0; left: 0; right: 0; bottom: 0; position: relative; overflow: hidden; display: inherit';
    }
    return 'display:none';
  }
  get hasValidAddress() {
    return !!(this.province || this.country || this.postalCode);
  }
  get staticMapSrc() {
    if (this.hasValidAddress) {
      return buildMapSourceUrl({
        resource: 'staticMap',
        center: this.address,
        size: this.size,
        zoom: this._zoom,
        scale: this._scale,
        maptype: this._mapType,
        format: this._format,
        markers: this.markers,
        locale: lang
      });
    }
    return '';
  }
  get latLongString() {
    if (this.latitude != null && this.latitude >= -90.0 && this.latitude <= 90.0 && this.longitude != null && this.longitude >= -180.0 && this.longitude <= 180.0) {
      return `${this.latitude},${this.longitude}`;
    }
    return null;
  }
  get addressString() {
    return `${this.street || ''} ${this.city || ''} ${this.province || ''} ${this.postalCode || ''} ${this.country || ''}`;
  }
  get address() {
    return this.latLongString || this.addressString;
  }
  get i18n() {
    return i18n;
  }
  get mapTitle() {
    if (isEmptyString(this.title)) {
      const titleAddress = this.addressString && this.addressString.trim() || this.latLongString && this.latLongString.trim();
      if (isEmptyString(titleAddress)) {
        return this.i18n.titleWithoutAddress;
      }
      return formatLabel(this.i18n.titleWithAddress, titleAddress);
    }
    return this.title;
  }
  handleMessage(data) {
    if (data.event === EVENT_NAME.STATIC_MAP_LOADED) {
      this._mapLoaded = true;
    }
  }
  sendMessage(event, params) {
    if (this._handler) {
      const message = createMessage(this._dispatchId, event, params || {});
      postMessage(this._handler, message, '*');
    }
  }
  handleIframeLoad(event) {
    this._handler = event.detail.callbacks.postToWindow;
    this.sendMessage(EVENT_NAME.LOADING_MAP, {});
  }
  /*LWC compiler v9.5.3*/
}
_registerDecorators(LightningStaticMap, {
  publicProps: {
    width: {
      config: 0
    },
    height: {
      config: 0
    },
    street: {
      config: 0
    },
    city: {
      config: 0
    },
    province: {
      config: 0
    },
    postalCode: {
      config: 0
    },
    country: {
      config: 0
    },
    title: {
      config: 0
    },
    latitude: {
      config: 3
    },
    longitude: {
      config: 3
    }
  },
  track: {
    _mapLoaded: 1,
    _latitude: 1,
    _longitude: 1
  },
  fields: ["_zoom", "_scale", "_mapType", "_format", "apiDomain", "canRenderIframe"]
});
const __lwc_component_class_internal = _registerComponent(LightningStaticMap, {
  tmpl: _tmpl,
  sel: "lightning-static-map",
  apiVersion: 66
});
export default __lwc_component_class_internal;