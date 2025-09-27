import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmModal, ConfirmModalDialog } from './confirm-modal';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { By } from '@angular/platform-browser';
import { provideZonelessChangeDetection } from '@angular/core';
// import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('ConfirmModal', () => {
let component: ConfirmModal;
let fixture: ComponentFixture<ConfirmModal>;

beforeEach(async () => {
await TestBed.configureTestingModule({
imports: [ConfirmModal, MatDialogModule],
providers: [provideZonelessChangeDetection()]
}).compileComponents();


fixture = TestBed.createComponent(ConfirmModal);
component = fixture.componentInstance;
fixture.detectChanges();


});

it('should render button with default text', () => {
const btn = fixture.debugElement.query(By.css('button')).nativeElement;
expect(btn.textContent.trim()).toBe('Modal button');
});

it('should emit onClick and open dialog when button clicked', () => {
spyOn(component.onClick, 'emit');
spyOn(component['dialog'], 'open').and.callThrough();

const btn = fixture.debugElement.query(By.css('button')).nativeElement;
btn.click();

expect(component.onClick.emit).toHaveBeenCalled();
expect(component['dialog'].open).toHaveBeenCalled();


});

it('should emit closeEvt after dialog closed', () => {
const mockDialogRef = {
afterClosed: () => ({ subscribe: (fn: any) => fn(true) })
} as any;


spyOn(component['dialog'], 'open').and.returnValue(mockDialogRef);
spyOn(component.closeEvt, 'emit');

component.openDialog();

expect(component.closeEvt.emit).toHaveBeenCalledWith(true);

});
});

describe('ConfirmModalDialog', () => {
let component: ConfirmModalDialog;
let fixture: ComponentFixture<ConfirmModalDialog>;
let mockDialogRef: jasmine.SpyObj<MatDialogRef<ConfirmModalDialog>>;

beforeEach(async () => {
mockDialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);


await TestBed.configureTestingModule({
  imports: [ConfirmModalDialog, MatDialogModule],
  providers: [
    { provide: MatDialogRef, useValue: mockDialogRef },
    { provide: MAT_DIALOG_DATA, useValue: { title: 'Test Title', content: 'Test Content' } }, provideZonelessChangeDetection()
  ]
}).compileComponents();

fixture = TestBed.createComponent(ConfirmModalDialog);
component = fixture.componentInstance;
fixture.detectChanges();


});

it('should render provided title and content', () => {
const title = fixture.debugElement.query(By.css('h2')).nativeElement.textContent.trim();
const content = fixture.debugElement.query(By.css('mat-dialog-content')).nativeElement.textContent.trim();

expect(title).toBe('Test Title');
expect(content).toBe('Test Content');


});

it('should close with false when No is clicked', () => {
const noBtn = fixture.debugElement.query(By.css('button.cancel')).nativeElement;
noBtn.click();
expect(mockDialogRef.close).toHaveBeenCalledWith(false);
});

it('should close with true when Yes is clicked', () => {
const yesBtn = fixture.debugElement.query(By.css('button.ok')).nativeElement;
yesBtn.click();
expect(mockDialogRef.close).toHaveBeenCalledWith(true);
});
});
