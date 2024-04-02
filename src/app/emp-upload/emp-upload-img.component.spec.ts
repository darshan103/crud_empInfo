import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpUploadImgComponent } from './emp-upload-img.component';

describe('EmpUploadImgComponent', () => {
  let component: EmpUploadImgComponent;
  let fixture: ComponentFixture<EmpUploadImgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmpUploadImgComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmpUploadImgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
