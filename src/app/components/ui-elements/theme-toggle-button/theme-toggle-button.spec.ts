import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ThemeToggler } from './theme-toggle-button';
import { ThemeService } from '../../../services/theme.service';
import { By } from '@angular/platform-browser';
import { provideZonelessChangeDetection } from '@angular/core';

// Mock ThemeService
class MockThemeService {
  private theme: 'light' | 'dark' = 'light';
  getTheme() { return this.theme; }
  toggleDarkTheme() {
    this.theme = this.theme === 'light' ? 'dark' : 'light';
  }
}

describe('ThemeToggler', () => {
  let component: ThemeToggler;
  let fixture: ComponentFixture<ThemeToggler>;
  let service: MockThemeService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ThemeToggler],
      providers: [{ provide: ThemeService, useClass: MockThemeService }, provideZonelessChangeDetection()]
    }).compileComponents();

    fixture = TestBed.createComponent(ThemeToggler);
    component = fixture.componentInstance;
    service = TestBed.inject(ThemeService) as any;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return true if theme is light', () => {
    service['theme'] = 'light';
    expect(component.isLightTheme()).toBeTrue();
  });

  it('should return false if theme is dark', () => {
    service['theme'] = 'dark';
    expect(component.isLightTheme()).toBeFalse();
  });

  it('should call service.toggleDarkTheme when toggling', () => {
    spyOn(service, 'toggleDarkTheme').and.callThrough();
    component.toggleTheme();
    expect(service.toggleDarkTheme).toHaveBeenCalled();
  });

  it('should reflect checked state from service', () => {
    service['theme'] = 'light';
    fixture.detectChanges();
    const input = fixture.debugElement.query(By.css('.switch__input')).nativeElement as HTMLInputElement;
    expect(input.checked).toBeTrue();

    // service['theme'] = 'dark';
    // fixture.detectChanges();
    // expect(input.checked).toBeFalse();
  });

  it('should toggle theme when input is changed', () => {
    const input = fixture.debugElement.query(By.css('.switch__input')).nativeElement as HTMLInputElement;
    spyOn(component, 'toggleTheme').and.callThrough();

    input.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    expect(component.toggleTheme).toHaveBeenCalled();
  });
});
