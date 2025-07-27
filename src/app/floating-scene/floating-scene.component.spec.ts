import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FloatingSceneComponent } from './floating-scene.component';

describe('FloatingSceneComponent', () => {
  let component: FloatingSceneComponent;
  let fixture: ComponentFixture<FloatingSceneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FloatingSceneComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FloatingSceneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
