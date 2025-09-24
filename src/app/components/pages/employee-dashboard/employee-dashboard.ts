import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { Employee } from '../../../models/employee.model';
import { EmployeeService } from '../../../services/employee.service';
import { ConfirmModal } from '../../ui-elements/confirm-modal/confirm-modal';

@Component({
  selector: 'app-employee-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ConfirmModal],
  templateUrl: './employee-dashboard.html',
  styleUrls: ['./employee-dashboard.scss']
})
export class EmployeeDashboardComponent implements OnInit {
  // Full list of employees
  employees: Employee[] = [];
  // Employees after applying search/filter/sort
  filteredEmployees: Employee[] = [];

  // Static list of departments for dropdown
  departments = ['HR', 'Engineering', 'Sales', 'Marketing'];

  // Reactive form for employee add/edit
  form!: FormGroup;
  // Track ID of employee being edited, null means adding a new employee
  editingId: number | null = null;

  // Sorting options
  sortField: 'name' | 'dateOfJoining' | null = null;
  sortAsc: boolean = true;

  // Form controls for search and department filter
  searchControl!: any;
  filterDeptControl!: any;

  // Dark mode toggle (can be used in template)
  darkMode = false;

  constructor(private fb: FormBuilder, private employeeService: EmployeeService) {
  }

  ngOnInit() {
    // Load initial employees from service (could be from localStorage)
    this.employees = this.employeeService.getAll();

    // Build form structure
    this.buildForm();

    // Initialize search and filter controls
    this.searchControl = this.fb.control('');
    this.filterDeptControl = this.fb.control('');

    // Apply initial filters
    this.applyFilters();

    // Re-apply filters when search or filter changes
    this.searchControl.valueChanges.subscribe(() => this.applyFilters());
    this.filterDeptControl.valueChanges.subscribe(() => this.applyFilters());

    // Optional: Keep in sync with service updates
    this.employeeService.employees$.subscribe(list => {
      this.employees = list;
      this.applyFilters();
    });
  }

  /** Build the reactive form with validation */
  buildForm() {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      department: ['', Validators.required],
      dateOfJoining: ['', [Validators.required, this.noFutureDate]]
    });
  }

  // Convenience getter for form controls in template
  get f() {
    return this.form.controls;
  }

  /** Custom validator to disallow future joining dates */
  noFutureDate(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (value && new Date(value) > new Date()) {
      return { futureDate: true };
    }
    return null;
  }

  /** Submit form - add or update employee */
  submit() {
    if (this.form.invalid) return;
    const emp: Employee = {
      id: this.editingId ?? this.employees.length ? Math.max(... this.employees.map(e => e.id)) + 1 : 1, // Generate ID if new
      ...this.form.value
    };

    if (this.editingId) {
      // Update existing employee
      const idx = this.employees.findIndex(e => e.id === this.editingId);
      this.employees[idx] = emp;
    } else {
      // Add new employee
      this.employees.push(emp);
    }

    this.save();              // Save to localStorage
    this.form.reset();        // Clear form
    this.editingId = null;    // Reset edit mode
    this.applyFilters();      // Re-apply filters
  }

  /** Load employee data into form for editing */
  startEdit(emp: Employee) {
    this.editingId = emp.id;
    this.form.patchValue(emp);
  }

  /** Delete an employee by ID */
  delete(isConfirmed: boolean, id: number) {
    if(isConfirmed) {
      this.employees = this.employees.filter(e => e.id !== id);
      this.save();
      this.applyFilters();
    }
  }

  /** Save employees list to localStorage */
  save() {
    localStorage.setItem('employees_v1', JSON.stringify(this.employees));
  }

  /** Apply search, filter, and sorting on employee list */
  applyFilters() {
    let list = [...this.employees];

    const search = this.searchControl.value?.toLowerCase() || '';
    const dept = this.filterDeptControl.value || '';

    // Filter by search keyword (name/email)
    if (search) {
      list = list.filter(
        e =>
          e.name.toLowerCase().includes(search) ||
          e.email.toLowerCase().includes(search)
      );
    }

    // Filter by department
    if (dept) {
      list = list.filter(e => e.department === dept);
    }

    // Apply sorting if chosen
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

  /** Set or toggle sort field */
  setSort(field: 'name' | 'dateOfJoining') {
    if (this.sortField === field) {
      this.sortAsc = !this.sortAsc;
    } else {
      this.sortField = field;
      this.sortAsc = true;
    }
    this.applyFilters();
  }

  /** Export filtered employees to CSV file */
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

    // Create download link and trigger
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'employees.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  }

  /** Cancel editing and reset form */
  cancel() {
    this.editingId = null;
    this.form.reset();
  }
}
