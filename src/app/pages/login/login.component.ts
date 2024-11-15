import {Component, DestroyRef, inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {AuthService} from "../../auth.service";
import {Login} from "../../index";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    // ...
    ReactiveFormsModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  private readonly authSvc = inject(AuthService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);
  loginForm!: FormGroup;

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

 onLoginFormSubmitted() {
    if (!this.loginForm.valid) {
      return;
    }

    this.authSvc.login(this.loginForm.value as Login).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe();
  }
}