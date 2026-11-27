import _tmpl from "./primitiveDatatableLoadingIndicator.html";
import { registerComponent as _registerComponent } from "lwc";
/*
 * Copyright (c) 2025, Salesforce, Inc.,
 * All rights reserved.
 * For full license text, see the LICENSE.txt file
 */
import labelLoading from '@salesforce/label/LightningDatatable.loading';
import LightningShadowBaseClass from 'lightning/shadowBaseClassPrivate';
const i18n = {
  loading: labelLoading
};
class LightningPrimitiveDatatableLoadingIndicator extends LightningShadowBaseClass {
  get i18n() {
    return i18n;
  }
  /*LWC compiler v9.5.3*/
}
const __lwc_component_class_internal = _registerComponent(LightningPrimitiveDatatableLoadingIndicator, {
  tmpl: _tmpl,
  sel: "lightning-primitive-datatable-loading-indicator",
  apiVersion: 66
});
export default __lwc_component_class_internal;