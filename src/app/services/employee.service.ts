import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Employee } from '../models/employee.model';

// Key used for localStorage persistence
const STORAGE_KEY = 'employees_v1';

@Injectable({
  providedIn: 'root' // Service is available app-wide
})
export class EmployeeService {
  // Internal BehaviorSubject to hold employees state
  private _employees$ = new BehaviorSubject<Employee[]>(this.loadFromStorage());
  // Expose as observable for components to subscribe
  employees$ = this._employees$.asObservable();

  /** Load employees from localStorage, or seed with sample data */
  private loadFromStorage(): Employee[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        // Seed with demo employees if storage is empty
        const seed: Employee[] = [
          { id: 1, name: 'Alice Smith', email: 'alice@example.com', department: 'Engineering', dateOfJoining: '2023-05-10' },
          { id: 2, name: 'Bob Johnson', email: 'bob@example.com', department: 'HR',          dateOfJoining: '2022-11-01' }
        ];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
        return seed;
      }
      return JSON.parse(raw) as Employee[];
    } catch {
      // In case of corrupted JSON or storage issues
      return [];
    }
  }

  /** Save updated list to localStorage and push to BehaviorSubject */
  private saveToStorage(list: Employee[]) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    this._employees$.next(list); // Emit new list to subscribers
  }

  /** Get a snapshot copy of employees (non-reactive) */
  getAll(): Employee[] {
    return [...this._employees$.value];
  }

  /** Add a new employee (auto-generate ID) */
  add(emp: Employee) {
    const list = this.getAll();
    const id = list.length ? Math.max(...list.map(e => e.id)) + 1 : 1; // Next ID
    const toAdd = { ...emp, id };
    list.push(toAdd);
    this.saveToStorage(list);
  }

  /** Update employee by ID (keeps same ID, replaces data) */
  update(id: number, emp: Employee) {
    const list = this.getAll().map(e => e.id === id ? { ...emp, id } : e);
    this.saveToStorage(list);
  }

  /** Delete employee by ID */
  delete(id: number) {
    const list = this.getAll().filter(e => e.id !== id);
    this.saveToStorage(list);
  }

  /** Replace entire employees list (useful for bulk import) */
  replaceAll(list: Employee[]) {
    this.saveToStorage(list);
  }
}
