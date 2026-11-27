/*
 * Copyright (c) 2025, Salesforce, Inc.,
 * All rights reserved.
 * For full license text, see the LICENSE.txt file
 */
import DOMPurify from './purify.js';
import { features } from 'lightning/features';
export default function sanitizeHTML(dirty, config) {
  if (features.enableaftersanitizationhook) {
    const hook = config?.hook?.afterSanitizeAttributes;
    if (hook) {
      DOMPurify.addHook('afterSanitizeAttributes', hook);
    }
    try {
      return DOMPurify.sanitize(dirty, config);
    } finally {
      if (hook) {
        DOMPurify.removeHook('afterSanitizeAttributes', hook);
      }
    }
  }
  return DOMPurify.sanitize(dirty, config);
}