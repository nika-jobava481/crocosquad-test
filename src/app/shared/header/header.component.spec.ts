import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { HeaderComponent } from './header.component';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
      providers: [provideRouter([])]
    })
      .compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit sidebarToggle event when toggleSidebar is called', () => {
    spyOn(component.sidebarToggle, 'emit');

    component.toggleSidebar();

    expect(component.sidebarToggle.emit).toHaveBeenCalled();
  });

  it('should update currentDateTime on init', () => {
    component.ngOnInit();

    expect(component.currentDateTime).toBeInstanceOf(Date);
  });

  it('should clear interval on destroy', () => {
    component.ngOnInit();
    spyOn(globalThis, 'clearInterval');

    component.ngOnDestroy();

    expect(globalThis.clearInterval).toHaveBeenCalled();
  });
});
