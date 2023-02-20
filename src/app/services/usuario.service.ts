import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, tap } from "rxjs/operators";

import { environment } from 'src/environments/environment';

import { loginForm } from '../interfaces/login-form.interface';
import { RegisterForm } from '../interfaces/register-form.interface';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { Usuario } from '../models/usuario.model';

declare const google: any;

const baseUrl = environment.base_url;



@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  public usuario! : Usuario;

  constructor( private http: HttpClient, private router: Router) { }

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get uid():string {
    return this.usuario.uid || '';
  }

  logOut() {
    localStorage.removeItem('token');
  
    google.accounts.id.revoke( 'juan.ra1184@gmail.com', () => {
        this.router.navigateByUrl('/login');
    
    });

  }

  validarToken():Observable<boolean> {

    return this.http.get(`${baseUrl}/login/renew `, {
      headers: {
        'x-token': this.token
      }
    }).pipe(
      tap( (resp: any) => {
        const{ nombre, email, img, google,role, uid } = resp.usuario;
        this.usuario = new Usuario( nombre, email, '', img , google, role, uid);

        localStorage.setItem('token', resp.token )
      }),
      map( resp => true ),
      catchError ( error => of(false))
    );
  }

  crearUsuario( formData: RegisterForm ) {
    
    return this.http.post(`${baseUrl}/usuarios `, formData)
        .pipe(
          tap( ( resp: any ) => {
            localStorage.setItem('token', resp.token)
          })
        )
  }

  actualizarUsuario( data: { email: string, nombre: string, role: string }) {

    data = {
      ...data,
      role: this.usuario.role! 
    };

      return this.http.put(`${baseUrl}/usuarios/${this.uid}`, data, {
        headers: {
        'x-token': this.token
      }
    });
  }

  login( formData: loginForm ) {
    
    return this.http.post(`${baseUrl}/login `, formData)
        .pipe(
          tap( ( resp: any ) => {
            localStorage.setItem('token', resp.token)
          })
        )
  }

  loginGoogle( token: string ) {
    return this.http.post(`${baseUrl}/login/google `, { token })
      .pipe(
        tap( 
          ( resp: any ) => {
            localStorage.setItem('token', resp.token)
          } )
      )
  }

}
