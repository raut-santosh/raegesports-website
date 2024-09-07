import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WidrawComponent } from './widraw.component';

describe('WidrawComponent', () => {
  let component: WidrawComponent;
  let fixture: ComponentFixture<WidrawComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WidrawComponent]
    });
    fixture = TestBed.createComponent(WidrawComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
