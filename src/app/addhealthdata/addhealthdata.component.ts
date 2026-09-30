import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AgeCompareValidator, RangeCompareValidator } from '../validators/agecomparevalidator';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { IMindMapData } from '../Interfaces/mindmap-interface';
import { MindmapService } from '../services/mindmap.service';
import { ClinicalLanguageService } from '../services/clinical-language.service';
@Component({
  selector: 'app-addhealthdata',
  templateUrl: './addhealthdata.component.html',
  styleUrls: ['./addhealthdata.component.css'],
})
export class AddhealthdataComponent implements OnInit {
  @Output() onSave = new EventEmitter<IMindMapData>();
  @Input() public ancestorPath: string[] = [];
  @Input() public siblingTopics: string[] = [];
  @Input() public parentLanguage: string = '';
  addData: IMindMapData = {
    topic: 'Enter Text',
    input_type: '',
    gender: '',
    isRequired: null as any,
    multi_choice: null as any,
    exclude_from_multi_choice: null as any,
    having_nested_question: null as any,
    enable_exclusive_option: null as any,
    is_exclusive_option: null as any,
    is_exclusive: null as any,
  };

  tooltips = {
    txtText: "The internal node identifier used in the mind map and JSON export. This is the technical key/topic for this question or answer option.",
    txtDisplay: "The English label shown to the health worker on the mobile app screen. If left blank, the Text value is used as the display label.",
    ddisRequired: "Whether the health worker must answer this question before proceeding. Required questions cannot be skipped on the health worker screen.",
    ddMultiChoice: "Allows the health worker to select multiple answers for this question simultaneously on the mobile app.",
    txtDisplayOR: "Odiya translation of the display label shown to the health worker on the mobile app screen.",
    txtDisplayHI: "Hindi translation of the display label shown to the health worker on the mobile app screen.",
    txtDisplayMR: "Marathi translation of the display label shown to the health worker on the mobile app screen.",
    txtpopup: "English alert message shown as a popup to the health worker when this option is selected.",
    txtpopuphi: "Hindi translation of the popup alert shown to the health worker when this option is selected.",
    txtpopupor: "Odiya translation of the popup alert shown to the health worker when this option is selected.",
    txtpopupmr: "Marathi translation of the popup alert shown to the health worker when this option is selected.",
    txtLanguage: "The text or value that appears in the doctor's consultation history note when this option is selected. Controls what the doctor sees, not the health worker.",
    txtInputType: "Defines how the health worker enters a response on the mobile app (e.g., text, number, date picker, camera, range slider).",
    txtGender: "Restricts this question to a specific patient gender. Leave blank to show for all genders on the health worker screen.",
    txtPosCon: "Condition expression that must evaluate to true for this node to be visible. Only applicable for 'Associated symptoms' nodes.",
    txtNegCon: "Condition expression that must evaluate to false for this node to be visible. Only applicable for 'Associated symptoms' nodes.",
    txtPPE: "Physical examination instruction shown to the health worker when this option is selected. Appears as a trigger on the health worker screen.",
    txtcitation: "Medical reference or source supporting this question or option (e.g., clinical guidelines, research papers).",
    txtsnomed: "SNOMED CT code for this clinical concept. Used for standardized medical terminology and interoperability.",
    txticd: "ICD-11 classification code for this condition or finding. Used for medical coding and FHIR export.",
    txtloinc: "LOINC code for this clinical observation or question. Used for lab and clinical data standardization.",
    txtjobaidtype: "Type of job aid resource (e.g., image, video, PDF) displayed to the health worker when this option is selected.",
    txtjobaidfile: "File name or path of the job aid resource shown to the health worker when this option is selected.",
    ddExcludeMultiChoice: "When true, selecting this option on the health worker screen clears all other multi-choice selections (acts as a 'None of the above' option).",
    ddHavingNestedQuestion: "Indicates whether this node has sub-questions. Nested questions appear on the health worker screen after this option is selected.",
    ddEnableExclusiveOption: "Enables an exclusive answer option for this question. When an exclusive option is selected, all other selections are cleared on the health worker screen.",
    txtCompareDuplicateNode: "ID of another node to compare against for duplicate answers. Used to detect when the same value is entered in multiple places.",
    ddIsExclusiveOption: "Marks this specific option as exclusive. Selecting it on the health worker screen will deselect all other chosen options.",
    ddIsExclusive: "When true, capturing an image with this camera node will automatically de-select any previously selected yes/no answer on the mobile app.",
    txtIndex: "Display order of this node among sibling nodes. Lower index numbers appear first on the health worker screen.",
    txtAgeMin: "Minimum patient age in years for this question to appear. Accepts decimals (e.g., 0.5 = 6 months). The question is hidden for younger patients.",
    txtAgeMax: "Maximum patient age in years for this question to appear. Accepts decimals (e.g., 1.5 = 18 months). The question is hidden for older patients.",
    txtRangeMin: "Minimum allowed value for the range input shown to the health worker. Only applies when Input Type is set to 'range'.",
    txtRangeMax: "Maximum allowed value for the range input shown to the health worker. Only applies when Input Type is set to 'range'.",
  }

