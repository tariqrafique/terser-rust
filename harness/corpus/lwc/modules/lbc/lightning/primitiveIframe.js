import { registerDecorators as _registerDecorators } from "lwc";
import _tmpl from "./primitiveIframe.html";
/*
 * Copyright (c) 2025, Salesforce, Inc.,
 * All rights reserved.
 * For full license text, see the LICENSE.txt file
 */
import { registerComponent as _registerComponent } from 'lwc';
import LightningShadowBaseClass from 'lightning/shadowBaseClassPrivate';
import { registerDomain, unregisterDomain } from 'lightning/messageDispatcher';
class LightningPrimitiveIframe extends LightningShadowBaseClass {
  constructor(...args) {
    super(...args);
    this.src = void 0;
    this.domain = void 0;
    this.width = '100%';
    this.height = '100%';
    this.frameStyle = '';
    this.title = void 0;
    this.language = void 0;
  }
  connectedCallback() {
    super.connectedCallback();
    registerDomain(this.src);
  }
  renderedCallback() {
    this.language = !import.meta.env.SSR ? document.documentElement.lang || null : null;
  }
  disconnectedCallback() {
    unregisterDomain(this.src);
  }
  handleContentLoad() {
    const iframeload = new CustomEvent('iframeload', {
      detail: {
        callbacks: {
          postToWindow: this.postToWindow.bind(this)
        }
      }
    });
    this.contentWindow = this.template.querySelector('iframe').contentWindow;
    this.dispatchEvent(iframeload);
  }
  postToWindow(message) {
    if (this.contentWindow) {
      this.contentWindow.postMessage(message, this.domain);
    }
  }
  /*LWC compiler v9.5.3*/
}
_registerDecorators(LightningPrimitiveIframe, {
  publicProps: {
    src: {
      config: 0
    },
    domain: {
      config: 0
    },
    width: {
      config: 0
    },
    height: {
      config: 0
    },
    frameStyle: {
      config: 0
    },
    title: {
      config: 0
    }
  },
  publicMethods: ["postToWindow"],
  fields: ["language"]
});
const __lwc_component_class_internal = _registerComponent(LightningPrimitiveIframe, {
  tmpl: _tmpl,
  sel: "lightning-primitive-iframe",
  apiVersion: 66
});
export default __lwc_component_class_internal;