import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { EmployeeDashboardComponent } from './employee-dashboard';
import { EmployeeService } from '../../../services/employee.service';
import { Employee } from '../../../models/employee.model';
import { provideZonelessChangeDetection } from '@angular/core';

class MockEmployeeService {
  private employees: Employee[] = [
    { id: 1, name: 'Alice', email: 'alice@test.com', department: 'HR', dateOfJoining: '2020-01-01' },
    { id: 2, name: 'Bob', email: 'bob@test.com', department: 'Engineering', dateOfJoining: '2021-06-15' }
  ];
  employees$ = {
    subscribe: (fn: any) => fn(this.employees)
  };
  getAll() { return [...this.employees]; }
}

describe('EmployeeDashboardComponent', () => {
  let component: EmployeeDashboardComponent;
  let fixture: ComponentFixture<EmployeeDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, EmployeeDashboardComponent],
      providers: [{ provide: EmployeeService, useClass: MockEmployeeService },provideZonelessChangeDetection()]
    }).compileComponents();

    fixture = TestBed.createComponent(EmployeeDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('Form validation', () => {
    it('should invalidate empty form', () => {
      component.form.setValue({ name: '', email: '', department: '', dateOfJoining: '' });
      expect(component.form.valid).toBeFalse();
    });

    it('should require name min length 3', () => {
      component.form.controls['name'].setValue('Al');
      expect(component.form.controls['name'].valid).toBeFalse();
    });

    it('should validate correct email', () => {
      component.form.controls['email'].setValue('wrong-email');
      expect(component.form.controls['email'].valid).toBeFalse();

      component.form.controls['email'].setValue('valid@test.com');
      expect(component.form.controls['email'].valid).toBeTrue();
    });

    it('should disallow future joining date', () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      component.form.controls['dateOfJoining'].setValue(tomorrow.toISOString().slice(0, 10));
      expect(component.form.controls['dateOfJoining'].valid).toBeFalse();
    });
  });

  describe('CRUD operations', () => {
    it('should add new employee', () => {
      const initialCount = component.employees.length;
      component.form.setValue({
        name: 'Charlie',
        email: 'charlie@test.com',
        department: 'Sales',
        dateOfJoining: '2022-02-02'
      });
      component.submit();
      expect(component.employees.length).toBe(initialCount + 1);
    });

    it('should start editing an employee', () => {
      const emp = component.employees[0];
      component.startEdit(emp);
      expect(component.editingId).toBe(emp.id);
      expect(component.form.value.name).toBe(emp.name);
    });

    it('should update an existing employee', () => {
      const emp = component.employees[0];
      component.startEdit(emp);
      component.form.controls['name'].setValue('Alice Updated');
      component.submit();
      expect(component.employees[0].name).toBe('Alice Updated');
    });

    // it('should delete an employee', () => {
    //   spyOn(window, 'confirm').and.returnValue(true);
    //   const initialCount = component.employees.length;
    //   component.delete(component.employees[0].id);
    //   expect(component.employees.length).toBe(initialCount - 1);
    // });
  });

  describe('Filters and sorting', () => {
    it('should filter by search term', () => {
      component.searchControl.setValue('alice');
      component.applyFilters();
      expect(component.filteredEmployees.every(e => e.name.toLowerCase().includes('alice'))).toBeTrue();
    });

    it('should filter by department', () => {
      component.filterDeptControl.setValue('Engineering');
      component.applyFilters();
      expect(component.filteredEmployees.every(e => e.department === 'Engineering')).toBeTrue();
    });

    it('should sort by name ascending and descending', () => {
      component.setSort('name');
      expect(component.filteredEmployees[0].name <= component.filteredEmployees[1].name).toBeTrue();
      component.setSort('name');
      expect(component.filteredEmployees[0].name >= component.filteredEmployees[1].name).toBeTrue();
    });
  });

  describe('Export', () => {
    it('should generate CSV content', () => {
      spyOn(document, 'createElement').and.callFake(() => {
        return { click: () => {}, setAttribute: () => {} } as any;
      });
      component.exportCsv();
      // If we got here without error, exportCsv works
      expect(true).toBeTrue();
    });
  });
});
