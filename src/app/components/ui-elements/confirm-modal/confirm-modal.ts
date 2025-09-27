import { ChangeDetectionStrategy, Component, EventEmitter, inject, Inject, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

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
  @Output() onClick: EventEmitter<void>=new EventEmitter<void>()
  @Input() btnText: String="Modal button"
  @Input() btnClass: String="modalbtn"
  @Input() modalTitle: String="Modal title"
  @Input() modalContent: String="Modal Content"

  openDialog(): void {
    this.onClick.emit();
    const dialogRef = this.dialog.open(ConfirmModalDialog, {
      restoreFocus: false,
      panelClass: 'no-radius-dialog',
      data: {
        title: this.modalTitle,
        content: this.modalContent,
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.closeEvt.emit(result);
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
  constructor(
    readonly dialogRef: MatDialogRef<ConfirmModalDialog>,
    @Inject(MAT_DIALOG_DATA) public data: { title: string; content: string }
  ) {}
}
