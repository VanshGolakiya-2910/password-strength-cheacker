import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PasswordCheckerComponent } from './password-checker.component';
import { FormsModule } from '@angular/forms';  // Import FormsModule for ngModel

describe('PasswordCheckerComponent', () => {
  let component: PasswordCheckerComponent;
  let fixture: ComponentFixture<PasswordCheckerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PasswordCheckerComponent, FormsModule]  // Add FormsModule here
    })
    .compileComponents();

    fixture = TestBed.createComponent(PasswordCheckerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
