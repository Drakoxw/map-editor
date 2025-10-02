import { Pipe, PipeTransform } from '@angular/core'
import { AbstractControl } from '@angular/forms'

@Pipe({
  name: 'formControlError',
  pure: false,
  standalone: true,
})
export class FormControlErrorPipe implements PipeTransform {
  transform(
    control: AbstractControl<unknown, unknown> | null,
  ): boolean {
    const existErrorAndTouched = control?.touched && control?.invalid
    if (existErrorAndTouched) {
      return true
    }
    return false
  }
}
