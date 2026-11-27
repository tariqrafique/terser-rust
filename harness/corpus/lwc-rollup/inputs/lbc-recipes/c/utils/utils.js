/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

const proto = {
  add(className) {
    if (typeof className === 'string') {
      this[className] = true;
    } else {
      Object.assign(this, className);
    }
    return this;
  },
  invert() {
    Object.keys(this).forEach(key => {
      this[key] = !this[key];
    });
    return this;
  },
  toString() {
    return Object.keys(this).filter(key => this[key]).join(' ');
  }
};
function classSet(config) {
  if (typeof config === 'string') {
    const key = config;
    config = {};
    config[key] = true;
  }
  return Object.assign(Object.create(proto), config);
}

/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

const inputableNode = /input|select|textarea|button|object/;
function visible(element) {
  const {
    width,
    height
  } = element.getBoundingClientRect();
  const noZeroSize = width > 0 || height > 0;
  return noZeroSize && window.getComputedStyle(element).visibility !== 'hidden';
}
function focusable(element) {
  const nodeName = element.tagName.toLowerCase();
  const res = inputableNode.test(nodeName) && !element.disabled || nodeName === 'a' && element.href;
  return res && visible(element);
}
function tabbable(element) {
  const isDataActionable = element.getAttribute('data-navigation') === 'enable';
  const tabIndex = element.tabIndex;
  return tabIndex >= 0 && focusable(element) || isDataActionable;
}
function queryFocusable(element) {
  return [].slice.call(element.querySelectorAll('*'), 0).filter(tabbable);
}

/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

function formatLabel(str) {
  const args = Array.prototype.slice.call(arguments, 1);
  let replacements = args;
  if (Array.isArray(args[0])) {
    [replacements] = args;
  }
  return str.replace(/{(\d+)}/g, (match, i) => {
    return replacements[i];
  });
}

export { classSet, formatLabel, queryFocusable };