import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RibsComponent } from './ribs.component';

describe('RibsComponent', () => {
  let component: RibsComponent;
  let fixture: ComponentFixture<RibsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RibsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RibsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
