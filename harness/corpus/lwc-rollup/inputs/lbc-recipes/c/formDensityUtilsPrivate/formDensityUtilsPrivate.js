import '@salesforce/i18n/locale';
import { getOneConfig } from 'lightning/configProvider';

/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

function normalizeString(value, config = {}) {
  const {
    fallbackValue = '',
    validValues,
    toLowerCase = true
  } = config;
  let normalized = typeof value === 'string' && value.trim() || '';
  normalized = toLowerCase ? normalized.toLowerCase() : normalized;
  if (validValues && validValues.indexOf(normalized) === -1) {
    normalized = fallbackValue;
  }
  return normalized;
}

/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

function timeout(interval) {
  return new Promise(resolve => {
    // eslint-disable-next-line @lwc/lwc/no-async-operation
    setTimeout(resolve, interval);
  });
}
function animationFrame() {
  return new Promise(resolve => {
    // eslint-disable-next-line @lwc/lwc/no-async-operation
    window.requestAnimationFrame(resolve);
  });
}

/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

const DELAY_TIMEOUT = 200;
class LightningResizeObserver {
  constructor(resizeCallback) {
    this._resizeObserverAvailable = typeof ResizeObserver === 'function';
    const delayedCallback = callback => {
      if (this._running) {
        return;
      }
      this._running = true;
      timeout(DELAY_TIMEOUT).then(() => animationFrame()).then(() => {
        callback();
        this._running = false;
      });
    };
    this._delayedResizeCallback = delayedCallback.bind(this, resizeCallback);
    if (this._resizeObserverAvailable) {
      this._resizeObserver = new ResizeObserver(this._delayedResizeCallback);
    }
  }
  observe(lightningElement) {
    // eslint-disable-next-line @lwc/lwc/no-async-operation
    this._requestAnimationId = requestAnimationFrame(() => {
      if (this._resizeObserverAvailable) {
        this._resizeObserver.observe(lightningElement);
      } else if (!this._hasWindowResizeHandler) {
        window.addEventListener('resize', this._delayedResizeCallback);
        this._hasWindowResizeHandler = true;
      }
    });
  }
  disconnect() {
    if (this._resizeObserver) {
      this._resizeObserver.disconnect();
    }
    if (this._requestAnimationId) {
      cancelAnimationFrame(this._requestAnimationId);
    }
    window.removeEventListener('resize', this._delayedResizeCallback);
    this._hasWindowResizeHandler = false;
  }
}

/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

const APP_DENSIFICATION_BREAKPOINT = 650;
const appDensityValues = {
  COMFY: 'VIEW_ONE'};

/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

const DensityValues = {
  COMFY: 'comfy',
  COMPACT: 'compact',
  AUTO: 'auto'
};
const LabelAlignValues = {
  STACKED: 'stacked',
  HORIZONTAL: 'horizontal'
};

/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

const labelAlignValues = LabelAlignValues;
const densityValues = DensityValues;

/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

function doNormalization(val, cmpInterface) {
  const normalized = normalizeString(val, {
    fallbackValue: densityValues.AUTO,
    validValues: [densityValues.AUTO, densityValues.COMPACT, densityValues.COMFY]
  });
  cmpInterface.setDensityPrivate(normalized);
  setLabelAlignment(cmpInterface);
}
function setLabelAlignment(cmpInterface) {
  const fieldLabelAlignment = cmpInterface.getLabelAlignmentPrivate();
  if (isDensityComfy(cmpInterface)) {
    if (fieldLabelAlignment !== labelAlignValues.STACKED) {
      cmpInterface.setLabelAlignmentPrivate(labelAlignValues.STACKED);
      wireLabelAlignment(cmpInterface);
    }
  } else if (isDensityCompact(cmpInterface)) {
    if (fieldLabelAlignment !== labelAlignValues.HORIZONTAL) {
      cmpInterface.setLabelAlignmentPrivate(labelAlignValues.HORIZONTAL);
      wireLabelAlignment(cmpInterface);
    }
  }
}
function resetResizeObserver(cmp, cmpInterface, isInitialRender) {
  if (cmp._resizeObserver && !isWiredDensityAuto(cmpInterface)) {
    cmp._resizeObserver.disconnect();
    cmp._resizeObserver = undefined;
  } else if (isWiredDensityAuto(cmpInterface)) {
    if (isInitialRender) {
      resizeObserverCallback(cmpInterface);
    }
    cmp._resizeObserver = setupResizeObserver(cmpInterface);
  }
}
function disconnectResizeObserver(cmp) {
  if (cmp._resizeObserver) {
    cmp._resizeObserver.disconnect();
    cmp._resizeObserver = undefined;
  }
}
function isWiredDensityAuto(cmpInterface) {
  const density = cmpInterface.getDensityPrivate();
  const wiredDensity = getOneConfig().densitySetting;
  return density === densityValues.AUTO && wiredDensity !== appDensityValues.COMFY;
}
function isDensityComfy(cmpInterface) {
  const density = cmpInterface.getDensityPrivate();
  return density === densityValues.AUTO && getOneConfig().densitySetting === appDensityValues.COMFY || density === densityValues.COMFY;
}
function isDensityCompact(cmpInterface) {
  const density = cmpInterface.getDensityPrivate();
  return isWiredDensityAuto(cmpInterface) || density === densityValues.COMPACT;
}
function setupResizeObserver(cmpInterface) {
  const containerEle = cmpInterface.getContainerElement();
  const resizeObserver = new LightningResizeObserver(cmpInterface.getResizeObserverCallback(resizeObserverCallback));
  resizeObserver.observe(containerEle);
  return resizeObserver;
}
function resizeObserverCallback(cmpInterface) {
  const containerEle = cmpInterface.getContainerElement();
  if (containerEle && containerEle.clientWidth) {
    const containerWidth = containerEle.getBoundingClientRect().width;
    const fieldLabelAlignment = cmpInterface.getLabelAlignmentPrivate();
    let alignmentChanged = false;
    if (containerWidth < APP_DENSIFICATION_BREAKPOINT && fieldLabelAlignment !== labelAlignValues.STACKED) {
      cmpInterface.setLabelAlignmentPrivate(labelAlignValues.STACKED);
      alignmentChanged = true;
    }
    if (containerWidth >= APP_DENSIFICATION_BREAKPOINT && fieldLabelAlignment !== labelAlignValues.HORIZONTAL) {
      cmpInterface.setLabelAlignmentPrivate(labelAlignValues.HORIZONTAL);
      alignmentChanged = true;
    }
    if (alignmentChanged) {
      wireLabelAlignment(cmpInterface);
    }
  }
}
function wireLabelAlignment(cmpInterface) {
  const recordUi = cmpInterface.getRecordUi();
  if (recordUi) {
    const fields = cmpInterface.getInputOutputFields();
    recordUi.labelAlignment = cmpInterface.getLabelAlignmentPrivate();
    for (let i = 0; i < fields.length; i += 1) {
      fields[i].wireRecordUi(recordUi);
    }
  }
}

export { disconnectResizeObserver, doNormalization, resetResizeObserver, resizeObserverCallback, setLabelAlignment };