import { Directive, Input } from '@angular/core';
import { Validator, AbstractControl, ValidationErrors, NG_VALIDATORS } from '@angular/forms';
import { REGEXP } from 'share-libs/src/const';
import { UtilRegValidator } from 'share-libs/src/utils';

@Directive({
  selector: '[loginValiate]',
  providers: [{ provide: NG_VALIDATORS, useExisting: LoginValiateDirective, multi: true }]
})
export class LoginValiateDirective implements Validator {
  validate(control: AbstractControl): ValidationErrors {
    let result = UtilRegValidator(REGEXP.phone.reg)(control);
    return result ? { 'errMsg': { value: "请输入正确的手机号码" } } : null;
  }
  constructor() { }

}
