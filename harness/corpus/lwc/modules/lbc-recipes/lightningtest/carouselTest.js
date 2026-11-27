import { registerDecorators as _registerDecorators } from "lwc";
import _tmpl from "./carouselTest.html";
/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

import { LightningElement, registerComponent as _registerComponent } from 'lwc';
class cTestCarouselTest extends LightningElement {
  constructor(...args) {
    super(...args);
    this.disableAutoRefresh = void 0;
    this.disableAutoScroll = void 0;
    this.items = void 0;
  }
  /*LWC compiler v9.5.3*/
}
_registerDecorators(cTestCarouselTest, {
  publicProps: {
    disableAutoRefresh: {
      config: 0
    },
    disableAutoScroll: {
      config: 0
    },
    items: {
      config: 0
    }
  }
});
const __lwc_component_class_internal = _registerComponent(cTestCarouselTest, {
  tmpl: _tmpl,
  sel: "lightningtest-carousel-test",
  apiVersion: 66
});
export default __lwc_component_class_internal;