import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { FormArray } from '@angular/forms';
import { FormControl } from '@angular/forms'
import { Validators } from '@angular/forms';
import { ValidatorFn } from '@angular/forms';

export interface BooleanFn {
  (): boolean;
}

export function conditionalValidator(predicate: BooleanFn,
                              validator: ValidatorFn): ValidatorFn {
  return (formControl => {
    if (!formControl.parent) {
      return null;
    }
    let error = null;
    if (predicate()) {
      error = validator(formControl);
    }

    return error;
  })
}

@Component({
  selector: 'route-form',
  templateUrl: './route-form.component.html',
  styleUrls: ['./route-form.component.scss']
})

export class RouteFormComponent{

  routeForm : FormGroup;
  executors : Array<string>;

  constructor(private fb: FormBuilder) {
    this.executors = ['Механик',
                      'Водитель',
                      'Оператор ЧПУ',
                      'Старший механик-водитель'
                     ];

    this.routeForm = this.fb.group({
      title: ['', [
        conditionalValidator(() => this.routeForm!.get('longWalk') ? this.routeForm!.get('longWalk')!.value : false, Validators.required),
        conditionalValidator(() => this.routeForm!.get('longWalk') ? this.routeForm!.get('longWalk')!.value : false, Validators.pattern(/[[а-яА-Яё]{1}[0-9а-яА-Яё ]+/))
      ]],
      author: ['', [
        conditionalValidator(() => this.routeForm!.get('longWalk') ? this.routeForm!.get('longWalk')!.value : false, Validators.required),
        conditionalValidator(() => this.routeForm!.get('longWalk') ? this.routeForm!.get('longWalk')!.value : false,  Validators.pattern(/[а-яА-Яё]{1}[а-яА-Яё ]+/))
      ]],
      executorRole : ['', [
        conditionalValidator(() => this.routeForm!.get('longWalk') ? this.routeForm!.get('longWalk')!.value : false, Validators.required)
      ]],
      day: ['', [
        conditionalValidator(() => this.routeForm!.get('longWalk') ? this.routeForm!.get('longWalk')!.value : false, Validators.required)
      ]],
      longWalk: ['']
    });
  }

  ngOnInit(){
    this.routeForm.get('longWalk')!.valueChanges
      .subscribe( value => {
        this.routeForm.get('title')!.updateValueAndValidity();
        this.routeForm.get('author')!.updateValueAndValidity();
        this.routeForm.get('executorRole')!.updateValueAndValidity();
        this.routeForm.get('day')!.updateValueAndValidity();
      });

    this.onLoad();
  }

  onLoad() {
      this.routeForm.patchValue({
        title: window.localStorage.getItem('title'),
        author: window.localStorage.getItem('author'),
        executorRole: window.localStorage.getItem('executorRole'),
        day: window.localStorage.getItem('day'),
        longWalk: window.localStorage.getItem('longWalk')==='true'
      });
  }

  onSave() {
    window.localStorage.setItem('title', this.routeForm.value.title);
    window.localStorage.setItem('author', this.routeForm.value.author);
    window.localStorage.setItem('executorRole', this.routeForm.value.executorRole);
    window.localStorage.setItem('day', this.routeForm.value.day);
    window.localStorage.setItem('longWalk', this.routeForm.value.longWalk);
  }

}
