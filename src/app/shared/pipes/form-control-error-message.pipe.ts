import { Pipe, PipeTransform } from '@angular/core'
import { AbstractControl } from '@angular/forms'

@Pipe({
  name: 'formControlErrorMessage',
  pure: false,
  standalone: true,
})
export class FormControlErrorMessagePipe implements PipeTransform {
  transform(
    control: AbstractControl<unknown, unknown> | null,
    classMessage: string = 'Campo requerido!'
  ): string {
    const existErrorAndTouched = control?.touched && control?.invalid
    if (existErrorAndTouched) {
      return classMessage
    }
    return ''
  }
}
