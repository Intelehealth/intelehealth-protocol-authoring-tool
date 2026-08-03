import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { IMindMapData } from '../Interfaces/mindmap-interface';

@Component({
  selector: 'app-modaladdhealthdata',
  templateUrl: './modaladdhealthdata.component.html',
  styleUrls: ['./modaladdhealthdata.component.css'],
})
export class ModaladdhealthdataComponent implements OnInit {
  constructor(public modal: NgbActiveModal) {}

  ngOnInit(): void {}
  saveData(hdata: IMindMapData) {
    this.modal.close(hdata);
  }
}
