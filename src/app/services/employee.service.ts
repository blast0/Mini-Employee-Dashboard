import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Employee } from '../models/employee.model';

const STORAGE_KEY = 'employees_v1';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private _employees$ = new BehaviorSubject<Employee[]>(this.loadFromStorage());
  employees$ = this._employees$.asObservable();

  private loadFromStorage(): Employee[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        // seed sample data
        const seed: Employee[] = [
          { id: 1, name: 'Alice Smith', email: 'alice@example.com', department: 'Engineering', dateOfJoining: '2023-05-10' },
          { id: 2, name: 'Bob Johnson', email: 'bob@example.com', department: 'HR', dateOfJoining: '2022-11-01' }
        ];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
        return seed;
      }
      return JSON.parse(raw) as Employee[];
    } catch {
      return [];
    }
  }

  private saveToStorage(list: Employee[]) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    this._employees$.next(list);
  }

  getAll(): Employee[] {
    return [...this._employees$.value];
  }

  add(emp: Employee) {
    const list = this.getAll();
    const id = list.length ? Math.max(...list.map(e => e.id)) + 1 : 1;
    const toAdd = { ...emp, id };
    list.push(toAdd);
    this.saveToStorage(list);
  }

  update(id: number, emp: Employee) {
    const list = this.getAll().map(e => e.id === id ? { ...emp, id } : e);
    this.saveToStorage(list);
  }

  delete(id: number) {
    const list = this.getAll().filter(e => e.id !== id);
    this.saveToStorage(list);
  }

  replaceAll(list: Employee[]) {
    this.saveToStorage(list);
  }
}
