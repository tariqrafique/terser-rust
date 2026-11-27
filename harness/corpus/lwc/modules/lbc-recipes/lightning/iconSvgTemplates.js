import _tmpl from "./iconSvgTemplates.html";
import { registerComponent as _registerComponent } from "lwc";
/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

import templates from './buildTemplates/templates';
const __lwc_component_class_internal = _registerComponent(templates, {
  tmpl: _tmpl,
  sel: "lightning-icon-svg-templates",
  apiVersion: 66
});
export default __lwc_component_class_internal;