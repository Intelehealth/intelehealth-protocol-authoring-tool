import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { IMindMapData } from '../Interfaces/mindmap-interface';

@Component({
  selector: 'app-modaledithealthdata',
  templateUrl: './modaledithealthdata.component.html',
  styleUrls: ['./modaledithealthdata.component.css'],
})
export class ModaledithealthdataComponent implements OnInit {
  @Input() public healthdata: IMindMapData = {
    topic: ''
  };
  @Input() public ancestorPath: string[] = [];
  @Input() public childTopics: string[] = [];
  @Input() public siblingTopics: string[] = [];
  @Input() public parentLanguage: string = '';
  @Input() public childLanguages: string[] = [];
  constructor(public modal: NgbActiveModal) {}

  ngOnInit(): void {}
  editData(hdata: IMindMapData) {
    this.modal.close(hdata);
  }
}
