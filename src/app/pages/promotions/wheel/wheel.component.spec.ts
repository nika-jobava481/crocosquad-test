import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';

import { WheelComponent } from './wheel.component';

describe('WheelComponent', () => {
  let component: WheelComponent;
  let fixture: ComponentFixture<WheelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WheelComponent, FormsModule]
    })
      .compileComponents();

    fixture = TestBed.createComponent(WheelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.currentAngle).toBe(7);
    expect(component.sector).toBe(1);
    expect(component.lastSector).toBe(1);
    expect(component.errorMessage).toBe('');
  });

  it('should spin wheel with valid sector', () => {
    component.sector = 5;
    const initialAngle = component.currentAngle;

    component.spinWheel();

    expect(component.errorMessage).toBe('');
    expect(component.currentAngle).not.toBe(initialAngle);
    expect(component.lastSector).toBe(5);
  });

  it('should show error for invalid sector (too low)', () => {
    component.sector = 0;

    component.spinWheel();

    expect(component.errorMessage).toBe('Sector not found.');
  });

  it('should show error for invalid sector (too high)', () => {
    component.sector = 11;

    component.spinWheel();

    expect(component.errorMessage).toBe('Sector not found.');
  });

  it('should prevent invalid characters on keydown', () => {
    const event = new KeyboardEvent('keydown', { key: 'e' });
    spyOn(event, 'preventDefault');

    component.onKeyDown(event);

    expect(event.preventDefault).toHaveBeenCalled();
  });

  it('should trigger spinWheel on Enter key', () => {
    const event = new KeyboardEvent('keydown', { key: 'Enter' });
    spyOn(event, 'preventDefault');
    spyOn(component, 'spinWheel');

    component.onKeyDown(event);

    expect(event.preventDefault).toHaveBeenCalled();
    expect(component.spinWheel).toHaveBeenCalled();
  });

  it('should allow valid characters on keydown', () => {
    const event = new KeyboardEvent('keydown', { key: '5' });
    spyOn(event, 'preventDefault');

    component.onKeyDown(event);

    expect(event.preventDefault).not.toHaveBeenCalled();
  });
});
