/*
 * Copyright (c) 2025, Salesforce, Inc.,
 * All rights reserved.
 * For full license text, see the LICENSE.txt file
 */
const contextWeakMap = new WeakMap();
function createPrivateContext() {
  return {
    setContext: (instance, store = {}) => {
      contextWeakMap.set(instance, store);
    },
    getContext: instance => {
      return contextWeakMap.get(instance);
    },
    assertContext: instance => {
      if (!contextWeakMap.has(instance)) {
        throw new TypeError('Invalid `this`. This function can only be invoked as a method of the component that defined it.');
      }
    }
  };
}
const privateContext = createPrivateContext();

export { createPrivateContext, privateContext };