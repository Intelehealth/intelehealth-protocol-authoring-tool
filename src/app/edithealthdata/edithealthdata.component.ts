import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { IHealthData } from '../Interfaces/ihealth-data';
import { Result, Ok, Err } from '@sniptt/monads';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AgeCompareValidator, RangeCompareValidator } from '../validators/agecomparevalidator';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { IMindMapData } from '../Interfaces/mindmap-interface';
import { MindmapService } from '../services/mindmap.service';
@Component({
  selector: 'app-edithealthdata',
  templateUrl: './edithealthdata.component.html',
  styleUrls: ['./edithealthdata.component.css'],
})
export class EdithealthdataComponent implements OnInit {
  @Output() onEdit = new EventEmitter<IMindMapData>();
  @Input() public healthdata: IMindMapData = {
    topic: ''
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
      txtText: new FormControl(),
      txtDisplay: new FormControl(),
      ddisRequired: new FormControl(),
      ddMultiChoice: new FormControl(),
      txtDisplayOR: new FormControl(),
      txtDisplayHI: new FormControl(),
      txtDisplayMR: new FormControl(),
      txtpopup: new FormControl(),
      txtpopupor: new FormControl(),
      txtpopuphi: new FormControl(),
      txtpopupmr: new FormControl(),
      txtLanguage: new FormControl(),
      txtInputType: new FormControl(),
      txtGender: new FormControl(),
      txtPosCon: new FormControl(),
      txtNegCon: new FormControl(),
      txtPPE: new FormControl(),
      txtcitation: new FormControl('', Validators.required),
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
      this.healthdata.age_min = {
        year: this.ageMinYear ?? 0,
        months: this.ageMinMonths ?? 0,
        days: this.ageMinDays ?? 0
      };
    } else {
      this.healthdata.age_min = undefined;
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
      this.healthdata.age_max = {
        year: this.ageMaxYear ?? 0,
        months: this.ageMaxMonths ?? 0,
        days: this.ageMaxDays ?? 0
      };
    } else {
      this.healthdata.age_max = undefined;
    }
  }

  constructor(public modal: NgbActiveModal, private mindmapService: MindmapService) {}

  private isOtherOption(text: string): boolean {
    const normalized = text.trim().toLowerCase();
    return normalized === 'other' || normalized === 'others' || normalized === 'other [describe]';
  }

  ngOnInit(): void {
    if (
      this.healthdata.topic.toLowerCase() == 'Associated symptoms'.toLowerCase()
    ) {
      this.positiveCondition = true;
      this.negativeCondition = true;
    } else {
      this.positiveCondition = false;
      this.negativeCondition = false;
    }
    if (this.isOtherOption(this.healthdata.topic)) {
      this.healthdata.exclude_from_multi_choice = true;
      this.myForm.patchValue({ ddExcludeMultiChoice: true });
    }
    if (this.healthdata.age_min) {
      this.ageMinYear = this.healthdata.age_min.year ?? null;
      this.ageMinMonths = this.healthdata.age_min.months ?? null;
      this.ageMinDays = this.healthdata.age_min.days ?? null;
      this.myForm.patchValue({
        txtAgeMinYear: this.ageMinYear,
        txtAgeMinMonths: this.ageMinMonths,
        txtAgeMinDays: this.ageMinDays,
      });
    }
    if (this.healthdata.age_max) {
      this.ageMaxYear = this.healthdata.age_max.year ?? null;
      this.ageMaxMonths = this.healthdata.age_max.months ?? null;
      this.ageMaxDays = this.healthdata.age_max.days ?? null;
      this.myForm.patchValue({
        txtAgeMaxYear: this.ageMaxYear,
        txtAgeMaxMonths: this.ageMaxMonths,
        txtAgeMaxDays: this.ageMaxDays,
      });
    }
    // Normalize undefined → '' / null so every dropdown shows "-- Select --"
    this.healthdata.input_type = this.healthdata.input_type ?? '';
    this.healthdata.gender = this.healthdata.gender ?? '';
    this.healthdata.isRequired = (this.healthdata.isRequired ?? null) as any;
    this.healthdata.multi_choice = (this.healthdata.multi_choice ?? null) as any;
    this.healthdata.exclude_from_multi_choice = (this.healthdata.exclude_from_multi_choice ?? null) as any;
    this.healthdata.having_nested_question = (this.healthdata.having_nested_question ?? null) as any;
    this.healthdata.enable_exclusive_option = (this.healthdata.enable_exclusive_option ?? null) as any;
    this.healthdata.is_exclusive_option = (this.healthdata.is_exclusive_option ?? null) as any;
    this.healthdata.is_exclusive = (this.healthdata.is_exclusive ?? null) as any;
    this.myForm.patchValue({
      txtInputType: this.healthdata.input_type,
      txtGender: this.healthdata.gender,
      ddisRequired: this.healthdata.isRequired,
      ddMultiChoice: this.healthdata.multi_choice,
      ddExcludeMultiChoice: this.healthdata.exclude_from_multi_choice,
      ddHavingNestedQuestion: this.healthdata.having_nested_question,
      ddEnableExclusiveOption: this.healthdata.enable_exclusive_option,
      ddIsExclusiveOption: this.healthdata.is_exclusive_option,
      ddIsExclusive: this.healthdata.is_exclusive,
    });
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
      this.healthdata.exclude_from_multi_choice = true;
      this.myForm.patchValue({ ddExcludeMultiChoice: true });
    }
  }

  onIndexChange(event: any) {
    const val = parseFloat(event.target.value);
    this.indexError = !isNaN(val) && val < 0;
    if (this.indexError) {
      this.healthdata.index = undefined;
    }
  }

  resetNodeRules() {
    this.mindmapService.resetNodeRules(this.healthdata);
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
    this.onEdit.emit(this.healthdata);
  }
}
