import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { IHealthData } from '../Interfaces/ihealth-data';
import { Result, Ok, Err } from '@sniptt/monads';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AgeCompareValidator, RangeCompareValidator } from '../validators/agecomparevalidator';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { IAgeRange, IMindMapData } from '../Interfaces/mindmap-interface';
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
    txtText: "Edit Text",
    txtDisplay: "Edit Display English Text",
    ddisRequired: "Update is this question Required?",
    ddMultiChoice: "Update is this Multi Choice question?",
    txtDisplayOR: "Edit Display Odiya Text",
    txtDisplayHI: "Edit Display Hindi Text",
    txtDisplayMR: "Edit Display Marathi Text",
    txtpopup: "Edit Popup English Text",
    txtpopuphi: "Edit Popup Hindi Text",
    txtpopupor: "Edit Popup Odiya Text",
    txtpopupmr: "Edit Popup Marathi Text",
    txtLanguage: "Edit Language to be shown in history note",
    txtInputType: "Update Input Type",
    txtGender: "Update Gender",
    txtPosCon: "Edit Positive Condition",
    txtNegCon: "Edit Negative Condition",
    txtPPE: "Edit Perform Physical Exam",
    txtcitation: "Edit Citation",
    txtsnomed: "Edit Snomed",
    txticd: "Edit ICD-11",
    txtloinc: "Edit LOINC",
    txtjobaidtype: "Edit Job Aid Type",
    txtjobaidfile: "Edit Job Aid File",
    txtassocomplaint: "Edit Associated Complaint",
    ddExcludeMultiChoice: "Update is this Exclude From Multi Choice question?",
    ddHavingNestedQuestion: "Select is this Having Nested Question?",
    ddEnableExclusiveOption:"Select is this Enable Exclusive Option?",
    txtCompareDuplicateNode:"Add Compare duplicate Node Text",
    ddIsExclusiveOption:"Select is this Exclusive Option",
    txtIndex: "Enter Question Index",
    txtAgeMin: "Update Minimum Age",
    txtAgeMax: "Update Maximum Age",
    txtRangeMin: "Enter Minimum Range",
    txtRangeMax: "Enter Maximum Range",
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
      txtcitation: new FormControl(),
      txtsnomed: new FormControl(),
      txticd: new FormControl(),
      txtloinc: new FormControl(),
      txtjobaidtype: new FormControl(),
      txtjobaidfile: new FormControl(),
      txtassocomplaint: new FormControl(),
      ddExcludeMultiChoice: new FormControl(),
      ddHavingNestedQuestion: new FormControl(),
      txtCompareDuplicateNode: new FormControl(),
      ddEnableExclusiveOption:new FormControl(),
      ddIsExclusiveOption:new FormControl(),
      txtIndex: new FormControl(null),
      txtAgeMin: new FormControl(null),
      txtAgeMax: new FormControl(null),
      txtRangeMin: new FormControl(),
      txtRangeMax: new FormControl('txtRangeMax'),
    },

    { validators: [AgeCompareValidator, RangeCompareValidator] }
  );

  positiveCondition: boolean = false;
  negativeCondition: boolean = false;
  ageMinRaw: string = '';
  ageMaxRaw: string = '';

  decimalToAgeRange(decimalYears: number): IAgeRange {
    const year = Math.floor(decimalYears);
    const monthValue = (decimalYears - year) * 12;
    const months = (monthValue - Math.floor(monthValue)) >= 0.5
      ? Math.ceil(monthValue)
      : Math.floor(monthValue);
    return { year, months };
  }

  onAgeMinChange(event: any) {
    const val = parseFloat(event.target.value);
    this.healthdata.age_min = !isNaN(val) ? { ...this.decimalToAgeRange(val), value: val } : undefined;
  }

  onAgeMaxChange(event: any) {
    const val = parseFloat(event.target.value);
    this.healthdata.age_max = !isNaN(val) ? { ...this.decimalToAgeRange(val), value: val } : undefined;
  }

  constructor(public modal: NgbActiveModal, private mindmapService: MindmapService) {}

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
    if (this.healthdata.age_min) {
      this.ageMinRaw = this.healthdata.age_min.value !== undefined
        ? String(this.healthdata.age_min.value)
        : parseFloat((this.healthdata.age_min.year + this.healthdata.age_min.months / 12).toFixed(2)).toString();
    }
    if (this.healthdata.age_max) {
      this.ageMaxRaw = this.healthdata.age_max.value !== undefined
        ? String(this.healthdata.age_max.value)
        : parseFloat((this.healthdata.age_max.year + this.healthdata.age_max.months / 12).toFixed(2)).toString();
    }
  }

  onTextSelection(e: any) {
    if (e.target.value.toLowerCase() == 'Associated symptoms'.toLowerCase()) {
      this.positiveCondition = true;
      this.negativeCondition = true;
    } else {
      this.positiveCondition = false;
      this.negativeCondition = false;
    }
  }

  resetNodeRules() {
    this.mindmapService.resetNodeRules(this.healthdata);
    this.ageMinRaw = '';
    this.ageMaxRaw = '';
  }

  onSubmit() {
    this.onEdit.emit(this.healthdata);
  }
}
