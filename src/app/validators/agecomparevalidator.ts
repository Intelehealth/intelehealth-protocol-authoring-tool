import { Injectable } from '@angular/core';
import { AbstractControl, ValidatorFn } from '@angular/forms';
import { ValidationErrors } from '@angular/forms';

export const AgeCompareValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const mStart = control.get('txtAgeMin')?.value;
  const mEnd = control.get('txtAgeMax')?.value;

  const errors: ValidationErrors = {};

  // Check for negative values
  if (mStart && parseFloat(mStart) < 0) {
    errors['negativeAgeMin'] = true;
  }
  if (mEnd && parseFloat(mEnd) < 0) {
    errors['negativeAgeMax'] = true;
  }

  // Compare fields only when both are valid positive numbers
  if (mStart && mEnd && parseFloat(mStart) >= 0 && parseFloat(mEnd) >= 0) {
    if (parseFloat(mStart) >= parseFloat(mEnd)) {
      errors['invalidDateRange'] = true;
    }
  }

  return Object.keys(errors).length ? errors : null;
};

export const RangeCompareValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  if (!control.get('txtRangeMin')?.value || !control.get('txtRangeMax')?.value) {
    return null;
  }

  const rStart = control.get('txtRangeMin')?.value;
  const rEnd = control.get('txtRangeMax')?.value;
  const isValid = parseInt(rStart) < parseInt(rEnd);

  if (!isValid) return { invalidRangeOrder: true };

  return null;
};
