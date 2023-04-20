import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { tap } from 'rxjs';
import { UsuarioService } from '../services/usuario.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor( private usuarioService: UsuarioService, private router: Router ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot) { 

    return this.usuarioService.validarToken()  //Esto retorna false o true dependiendo del guard, si renovo o no el token
      .pipe(
        tap( isAuth => {
          if( !isAuth ){
            this.router.navigateByUrl('/login');
          }
        })
      );
  }
  
}
