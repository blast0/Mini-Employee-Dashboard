import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { Employee } from '../../models/employee.model';
import { EmployeeService } from '../../services/employee.service';

@Component({
  selector: 'app-employee-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './employee-dashboard.html',
  styleUrls: ['./employee-dashboard.scss']
})
export class EmployeeDashboardComponent implements OnInit {
  employees: Employee[] = [];
  filteredEmployees: Employee[] = [];
  departments = ['HR', 'Engineering', 'Sales', 'Marketing'];
  form!: FormGroup;
  editingId: number | null = null;

  sortField: 'name' | 'dateOfJoining' | null = null;
  sortAsc = true;

  searchControl!: any;
  filterDeptControl!: any;

  darkMode = false;

  constructor(private fb: FormBuilder, private employeeService: EmployeeService) {}

  ngOnInit() {
    // Load initial employees from service
    this.employees = this.employeeService.getAll();

    this.buildForm();

    this.searchControl = this.fb.control('');
    this.filterDeptControl = this.fb.control('');

    this.applyFilters();

    this.searchControl.valueChanges.subscribe(() => this.applyFilters());
    this.filterDeptControl.valueChanges.subscribe(() => this.applyFilters());

    // Optional: Subscribe to changes from service to keep in sync if updated elsewhere
    this.employeeService.employees$.subscribe(list => {
      this.employees = list;
      this.applyFilters();
    });
  }

  buildForm() {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      department: ['', Validators.required],
      dateOfJoining: ['', [Validators.required, this.noFutureDate]]
    });
  }

  get f() {
    return this.form.controls;
  }

  noFutureDate(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (value && new Date(value) > new Date()) {
      return { futureDate: true };
    }
    return null;
  }

  submit() {
    if (this.form.invalid) return;

    const emp: Employee = {
      id: this.editingId ?? Date.now(),
      ...this.form.value
    };

    if (this.editingId) {
      const idx = this.employees.findIndex(e => e.id === this.editingId);
      this.employees[idx] = emp;
    } else {
      this.employees.push(emp);
    }

    this.save();
    this.form.reset();
    this.editingId = null;
    this.applyFilters();
  }

  startEdit(emp: Employee) {
    this.editingId = emp.id;
    this.form.patchValue(emp);
  }

  delete(id: number) {
    this.employees = this.employees.filter(e => e.id !== id);
    this.save();
    this.applyFilters();
  }

  save() {
    localStorage.setItem('employees_v1', JSON.stringify(this.employees));
  }

  applyFilters() {
    let list = [...this.employees];

    const search = this.searchControl.value?.toLowerCase() || '';
    const dept = this.filterDeptControl.value || '';

    if (search) {
      list = list.filter(
        e =>
          e.name.toLowerCase().includes(search) ||
          e.email.toLowerCase().includes(search)
      );
    }

    if (dept) {
      list = list.filter(e => e.department === dept);
    }

    if (this.sortField) {
      const field = this.sortField;
      list.sort((a, b) => {
        if (field === 'dateOfJoining') {
          return this.sortAsc
            ? new Date(a.dateOfJoining).getTime() - new Date(b.dateOfJoining).getTime()
            : new Date(b.dateOfJoining).getTime() - new Date(a.dateOfJoining).getTime();
        } else {
          return this.sortAsc
            ? a.name.localeCompare(b.name)
            : b.name.localeCompare(a.name);
        }
      });
    }

    this.filteredEmployees = list;
  }

  setSort(field: 'name' | 'dateOfJoining') {
    if (this.sortField === field) {
      this.sortAsc = !this.sortAsc;
    } else {
      this.sortField = field;
      this.sortAsc = true;
    }
    this.applyFilters();
  }

  exportCsv() {
    const headers = ['ID', 'Name', 'Email', 'Department', 'Date of Joining'];
    const rows = this.filteredEmployees.map(e => [
      e.id,
      e.name,
      e.email,
      e.department,
      e.dateOfJoining
    ]);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'employees.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  }

  cancel() {
    this.editingId = null;
    this.form.reset();
  }
}
