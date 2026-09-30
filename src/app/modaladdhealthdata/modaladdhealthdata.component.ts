import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { IMindMapData } from '../Interfaces/mindmap-interface';

@Component({
  selector: 'app-modaladdhealthdata',
  templateUrl: './modaladdhealthdata.component.html',
  styleUrls: ['./modaladdhealthdata.component.css'],
})
export class ModaladdhealthdataComponent implements OnInit {
  @Input() public ancestorPath: string[] = [];
  @Input() public siblingTopics: string[] = [];
  @Input() public parentLanguage: string = '';
  constructor(public modal: NgbActiveModal) {}

  ngOnInit(): void {}
  saveData(hdata: IMindMapData) {
    this.modal.close(hdata);
  }
}
