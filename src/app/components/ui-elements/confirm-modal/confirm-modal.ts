import { ChangeDetectionStrategy, Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';

/**
 * @title Dialog Animations
 */
@Component({
  selector: 'confirm-modal',
  styleUrl: 'confirm-modal.scss',
  templateUrl: 'confirm-modal.html',
  imports: [MatButtonModule,],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class ConfirmModal {
  readonly dialog = inject(MatDialog);
  @Output() closeEvt: EventEmitter<boolean>=new EventEmitter<boolean>()
  @Input() btnText: String="Modal button"
  @Input() btnClass: String="modalbtn"

  openDialog(): void {
    
    const dialogRef = this.dialog.open(ConfirmModalDialog, {  width: '320px', restoreFocus: false, panelClass: 'no-radius-dialog'});

    dialogRef.afterClosed().subscribe(result => {
      this.closeEvt.emit(result) 
    });
  }
}

@Component({
  selector: 'confirm-modal-dialog',
  templateUrl: 'confirm-modal-dialog.html',
  styleUrl: 'confirm-modal.scss',
  imports: [
    MatButtonModule,
    MatDialogActions,
    MatDialogClose,
    MatDialogTitle,
    MatDialogContent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmModalDialog {
  readonly dialogRef = inject(MatDialogRef<ConfirmModalDialog>);
  
}
