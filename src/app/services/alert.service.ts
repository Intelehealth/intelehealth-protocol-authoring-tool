import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertPopupComponent } from '../alert-popup/alert-popup.component';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  constructor(private modalService: NgbModal) {}

  showAlert(message: string, title: string = 'Alert'): Promise<void> {
    const modal = this.modalService.open(AlertPopupComponent, {
      centered: true,
      modalDialogClass: 'alert-modal-dialog',
      backdrop: 'static'
    });
    modal.componentInstance.message = message;
    modal.componentInstance.title = title;
    modal.componentInstance.type = 'alert';
    return modal.result.then(() => {}).catch(() => {});
  }

  showConfirm(message: string, title: string = 'Confirm'): Promise<boolean> {
    const modal = this.modalService.open(AlertPopupComponent, {
      centered: true,
      modalDialogClass: 'alert-modal-dialog',
      backdrop: 'static'
    });
    modal.componentInstance.message = message;
    modal.componentInstance.title = title;
    modal.componentInstance.type = 'confirm';
    return modal.result.then(() => true).catch(() => false);
  }
}
