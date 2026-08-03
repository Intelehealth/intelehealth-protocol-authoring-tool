import { Injectable } from '@angular/core';
import { AbstractControl, ValidatorFn } from '@angular/forms';
import { ValidationErrors } from '@angular/forms';

export const AgeCompareValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  // NOTE Safety check
  if (!control.get('txtAgeMin')?.value || !control.get('txtAgeMax')?.value) {
    return null;
  }

  // NOTE Compare fields
  const mStart = control.get('txtAgeMin')?.value;
  const mEnd = control.get('txtAgeMax')?.value;
  const isValid = parseFloat(mStart) < parseFloat(mEnd);

  // NOTE Invalid
  if (!isValid) return { invalidDateRange: true };

  // NOTE Valid
  return null;
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
