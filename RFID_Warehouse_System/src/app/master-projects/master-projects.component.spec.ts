import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterProjectsComponent } from './master-projects.component';

describe('MasterProjectsComponent', () => {
  let component: MasterProjectsComponent;
  let fixture: ComponentFixture<MasterProjectsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MasterProjectsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MasterProjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
