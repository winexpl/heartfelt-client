import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { text } from 'stream/consumers';
import { RequestService } from '../../services/request.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-edit-request-modal',
  imports: [
    CommonModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    ReactiveFormsModule
  ],
  templateUrl: './edit-request-modal.component.html',
  styleUrl: './edit-request-modal.component.css'
})
export class EditRequestModalComponent {
  snackBar: MatSnackBar = inject(MatSnackBar)
  form!: FormGroup
  fb: FormBuilder = inject(FormBuilder)

  requestService = inject(RequestService)

  constructor() {
    this.form = this.fb.group({
      text: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      console.log('Форма отправлена', this.form.value);
      const newRequest = {
        text: this.form.value.text
      }
      this.requestService.saveRequest(newRequest).subscribe({
        next: () => {
          this.snackBar.open('Ваша заявка сохранена', 'Закрыть', {
            duration: 3000,
          });
          this.form.reset();
        },
        error: (err) => {
          console.error('Ошибка при сохранении заявки:', err);
          this.snackBar.open('Ошибка при сохранении заявки', 'Закрыть', {
            duration: 3000, // Длительность в миллисекундах
          });
        }
      })
    } else {
      console.error('Форма невалидна');
    }
  }
}
