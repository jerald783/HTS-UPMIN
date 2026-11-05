import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItoPmsListComponent } from './ito-pms-list.component';

describe('ItoPmsListComponent', () => {
  let component: ItoPmsListComponent;
  let fixture: ComponentFixture<ItoPmsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ItoPmsListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItoPmsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
