import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AgeCompareValidator, RangeCompareValidator } from '../validators/agecomparevalidator';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { IMindMapData } from '../Interfaces/mindmap-interface';
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
  ages: Array<number> = [];

  tooltips = {
    txtText: "Add Text",
    txtDisplay: "Add Display English Text",
    ddisRequired: "Select is this question Required?",
    ddMultiChoice: "Select is this Multi Choice question?",
    txtDisplayOR: "Add Display Odiya Text",
    txtDisplayHI: "Add Display Hindi Text",
    txtpopup: "Add Popup English Text",
    txtpopuphi: "Add Popup Hindi Text",
    txtpopupor: "Add Popup Odiya Text",
    txtLanguage: "Add Language to be shown in history note",
    txtInputType: "Select Input Type",
    txtGender: "Select Gender",
    txtPosCon: "Add Positive Condition",
    txtNegCon: "Add Negative Condition",
    txtPPE: "Add Perform Physical Exam",
    txtcitation: "Add Citation",
    txtsnomed: "Add Snomed",
    txticd: "Add ICD-10",
    txtloinc: "Add LOINC",
    txtjobaidtype: "Add Job Aid Type",
    txtjobaidfile: "Add Job Aid File",
    txtassocomplaint: "Add Associated Complaint",
    ddExcludeMultiChoice: "Select is this Exclude From Multi Choice question?",
    ddHavingNestedQuestion: "Select is this Having Nested Question?",
    ddEnableExclusiveOption:"Select is this Enable Exclusive Option?",
    txtCompareDuplicateNode:"Add Compare duplicate Node Text",
    ddIsExclusiveOption:"Select is this Exclusive Option",
    txtAgeMin: "Select Minimum Age",
    txtAgeMax: "Select Maximum Age",
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
      txtpopup: new FormControl(),
      txtpopuphi: new FormControl(),
      txtpopupor: new FormControl(),
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
      txtAgeMin: new FormControl('txtAgeMin'),
      txtAgeMax: new FormControl('txtAgeMax'),
      txtRangeMin: new FormControl(),
      txtRangeMax: new FormControl('txtRangeMax'),
    },

    { validators: [AgeCompareValidator, RangeCompareValidator] }
  );
  positiveCondition: boolean = false;
  negativeCondition: boolean = false;
  constructor(public modal: NgbActiveModal, private mindmapService: MindmapService) {
    for (var i = 1; i <= 120; i++) {
      this.ages.push(i);
    }
  }

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
  }

  onSubmit() {
    this.addData.id = Math.random().toString();
    this.onSave.emit(this.addData);
  }
}
