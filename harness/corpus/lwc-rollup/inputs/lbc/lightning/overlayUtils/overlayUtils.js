/*
 * Copyright (c) 2025, Salesforce, Inc.,
 * All rights reserved.
 * For full license text, see the LICENSE.txt file
 */
const parent = Symbol('parent');
const instanceName = Symbol('instanceName');
const secure = Symbol('secure event');
const properties = Symbol('properties');
const requiredProperties = Symbol('requiredProperties');
function normalizeStyle(style) {
  const props = {};
  if (typeof style === 'string') {
    const regex = /([\w-]*)\s*:\s*([^;]*)/g;
    let match;
    while (match = regex.exec(style)) {
      if (match[1].startsWith('--')) {
        props[match[1]] = match[2].trim();
      } else {
        console.warn(`Overlay 'style' only supports CSS Variables (invalid '${match[1]}' set)`);
      }
    }
  } else if (style && typeof style === 'object') {
    Object.keys(style).forEach(property => {
      if (property.startsWith('--') && typeof style[property] === 'string') {
        props[property] = style[property];
      } else {
        console.warn(`Overlay 'style' only supports CSS Variables (invalid '${property}' set)`);
      }
    });
  }
  return Object.keys(props).map(property => {
    return `${property}:${props[property]}`;
  }).join(';');
}
function normalizeApis(apis) {
  if (apis && typeof apis === 'object') {
    const normalizedApis = {
      ...apis
    };
    if (apis.style) {
      normalizedApis.style = normalizeStyle(apis.style);
    }
    return normalizedApis;
  }
  return {};
}

export { instanceName, normalizeApis, normalizeStyle, parent, properties, requiredProperties, secure };