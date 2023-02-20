import { Component } from '@angular/core';
import { observable, Observable, retry } from 'rxjs';

@Component({
  selector: 'app-rxjs',
  templateUrl: './rxjs.component.html',
  styles: [
  ]
})
export class RxjsComponent  {

  constructor() { 
    
    let i = -1;

    const obs$ = new Observable<number>( observer => {


      const intervalo = setInterval(() => {
        
        i++;
        observer.next(i);

        if( i === 4) {
          clearInterval( intervalo );
          observer.complete();
        }

        if( i === 2) {
          observer.error('i llego al valor de 2');
        }

      }, 1000)

    });

    obs$.pipe(
      retry()
    ).subscribe(
      valor => console.log('Subs:',valor),
      (err => console.warn('Error', err)),
      () => console.info('Obs terminado')
    );

    

  }


}
