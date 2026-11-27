import { registerDecorators as _registerDecorators } from "lwc";
import _tmpl from "./buttonIconStatefulRecipes.html";
/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
import { LightningElement, registerComponent as _registerComponent } from 'lwc';
class IconRecipes extends LightningElement {
  constructor(...args) {
    super(...args);
    this.likeState = false;
    this.answerState = false;
    this.likeStateInverse = false;
    this.answerStateInverse = false;
    this.likeStateFilled = false;
    this.answerStateFilled = false;
  }
  handleLikeButtonClick() {
    this.likeState = !this.likeState;
  }
  handleAnswerButtonClick() {
    this.answerState = !this.answerState;
  }
  handleLikeButtonInverseClick() {
    this.likeStateInverse = !this.likeStateInverse;
  }
  handleAnswerButtonInverseClick() {
    this.answerStateInverse = !this.answerStateInverse;
  }
  handleLikeButtonFilledClick() {
    this.likeStateFilled = !this.likeStateFilled;
  }
  handleAnswerButtonFilledClick() {
    this.answerStateFilled = !this.answerStateFilled;
  }
  /*LWC compiler v9.5.3*/
}
_registerDecorators(IconRecipes, {
  track: {
    likeState: 1,
    answerState: 1,
    likeStateInverse: 1,
    answerStateInverse: 1,
    likeStateFilled: 1,
    answerStateFilled: 1
  }
});
const __lwc_component_class_internal = _registerComponent(IconRecipes, {
  tmpl: _tmpl,
  sel: "c-button-icon-stateful-recipes",
  apiVersion: 66
});
export default __lwc_component_class_internal;