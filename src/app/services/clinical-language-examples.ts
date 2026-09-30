export interface ClinicalLanguageExample {
  path: string;
  text: string;
  inputType?: string;
  children?: string[];
  language: string;
}

export const CLINICAL_LANGUAGE_EXAMPLES: ClinicalLanguageExample[] = [
  {
    path: 'Abdominal Pain',
    text: 'Radiation',
    children: ['Does not move', 'Pain radiates to'],
    language: '%',
  },
  {
    path: 'Abdominal Pain > Associated symptoms',
    text: 'Change in appetite',
    children: ['Increased', 'Decreased'],
    language: '%',
  },
  {
    path: 'Abdominal Pain > Associated symptoms > Vaginal discharge [describe]',
    text: 'Smell of the discharge',
    children: ['Yes', 'No'],
    language: '%',
  },

  {
    path: 'Abdominal Pain > Radiation',
    text: 'Does not move',
    language: 'Pain does not radiate',
  },
  {
    path: 'Abdominal Pain > Associated symptoms > Change in appetite',
    text: 'Increased',
    language: 'Increase in appetite',
  },
  {
    path: 'Abdominal Pain > Associated symptoms > Change in appetite',
    text: 'Decreased',
    language: 'Decrease in appetite',
  },
  {
    path: 'Abdominal Pain > Associated symptoms > Vaginal discharge [describe] > Smell of the discharge',
    text: 'Yes',
    language: 'Foul-smelling vaginal discharge present',
  },
  {
    path: 'Abdominal Pain > Associated symptoms > Vaginal discharge [describe] > Smell of the discharge',
    text: 'No',
    language: 'No foul-smelling vaginal discharge',
  },
  {
    path: 'Abdominal Pain > Exacerbating Factors',
    text: "Don't know/Unsure",
    language: 'Patient did not know/was unsure',
  },

  {
    path: 'Abdominal Pain > Duration',
    text: '[Enter since when]',
    inputType: 'duration',
    language: 'since',
  },
  {
    path: 'Abdominal Pain > Relieving Factors',
    text: 'Medications [describe]',
    inputType: 'text',
    language: 'medications such as',
  },
  {
    path: 'Abdominal Pain > Associated symptoms',
    text: 'Change in frequency of urination [describe]',
    inputType: 'text',
    language: 'change in frequency of urination',
  },
  {
    path: 'Abdominal Pain > Associated symptoms',
    text: 'Color change in urine [describe]',
    inputType: 'text',
    language: 'Color change in urine',
  },
  {
    path: 'Abdominal Pain > Menstrual history > Is menstruating',
    text: 'Last menstruation period',
    inputType: 'date',
    language: 'LMP',
  },

  {
    path: 'Physical Exam > Ear > Bleeding > Is there any bleeding from ear?*',
    text: 'Take a picture',
    inputType: 'camera',
    language: '[picture taken]',
  },
  {
    path: 'Physical Exam',
    text: 'Ear',
    children: ['Bleeding', 'Discharge', 'Redness', 'Swelling'],
    language: 'Ear:',
  },
  {
    path: 'Physical Exam > Any Location',
    text: 'Injury Abrasion',
    children: ['Is there any abrasion? *'],
    language: 'Injury abrasion:',
  },
  {
    path: 'Physical Exam > Ear > Redness > Is there any redness in the ear?*',
    text: 'Yes',
    language: 'Redness seen in ear',
  },
  {
    path: 'Physical Exam > Abdomen > Tenderness > Is there abdominal tenderness?*',
    text: 'No tenderness',
    language: 'no tenderness',
  },
  {
    path: 'Physical Exam > General exams > Ankle > Is there ankle oedema?',
    text: 'No oedema',
    language: 'no pedal oedema',
  },

  {
    path: 'Abdominal Pain > Onset',
    text: 'Other [describe]',
    inputType: 'text',
    language: '%',
  },
  {
    path: 'Abdominal Pain > Additional information',
    text: '[Enter additional information]',
    inputType: 'text',
    language: '%',
  },
];
