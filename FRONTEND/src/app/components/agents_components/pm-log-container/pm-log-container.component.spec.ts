import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PmLogContainerComponent } from './pm-log-container.component';

describe('PmLogContainerComponent', () => {
  let component: PmLogContainerComponent;
  let fixture: ComponentFixture<PmLogContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PmLogContainerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PmLogContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
