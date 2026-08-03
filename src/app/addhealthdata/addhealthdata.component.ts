import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AgeCompareValidator, RangeCompareValidator } from '../validators/agecomparevalidator';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { IAgeRange, IMindMapData } from '../Interfaces/mindmap-interface';
import { MindmapService } from '../services/mindmap.service';
@Component({
  selector: 'app-addhealthdata',
  templateUrl: './addhealthdata.component.html',
  styleUrls: ['./addhealthdata.component.css'],
})
export class AddhealthdataComponent implements OnInit {
  @Output() onSave = new EventEmitter<IMindMapData>();
  addData: IMindMapData = {
    topic: 'Enter Text'
  };

  tooltips = {
    txtText: "Add Text",
    txtDisplay: "Add Display English Text",
    ddisRequired: "Select is this question Required?",
    ddMultiChoice: "Select is this Multi Choice question?",
    txtDisplayOR: "Add Display Odiya Text",
    txtDisplayHI: "Add Display Hindi Text",
    txtDisplayMR: "Add Display Marathi Text",
    txtpopup: "Add Popup English Text",
    txtpopuphi: "Add Popup Hindi Text",
    txtpopupor: "Add Popup Odiya Text",
    txtpopupmr: "Add Popup Marathi Text",
    txtLanguage: "Add Language to be shown in history note",
    txtInputType: "Select Input Type",
    txtGender: "Select Gender",
    txtPosCon: "Add Positive Condition",
    txtNegCon: "Add Negative Condition",
    txtPPE: "Add Perform Physical Exam",
    txtcitation: "Add Citation",
    txtsnomed: "Add Snomed",
    txticd: "Add ICD-11",
    txtloinc: "Add LOINC",
    txtjobaidtype: "Add Job Aid Type",
    txtjobaidfile: "Add Job Aid File",
    txtassocomplaint: "Add Associated Complaint",
    ddExcludeMultiChoice: "Select is this Exclude From Multi Choice question?",
    ddHavingNestedQuestion: "Select is this Having Nested Question?",
    ddEnableExclusiveOption:"Select is this Enable Exclusive Option?",
    txtCompareDuplicateNode:"Add Compare duplicate Node Text",
    ddIsExclusiveOption:"Select is this Exclusive Option",
    txtIndex: "Enter Question Index",
    txtAgeMin: "Enter Minimum Age",
    txtAgeMax: "Enter Maximum Age",
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
    this.addData.age_min = (!isNaN(val) && val >= 0) ? { ...this.decimalToAgeRange(val), value: val } : undefined;
  }

  onAgeMaxChange(event: any) {
    const val = parseFloat(event.target.value);
    this.addData.age_max = (!isNaN(val) && val >= 0) ? { ...this.decimalToAgeRange(val), value: val } : undefined;
  }

  constructor(public modal: NgbActiveModal, private mindmapService: MindmapService) {}

  ngOnInit() {}

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
    this.mindmapService.resetNodeRules(this.addData);
    this.ageMinRaw = '';
    this.ageMaxRaw = '';
  }

  onSubmit() {
    this.addData.id = Math.random().toString();
    this.onSave.emit(this.addData);
  }
}
