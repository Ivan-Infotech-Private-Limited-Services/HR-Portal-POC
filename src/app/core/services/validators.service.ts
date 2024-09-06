import { Injectable } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup, NgControl, ValidationErrors, ValidatorFn } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class ValidatorsService {

  static updateForm(
    group: FormGroup | FormControl | FormArray | AbstractControl,
    values: any
  ) {
    if (group instanceof FormControl) {
      group.setValue(values);
    } else if (group instanceof FormGroup) {
      Object.keys(group.controls).forEach((k) => {
        const control = group.get(k);
        if (values && values[k] !== undefined) {
          ValidatorsService.updateForm(control!, values[k]);
        }
      });
    } else if (group instanceof FormArray) {
      group.controls.forEach((c, index) => {
        if (values[index] !== undefined) {
          ValidatorsService.updateForm(c, values[index]);
        }
      });
    }
  }

  private static getError(errorType:any, errorValue?:any){
    switch (errorType) {
      case 'required':
        return `${errorValue?.controlName ?? "this field"} is required.`;

      case 'minlength':
        return `${errorValue?.controlName} must be at least ${errorValue?.requiredLength} characters.`;

      case 'maxlength':
        return `${errorValue?.controlName} cannot exceed ${errorValue?.requiredLength} characters.`;

      case 'pattern':
        return `Invalid ${errorValue?.controlName}.`;

      case 'compare':
        return `Passwords do not match.`;

      default:
        return `Validation error for ${errorValue.controlName}.`;
    }
  }
  constructor() {}

  static ngControlError(errors?: ValidationErrors | null | undefined, controlName?: string) {
    
    for (const error in errors) {
      if (errors.hasOwnProperty(error)) {
        return this.getError(error, {
          controlName,
          ...errors[error]
        }) 
      }
    }
    return null
  }
}
