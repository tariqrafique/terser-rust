import { registerDecorators as _registerDecorators } from "lwc";
import _tmpl from "./colorSwatch.html";
import { registerComponent as _registerComponent } from "lwc";
/*
 * Copyright (c) 2025, Salesforce, Inc.,
 * All rights reserved.
 * For full license text, see the LICENSE.txt file
 */
import LightningShadowBaseClass from 'lightning/shadowBaseClassPrivate';
class LightningColorSwatch extends LightningShadowBaseClass {
  constructor(...args) {
    super(...args);
    this.colors = ['#e3abec', '#c2dbf7', '#9fd6ff', '#9de7da', '#9df0c0', '#fff099', '#fed49a', '#d073e0', '#86baf3', '#44d8be', '#3be282', '#ffe654', '#ffb758', '#bd35bd', '#5779c1', '#5ebbff', '#00aea9', '#3cba4c', '#f5bc25', '#f99221', '#580d8c', '#001970', '#0a2399', '#0b7477', '#0b6b50', '#b67e11', '#b85d0d'];
  }
  get swatches() {
    return this.colors.map(color => {
      return {
        clickHandler(event) {
          event.preventDefault();
          if (!import.meta.env.SSR) {
            this.dispatchEvent(new CustomEvent('updateselectedcolor', {
              bubbles: true,
              composed: true,
              cancelable: true,
              detail: {
                color
              }
            }));
          }
        },
        style: `background:${color};`,
        color
      };
    });
  }
  /*LWC compiler v9.5.3*/
}
_registerDecorators(LightningColorSwatch, {
  fields: ["colors"]
});
const __lwc_component_class_internal = _registerComponent(LightningColorSwatch, {
  tmpl: _tmpl,
  sel: "lightning-color-swatch",
  apiVersion: 66
});
export default __lwc_component_class_internal;