import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {ValidationErrors} from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  get(): Observable<Car[]> {
    return of(cars);
  }

  validate(car: Car): Observable<CustomValidationResult> {
    if (car.price > 100000) {
      return of({
        status: 200,
        body: {price: {max: 'too high'}}
      });
    }
    return of({status: 200});
  }
}

export interface Car {
  make: string;
  model: string;
  price: number;
}

export const cars: Car[] = [
  {
    make: 'Toyota',
    model: 'Celica',
    price: 35000
  },
  {
    make: 'Ford',
    model: 'Mondeo',
    price: 32000
  },
  {
    make: 'Porsche',
    model: 'Boxter',
    price: 72000
  }
];

export interface CustomValidationResult {
  status: number,
  body?: { [key: string]: ValidationErrors },
}
