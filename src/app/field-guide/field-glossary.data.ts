export interface FieldOption {
  value: string;
  meaning: string;
}

export interface FieldDefinition {
  key: string;
  label: string;
  plainLabel: string;
  type: string;
  required?: boolean;
  conditional?: string;
  description: string;
  example?: string;
  options?: FieldOption[];
}

export interface FieldSection {
  section: string;
  icon: string;
  fields: FieldDefinition[];
}

export const FIELD_GLOSSARY: FieldSection[] = [
  {
    section: 'Basic Node Information',
    icon: 'bi-file-text',
    fields: [
      {
        key: 'topic',
        label: 'Node Text',
        plainLabel: 'Question or Answer Text',
        type: 'Text',
        required: true,
        description:
          'The main text displayed on the mind map node. This is the clinical question or answer option that the healthcare worker will read aloud to the patient.',
        example: 'Do you have a headache?'
      },
      {
        key: 'display',
        label: 'Display (English)',
        plainLabel: 'Friendly Display Name',
        type: 'Text',
        description:
          'An alternative, human-readable label shown in the app interface. Use this when the node text is a code or abbreviation and you want a clearer name displayed.',
        example: 'Headache'
      },
      {
        key: 'index',
        label: 'Index',
        plainLabel: 'Question Order Number',
        type: 'Number',
        description:
          'Controls the display order of this node among its sibling nodes. A lower number appears first. Shown as a numbered badge on the mind map node.',
        example: '1'
      },
      {
        key: 'language',
        label: 'Language (History Note)',
        plainLabel: 'Text Recorded in Patient History',
        type: 'Text',
        description:
          'The text written into the patient\'s clinical history note when this option is selected. This is what the doctor reads in the patient record — make it clear and professional.',
        example: 'Patient reports headache persisting for 3 days'
      }
    ]
  },
  {
    section: 'Input & Response Type',
    icon: 'bi-ui-radios',
    fields: [
      {
        key: 'input_type',
        label: 'Input Type',
        plainLabel: 'How the Patient Gives Their Answer',
        type: 'Dropdown',
        description:
          'Determines what kind of response the patient can give. Choosing the right type ensures the app collects data in a clinically useful format.',
        options: [
          { value: 'text', meaning: 'Free-text typed answer (e.g., describe your pain)' },
          { value: 'number', meaning: 'Whole number entry (e.g., 5 tablets, 3 episodes)' },
          { value: 'decimal', meaning: 'Decimal number (e.g., 36.5°C body temperature)' },
          { value: 'date', meaning: 'Calendar date picker (e.g., date symptoms started)' },
          { value: 'duration', meaning: 'Time duration entry (e.g., 3 days, 2 weeks)' },
          { value: 'camera', meaning: 'Photo capture using device camera' },
          { value: 'frequency', meaning: 'How often something occurs (e.g., 3 times per day)' },
          { value: 'range', meaning: 'A numeric value within a defined minimum–maximum range' }
        ]
      },
      {
        key: 'range_min',
        label: 'Range Min',
        plainLabel: 'Minimum Acceptable Value',
        type: 'Number',
        conditional: 'Visible only when Input Type is "range"',
        description:
          'The lowest valid value when input type is set to "range". Any entry below this value will be flagged as invalid.',
        example: '0 (for measurements like blood pressure, weight)'
      },
      {
        key: 'range_max',
        label: 'Range Max',
        plainLabel: 'Maximum Acceptable Value',
        type: 'Number',
        conditional: 'Visible only when Input Type is "range"',
        description:
          'The highest valid value when input type is set to "range". Any entry above this value will be flagged as invalid.',
        example: '300 (for systolic blood pressure in mmHg)'
      },
      {
        key: 'is_exclusive',
        label: 'Is Exclusive (Camera)',
        plainLabel: 'Camera-Only Answer Mode',
        type: 'Yes / No',
        conditional: 'Visible only when Input Type is "camera"',
        description:
          'When set to Yes, this node can only be answered by taking a photo — typing or other input is not accepted. Use when visual evidence is medically required.',
        example: 'Yes — for wound or rash documentation'
      }
    ]
  },
  {
    section: 'Patient Eligibility Restrictions',
    icon: 'bi-person-check',
    fields: [
      {
        key: 'gender',
        label: 'Gender',
        plainLabel: 'Show This Question Only For',
        type: 'Dropdown',
        description:
          'Restricts this question to patients of a specific biological sex. Leave blank to show the question to all patients regardless of gender.',
        options: [
          { value: '(blank)', meaning: 'No restriction — shown to all patients' },
          { value: '1 — Male', meaning: 'Show only to male patients' },
          { value: '0 — Female', meaning: 'Show only to female patients' },
          { value: '2 — Other', meaning: 'Show only to patients recorded as Other gender' }
        ]
      },
      {
        key: 'age_min',
        label: 'Age Min (Years / Months / Days)',
        plainLabel: 'Minimum Patient Age to See This Question',
        type: 'Three dropdowns: Years, Months, Days',
        description:
          'The youngest a patient must be for this question to appear. Leave all three dropdowns blank (or at zero) to apply no minimum age restriction.',
        example: '2 years 0 months 0 days — question appears only for patients aged 2 and above'
      },
      {
        key: 'age_max',
        label: 'Age Max (Years / Months / Days)',
        plainLabel: 'Maximum Patient Age to See This Question',
        type: 'Three dropdowns: Years, Months, Days',
        description:
          'The oldest a patient can be for this question to appear. Leave all three dropdowns blank (or at zero) to apply no maximum age restriction.',
        example: '12 years 0 months 0 days — question appears only for patients aged 12 and below'
      }
    ]
  },
  {
    section: 'Question Behaviour Settings',
    icon: 'bi-toggles',
    fields: [
      {
        key: 'isRequired',
        label: 'Is Required',
        plainLabel: 'Mandatory — Cannot Be Skipped',
        type: 'Yes / No',
        description:
          'When set to Yes, the healthcare worker must answer this question before moving on. The app shows an error message if it is left blank.',
        example: 'Yes — for chief complaint or critical triage questions'
      },
      {
        key: 'multi_choice',
        label: 'Multi Choice',
        plainLabel: 'Allow Multiple Answers at Once',
        type: 'Yes / No',
        description:
          'When set to Yes, the patient can select more than one answer option simultaneously. Use for symptom lists where several can be true at the same time.',
        example: 'Yes — "Which symptoms do you have?" (cough, fever, headache can all be selected)'
      },
      {
        key: 'exclude_from_multi_choice',
        label: 'Exclude From Multi Choice',
        plainLabel: '"None of the Above" Option Behaviour',
        type: 'Yes / No',
        description:
          'When set to Yes, selecting this option automatically deselects all other choices. Apply this to "None" or "None of the above" answer nodes.',
        example: 'Yes — for an option labelled "No other symptoms"'
      },
      {
        key: 'having_nested_question',
        label: 'Having Nested Question',
        plainLabel: 'Has Follow-up Sub-questions',
        type: 'Yes / No',
        description:
          'When set to Yes, selecting this node reveals additional child questions beneath it. Use when an answer leads to deeper clinical investigation.',
        example: 'Yes — selecting "Yes, I have chest pain" reveals follow-up questions about its nature'
      },
      {
        key: 'enable_exclusive_option',
        label: 'Enable Exclusive Option',
        plainLabel: 'Allow One "Select This Only" Choice',
        type: 'Yes / No',
        description:
          'When set to Yes on a parent question, it activates the exclusive-option mechanism. One child answer can then be marked as "Is Exclusive Option" (see below).',
        example: 'Yes — on a parent symptom question that includes a "Not applicable" child option'
      },
      {
        key: 'is_exclusive_option',
        label: 'Is Exclusive Option',
        plainLabel: 'This Answer Clears All Other Selections',
        type: 'Yes / No',
        description:
          'When set to Yes, selecting this answer automatically deselects every other selected option. Use for mutually exclusive responses like "Not applicable" or "Patient refused".',
        example: 'Yes — for a child option labelled "Not applicable" or "Patient refused to answer"'
      },
      {
        key: 'compare_duplicate_node',
        label: 'Compare Duplicate Node',
        plainLabel: 'Prevent Duplicate Entry — Link to Another Node',
        type: 'Text',
        description:
          'Enter the ID (node text key) of another node. The app compares this node\'s answer with that node to prevent the same data being entered twice.',
        example: 'chief_complaint — links to the chief complaint node to avoid repeating the same symptom'
      }
    ]
  },
  {
    section: 'Translations',
    icon: 'bi-translate',
    fields: [
      {
        key: 'display_hi',
        label: 'Display (Hindi)',
        plainLabel: 'Hindi Label',
        type: 'Text',
        description:
          'The Hindi translation of this node\'s label. Shown to patients and healthcare workers when the app language is set to Hindi.',
        example: 'क्या आपको सिरदर्द है?'
      },
      {
        key: 'display_or',
        label: 'Display (Odiya)',
        plainLabel: 'Odia Label',
        type: 'Text',
        description:
          'The Odia translation of this node\'s label. Shown when the app language is set to Odia.',
        example: 'ଆପଣଙ୍କୁ ମୁଣ୍ଡ ବ୍ୟଥା ଅଛି କି?'
      },
      {
        key: 'display_mr',
        label: 'Display (Marathi)',
        plainLabel: 'Marathi Label',
        type: 'Text',
        description:
          'The Marathi translation of this node\'s label. Shown when the app language is set to Marathi.',
        example: 'तुम्हाला डोकेदुखी आहे का?'
      }
    ]
  },
  {
    section: 'Triggers & Clinical Job Aids',
    icon: 'bi-lightning',
    fields: [
      {
        key: 'perform_physical_exam',
        label: 'Perform Physical Exam',
        plainLabel: 'Physical Examination Instruction',
        type: 'Text (multi-line)',
        description:
          'An instruction displayed to the healthcare worker telling them to perform a specific physical examination when this question is reached. The patient does not see this message.',
        example: 'Measure blood pressure in both arms and record both readings'
      },
      {
        key: 'job_aid_type',
        label: 'Job Aid Type',
        plainLabel: 'Reference Material Format',
        type: 'Text',
        description:
          'The file format of the supporting reference material (job aid) attached to this node. Tells the app how to display it.',
        example: 'image, video, pdf'
      },
      {
        key: 'job_aid_file',
        label: 'Job Aid File',
        plainLabel: 'Reference Material File Name',
        type: 'Text',
        description:
          'The file name or path of the job aid resource shown to the healthcare worker as a visual reference or guidance document.',
        example: 'bp_measurement_guide.png'
      }
    ]
  },
  {
    section: 'Alerts & Pop-up Messages',
    icon: 'bi-bell',
    fields: [
      {
        key: 'pop_up',
        label: 'Pop Up (English)',
        plainLabel: 'Alert Message in English',
        type: 'Text (multi-line)',
        description:
          'A warning or alert message shown to the healthcare worker in English when this option is selected. Use for urgent clinical warnings, referral triggers, or important reminders.',
        example: 'URGENT: Refer patient to higher-level facility immediately'
      },
      {
        key: 'pop_up_hi',
        label: 'Pop Up (Hindi)',
        plainLabel: 'Alert Message in Hindi',
        type: 'Text (multi-line)',
        description: 'Hindi translation of the alert message. Shown when the app language is set to Hindi.',
        example: 'तत्काल उच्च स्वास्थ्य सुविधा में रेफर करें'
      },
      {
        key: 'pop_up_or',
        label: 'Pop Up (Odiya)',
        plainLabel: 'Alert Message in Odia',
        type: 'Text (multi-line)',
        description: 'Odia translation of the alert message. Shown when the app language is set to Odia.',
        example: 'ତୁରନ୍ତ ଉଚ୍ଚ ସ୍ୱାସ୍ଥ୍ୟ ଅନୁଷ୍ଠାନକୁ ପ୍ରେରଣ କରନ୍ତୁ'
      },
      {
        key: 'pop_up_mr',
        label: 'Pop Up (Marathi)',
        plainLabel: 'Alert Message in Marathi',
        type: 'Text (multi-line)',
        description: 'Marathi translation of the alert message. Shown when the app language is set to Marathi.',
        example: 'त्वरित उच्च आरोग्य केंद्राकडे पाठवा'
      }
    ]
  },
  {
    section: 'Medical Codes & Clinical References',
    icon: 'bi-journal-medical',
    fields: [
      {
        key: 'citation',
        label: 'Citation / उद्धरण',
        plainLabel: 'Medical Evidence Source (Required)',
        type: 'Text (multi-line)',
        required: true,
        description:
          'The published clinical guideline, protocol, or peer-reviewed reference that justifies including this question or answer. This field is mandatory for every node — protocol authors must provide the evidence base.',
        example: 'WHO Integrated Management of Childhood Illness (IMCI) Guidelines, 2014, Section 3, Page 12'
      },
      {
        key: 'snomed',
        label: 'SNOMED',
        plainLabel: 'SNOMED CT Code',
        type: 'Text',
        description:
          'The SNOMED CT (Systematized Nomenclature of Medicine – Clinical Terms) code for this clinical concept. Used for interoperability and data exchange with other health information systems.',
        example: '25064002 (Headache)'
      },
      {
        key: 'icd_11',
        label: 'ICD-11',
        plainLabel: 'ICD-11 Diagnosis Code',
        type: 'Text',
        description:
          'The ICD-11 (International Classification of Diseases, 11th Revision) code for standardised disease classification and public health reporting.',
        example: 'MG30.0 (Headache)'
      },
      {
        key: 'loinc',
        label: 'LOINC',
        plainLabel: 'LOINC Observation Code',
        type: 'Text',
        description:
          'The LOINC (Logical Observation Identifiers Names and Codes) code for clinical observations, lab tests, or vital sign measurements.',
        example: '8867-4 (Heart rate)'
      }
    ]
  },
  {
    section: 'Conditional Display Logic',
    icon: 'bi-diagram-3',
    fields: [
      {
        key: 'pos_condition',
        label: 'Positive Condition',
        plainLabel: 'Show When a Previous Answer Was YES',
        type: 'Text',
        conditional: 'Visible only for "Associated symptoms" nodes',
        description:
          'A logical expression controlling when this node appears based on a positive (YES/selected) response to an earlier question. Written as a clinical logic expression.',
        example: 'fever == true AND cough == true'
      },
      {
        key: 'neg_condition',
        label: 'Negative Condition',
        plainLabel: 'Show When a Previous Answer Was NO',
        type: 'Text',
        conditional: 'Visible only for "Associated symptoms" nodes',
        description:
          'A logical expression controlling when this node appears based on a negative (NO/not-selected) response to an earlier question.',
        example: 'rash == false'
      }
    ]
  }
];
