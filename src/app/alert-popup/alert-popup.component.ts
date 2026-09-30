import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-alert-popup',
  templateUrl: './alert-popup.component.html',
  styleUrls: ['./alert-popup.component.css']
})
export class AlertPopupComponent {
  @Input() message: string = '';
  @Input() title: string = 'Alert';
  @Input() type: 'alert' | 'confirm' = 'alert';

  constructor(public modal: NgbActiveModal) {}
}
