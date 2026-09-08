import { Injectable } from '@angular/core';
import { AbstractControl, ValidatorFn } from '@angular/forms';
import { ValidationErrors } from '@angular/forms';

export const AgeCompareValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const minYear = control.get('txtAgeMinYear')?.value;
  const minMonths = control.get('txtAgeMinMonths')?.value;
  const minDays = control.get('txtAgeMinDays')?.value;
  const maxYear = control.get('txtAgeMaxYear')?.value;
  const maxMonths = control.get('txtAgeMaxMonths')?.value;
  const maxDays = control.get('txtAgeMaxDays')?.value;

  const errors: ValidationErrors = {};

  const hasMin = minYear != null || minMonths != null || minDays != null;
  const hasMax = maxYear != null || maxMonths != null || maxDays != null;

  if (hasMin && hasMax) {
    const totalMin = ((minYear || 0) * 365) + ((minMonths || 0) * 30) + (minDays || 0);
    const totalMax = ((maxYear || 0) * 365) + ((maxMonths || 0) * 30) + (maxDays || 0);
    if (totalMin >= totalMax) {
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