  myForm = new FormGroup(
    {
      txtText: new FormControl('', Validators.required),
      txtDisplay: new FormControl(),
      ddisRequired: new FormControl(),
      ddMultiChoice: new FormControl(),
      txtDisplayOR: new FormControl(),
      txtDisplayHI: new FormControl(),
      txtDisplayMR: new FormControl(),
      txtpopup: new FormControl(),
      txtpopuphi: new FormControl(),
      txtpopupor: new FormControl(),
      txtpopupmr: new FormControl(),
      txtLanguage: new FormControl(),
      txtInputType: new FormControl(),
      txtGender: new FormControl(),
      txtPosCon: new FormControl(),
      txtNegCon: new FormControl(),
      txtPPE: new FormControl(),
      txtcitation: new FormControl(),
      txtsnomed: new FormControl(),
      txticd: new FormControl(),
      txtloinc: new FormControl(),
      txtjobaidtype: new FormControl(),
      txtjobaidfile: new FormControl(),
      ddExcludeMultiChoice: new FormControl(),
      ddHavingNestedQuestion: new FormControl(),
      txtCompareDuplicateNode: new FormControl(),
      ddEnableExclusiveOption:new FormControl(),
      ddIsExclusiveOption:new FormControl(),
      ddIsExclusive:new FormControl(),
      txtIndex: new FormControl(null),
      txtAgeMinYear: new FormControl<number | null>(null),
      txtAgeMinMonths: new FormControl<number | null>(null),
      txtAgeMinDays: new FormControl<number | null>(null),
      txtAgeMaxYear: new FormControl<number | null>(null),
      txtAgeMaxMonths: new FormControl<number | null>(null),
      txtAgeMaxDays: new FormControl<number | null>(null),
      txtRangeMin: new FormControl(),
      txtRangeMax: new FormControl('txtRangeMax'),
    },

    { validators: [AgeCompareValidator, RangeCompareValidator] }
  );

  positiveCondition: boolean = false;
  negativeCondition: boolean = false;
  ageMinYear: number | null = null;
  ageMinMonths: number | null = null;
  ageMinDays: number | null = null;
  ageMaxYear: number | null = null;
  ageMaxMonths: number | null = null;
  ageMaxDays: number | null = null;

  indexError: boolean = false;

  suggestingLanguage: boolean = false;
  languageSuggestionReason: string = '';
  languageSuggestionError: string = '';

  yearOptions = Array.from({ length: 121 }, (_, i) => i);
  monthOptions = Array.from({ length: 12 }, (_, i) => i);

  isLeapYear(year: number): boolean {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  }

  getDaysInMonth(year: number | null | undefined, month: number | null | undefined): number {
    if (month == null) return 31;
    // months are 0-indexed: 0=Jan, 1=Feb, ..., 11=Dec
    const daysPerMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    let days = daysPerMonth[month] ?? 31;
    if (month === 1 && year != null && this.isLeapYear(year)) {
      days = 29;
    }
    return days;
  }

  get ageMinDayOptions(): number[] {
    const maxDays = this.getDaysInMonth(this.ageMinYear, this.ageMinMonths);
    return Array.from({ length: maxDays + 1 }, (_, i) => i);
  }

  get ageMaxDayOptions(): number[] {
    const maxDays = this.getDaysInMonth(this.ageMaxYear, this.ageMaxMonths);
    return Array.from({ length: maxDays + 1 }, (_, i) => i);
  }

  onAgeMinYearChange() {
    if (this.ageMinYear == null) {
      this.ageMinMonths = null;
      this.ageMinDays = null;
      this.myForm.patchValue({ txtAgeMinMonths: null, txtAgeMinDays: null });
    } else {
      const maxDays = this.getDaysInMonth(this.ageMinYear, this.ageMinMonths);
      if (this.ageMinDays != null && this.ageMinDays > maxDays) {
        this.ageMinDays = null;
        this.myForm.patchValue({ txtAgeMinDays: null });
      }
    }
    this.syncAgeMin();
  }

  onAgeMinMonthChange() {
    if (this.ageMinMonths == null) {
      this.ageMinDays = null;
      this.myForm.patchValue({ txtAgeMinDays: null });
    } else {
      const maxDays = this.getDaysInMonth(this.ageMinYear, this.ageMinMonths);
      if (this.ageMinDays != null && this.ageMinDays > maxDays) {
        this.ageMinDays = null;
        this.myForm.patchValue({ txtAgeMinDays: null });
      }
    }
    this.syncAgeMin();
  }

  onAgeMinDayChange() {
    this.syncAgeMin();
  }

  private syncAgeMin() {
    if (this.ageMinYear != null || this.ageMinMonths != null || this.ageMinDays != null) {
      this.addData.age_min = {
        year: this.ageMinYear ?? 0,
        month: this.ageMinMonths ?? 0,
        days: this.ageMinDays ?? 0
      };
    } else {
      this.addData.age_min = undefined;
    }
  }

