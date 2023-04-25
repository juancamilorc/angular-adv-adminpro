import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanLoad, Route, Router, RouterStateSnapshot, UrlSegment, UrlTree } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { UsuarioService } from '../services/usuario.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanLoad {

  constructor( private usuarioService: UsuarioService, private router: Router ) {}
  canLoad(route: Route, segments: UrlSegment[]): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    return this.usuarioService.validarToken()  //Esto retorna false o true dependiendo del guard, si renovo o no el token
    .pipe(
      tap( isAuth => {
        if( !isAuth ){
          this.router.navigateByUrl('/login');
        }
      })
    );
  }

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
