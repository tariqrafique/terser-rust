import { registerDecorators as _registerDecorators } from "lwc";
import _tmpl from "./progressIndicator.html";
/*
 * Copyright (c) 2025, Salesforce, Inc.,
 * All rights reserved.
 * For full license text, see the LICENSE.txt file
 */
import { registerComponent as _registerComponent } from 'lwc';
import LightningShadowBaseClass from 'lightning/shadowBaseClassPrivate';
import { classSet, formatLabel } from 'lightning/utils';
import pathCurrentStage from '@salesforce/label/LightningProgressIndicator.pathCurrentStage';
import { getStepIndex, getCurrentStepIndex, computeProgressValue } from './utils';
import base from './base.html';
import path from './path.html';
import progressIndicatorStylesheets from './progressIndicator.css';
import { features } from 'lightning/features';
import { privateContext } from 'lightning/utilsInternal';
const {
  setContext,
  assertContext
} = privateContext;
const i18n = {
  currentStageLabel: pathCurrentStage
};
const STATE_COMPLETED = 'completed';
const STATE_CURRENT = 'current';
const STATE_INCOMPLETE = 'incomplete';
const STATE_ERROR = 'error';
const LEFT = 37;
const UP = 38;
const RIGHT = 39;
const DOWN = 40;
class LightningProgressIndicator extends LightningShadowBaseClass {
  get currentStep() {
    return this.privateCurrentStep;
  }
  set currentStep(value) {
    if (features.enableAssertContext260Round2) {
      assertContext(this);
    }
    this.privateCurrentStep = value;
    if (this.privateRendered) {
      this.updateSteps(value);
    }
  }
  get i18n() {
    return i18n;
  }
  get currentStepLabel() {
    return formatLabel(this.i18n.currentStageLabel, this._currentStepLabel);
  }
  get hasError() {
    return this.privateHasError;
  }
  set hasError(value) {
    this.privateHasError = value;
    if (!import.meta.env.SSR) {
      Promise.resolve().then(() => {
        this.updateSteps();
      });
    }
  }
  constructor() {
    super();
    this.type = 'base';
    this.variant = 'base';
    this.ariaLabel = void 0;
    this.privateStepHandlers = {};
    this.privateProgressValue = 0;
    this.privateTooltipHidden = true;
    this.privateTooltipLabel = void 0;
    this.privateActiveStepIndex = void 0;
    this.privateTooltipElement = void 0;
    this.privateRendered = false;
    this.privateCurrentStep = void 0;
    this.privateHasError = void 0;
    this._currentStepLabel = '';
    setContext(this);
  }
  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('privateregisterstep', event => {
      const {
        stepName,
        callback
      } = event.detail;
      this.privateStepHandlers[stepName] = callback;
    });
  }
  renderedCallback() {
    this.privateRendered = true;
    Promise.resolve().then(() => {
      this.updateSteps();
    });
  }
  handleSlotChange() {
    this.updateSteps();
  }
  updateSteps(activeStep, shouldFocus) {
    const steps = this.getSteps();
    const {
      privateStepHandlers,
      type,
      hasError,
      currentStep
    } = this;
    const currentStepIndex = getCurrentStepIndex(steps, currentStep);
    this._currentStepLabel = steps[currentStepIndex]?.label;
    let activeStepIndex = -1;
    if (activeStep) {
      activeStepIndex = getStepIndex(steps, activeStep);
    } else if (this.privateActiveStepIndex !== undefined) {
      activeStepIndex = this.privateActiveStepIndex;
    } else {
      activeStepIndex = getStepIndex(steps, this.privateCurrentStep);
    }
    this.privateActiveStepIndex = activeStepIndex;
    const stepsArray = Array.prototype.slice.call(steps);
    stepsArray.forEach((step, index) => {
      const stepName = step.value;
      const isActive = index === this.privateActiveStepIndex;
      if (index < currentStepIndex) {
        privateStepHandlers[stepName](STATE_COMPLETED, type, index, isActive, shouldFocus);
      } else if (index === currentStepIndex) {
        const state = hasError ? STATE_ERROR : STATE_CURRENT;
        privateStepHandlers[stepName](state, type, index, isActive, shouldFocus);
      } else {
        privateStepHandlers[stepName](STATE_INCOMPLETE, type, index, isActive, shouldFocus);
      }
    });
    if (this.isBase) {
      this.privateProgressValue = computeProgressValue(steps, currentStepIndex);
    }
  }
  isActive(stepName) {
    return this.currentStep === stepName;
  }
  getSteps() {
    if (!import.meta.env.SSR) {
      return Array.from(this.querySelectorAll('lightning-progress-step'));
    }
    return null;
  }
  handleStepFocus(event) {
    if (!this.isBase) {
      this.updateActiveStepStatus(event.target);
    }
  }
  handleStepKeyDown(event) {
    if (this.privateActiveStepIndex >= 0) {
      const steps = this.getSteps();
      switch (event.keyCode) {
        case UP:
        case LEFT:
          if (this.privateActiveStepIndex - 1 >= 0) {
            this.updateSteps(steps[this.privateActiveStepIndex - 1].value, true);
          }
          break;
        case DOWN:
        case RIGHT:
          if (this.privateActiveStepIndex + 1 < steps.length) {
            this.updateSteps(steps[this.privateActiveStepIndex + 1].value, true);
          }
          break;
        default:
          break;
      }
    }
  }
  get computedWrapperClass() {
    return classSet('slds-progress').add({
      'slds-progress_shade': this.variant === 'shade'
    });
  }
  get computedTooltipClass() {
    return classSet('slds-popover slds-popover_tooltip slds-nubbin_bottom slds-is-absolute').add({
      'slds-hidden': this.privateTooltipHidden
    });
  }
  updateActiveStepStatus(activeStep) {
    if (this.currentStep !== activeStep) {
      this.updateSteps(activeStep.value);
    }
  }
  get isBase() {
    return this.type === 'base';
  }
  render() {
    if (this.isBase) {
      return base;
    }
    return path;
  }
  /*LWC compiler v9.5.3*/
}
LightningProgressIndicator.stylesheets = [progressIndicatorStylesheets];
_registerDecorators(LightningProgressIndicator, {
  publicProps: {
    type: {
      config: 0
    },
    variant: {
      config: 0
    },
    currentStep: {
      config: 3
    },
    hasError: {
      config: 3
    },
    ariaLabel: {
      config: 0
    }
  },
  track: {
    privateProgressValue: 1,
    privateTooltipHidden: 1,
    privateTooltipLabel: 1,
    privateActiveStepIndex: 1,
    privateTooltipElement: 1,
    privateCurrentStep: 1,
    privateHasError: 1
  },
  fields: ["privateStepHandlers", "privateRendered", "_currentStepLabel"]
});
const __lwc_component_class_internal = _registerComponent(LightningProgressIndicator, {
  tmpl: _tmpl,
  sel: "lightning-progress-indicator",
  apiVersion: 66
});
export default __lwc_component_class_internal;