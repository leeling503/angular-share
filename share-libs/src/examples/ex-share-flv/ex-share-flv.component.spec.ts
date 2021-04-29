/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ExShareFlvComponent } from './ex-share-flv.component';

describe('ExShareFlvComponent', () => {
  let component: ExShareFlvComponent;
  let fixture: ComponentFixture<ExShareFlvComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExShareFlvComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExShareFlvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
