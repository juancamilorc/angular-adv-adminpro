import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  private linkTheme = document.querySelector('#theme');

  constructor() { 

    const url = localStorage.getItem('theme') || '/assets/css/colors/default-dark.css' ;
    this.linkTheme?.setAttribute('href', url);
  }

  changeTheme( theme: string ){
    const url = `./assets/css/colors/${theme}.css`;

    this.linkTheme?.setAttribute('href', url);
    localStorage.setItem('theme',url);

    this.checkCurrentTheme();
  }

  checkCurrentTheme() {
      const links = document.querySelectorAll('.selector');

      links.forEach( elem => {          
      elem.classList.remove('working');                 //Remuevo la que tenga la selección en este momento de la clase 
      const btnTheme = elem.getAttribute('data-theme');  //Traigo el tema de cada atributo data-theme para compararlo posteriormente
      const btnThemeUrl = `./assets/css/colors/${btnTheme}.css` //Traigo el tema que esta siendo usado en la pagina para despues compararlo 
      const currentTheme = this.linkTheme?.getAttribute('href');

      if( btnThemeUrl === currentTheme ) 
      {
        elem.classList.add('working');
      }
    })
  }
}