  onAgeMaxYearChange() {
    if (this.ageMaxYear == null) {
      this.ageMaxMonths = null;
      this.ageMaxDays = null;
      this.myForm.patchValue({ txtAgeMaxMonths: null, txtAgeMaxDays: null });
    } else {
      const maxDays = this.getDaysInMonth(this.ageMaxYear, this.ageMaxMonths);
      if (this.ageMaxDays != null && this.ageMaxDays > maxDays) {
        this.ageMaxDays = null;
        this.myForm.patchValue({ txtAgeMaxDays: null });
      }
    }
    this.syncAgeMax();
  }

  onAgeMaxMonthChange() {
    if (this.ageMaxMonths == null) {
      this.ageMaxDays = null;
      this.myForm.patchValue({ txtAgeMaxDays: null });
    } else {
      const maxDays = this.getDaysInMonth(this.ageMaxYear, this.ageMaxMonths);
      if (this.ageMaxDays != null && this.ageMaxDays > maxDays) {
        this.ageMaxDays = null;
        this.myForm.patchValue({ txtAgeMaxDays: null });
      }
    }
    this.syncAgeMax();
  }

  onAgeMaxDayChange() {
    this.syncAgeMax();
  }

  private syncAgeMax() {
    if (this.ageMaxYear != null || this.ageMaxMonths != null || this.ageMaxDays != null) {
      this.addData.age_max = {
        year: this.ageMaxYear ?? 0,
        month: this.ageMaxMonths ?? 0,
        days: this.ageMaxDays ?? 0
      };
    } else {
      this.addData.age_max = undefined;
    }
  }

  constructor(
    public modal: NgbActiveModal,
    private mindmapService: MindmapService,
    private clinicalLanguage: ClinicalLanguageService
  ) {}

  get canSuggestLanguage(): boolean {
    return this.clinicalLanguage.isConfigured;
  }

  async suggestLanguage() {
    if (this.suggestingLanguage) return;
    this.suggestingLanguage = true;
    this.languageSuggestionError = '';
    this.languageSuggestionReason = '';
    try {
      const suggestion = await this.clinicalLanguage.suggest({
        path: this.ancestorPath,
        text: this.addData.topic,
        display: this.addData.display,
        inputType: this.addData.input_type,
        children: [],
        siblings: this.siblingTopics,
        parentLanguage: this.parentLanguage,
        multiChoice: this.addData.multi_choice,
        isExclusiveOption: this.addData.is_exclusive_option,
      });
      this.addData.language = suggestion.language;
      this.myForm.controls.txtLanguage.setValue(suggestion.language);
      this.languageSuggestionReason = suggestion.reasoning;
    } catch (e: any) {
      this.languageSuggestionError =
        e?.message ?? 'Could not get a suggestion. Please try again.';
    } finally {
      this.suggestingLanguage = false;
    }
  }

  ngOnInit() {}

  private isOtherOption(text: string): boolean {
    const normalized = text.trim().toLowerCase();
    return normalized === 'other' || normalized === 'others' || normalized === 'other [describe]';
  }

  onTextSelection(e: any) {
    if (e.target.value.toLowerCase() == 'Associated symptoms'.toLowerCase()) {
      this.positiveCondition = true;
      this.negativeCondition = true;
    } else {
      this.positiveCondition = false;
      this.negativeCondition = false;
    }
    if (this.isOtherOption(e.target.value)) {
      this.addData.exclude_from_multi_choice = true;
      this.myForm.patchValue({ ddExcludeMultiChoice: true });
    }
  }

  onIndexChange(event: any) {
    const val = parseFloat(event.target.value);
    this.indexError = !isNaN(val) && val < 0;
    if (this.indexError) {
      this.addData.index = undefined;
    }
  }

  resetNodeRules() {
    this.mindmapService.resetNodeRules(this.addData);
    // null → matches [ngValue]="null" → shows "-- Select --" after reset
    this.ageMinYear = null;
    this.ageMinMonths = null;
    this.ageMinDays = null;
    this.ageMaxYear = null;
    this.ageMaxMonths = null;
    this.ageMaxDays = null;
    this.myForm.patchValue({
      txtInputType: '',
      txtGender: '',
      ddisRequired: null,
      ddMultiChoice: null,
      ddExcludeMultiChoice: null,
      ddHavingNestedQuestion: null,
      ddEnableExclusiveOption: null,
      ddIsExclusiveOption: null,
      ddIsExclusive: null,
      txtAgeMinYear: null,
      txtAgeMinMonths: null,
      txtAgeMinDays: null,
      txtAgeMaxYear: null,
      txtAgeMaxMonths: null,
      txtAgeMaxDays: null,
    });
    this.indexError = false;
  }

  onSubmit() {
    this.myForm.markAllAsTouched();
    if (!this.myForm.valid || this.indexError) {
      return;
    }
    this.addData.id = Math.random().toString();
    this.onSave.emit(this.addData);
  }
}
