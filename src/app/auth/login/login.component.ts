import { Component, AfterViewInit, ViewChild, ElementRef} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';

declare const google: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: [ './login.component.css']
})
export class LoginComponent implements AfterViewInit{

  @ViewChild('googleBtn') googleBtn!: ElementRef;

  public formSubmitted = false;

  loginForm: FormGroup;

  constructor( private router: Router, private fb: FormBuilder, private usuarioService: UsuarioService) { 

    this.loginForm = this.fb.group({
      email: [ localStorage.getItem('email') || '', [ Validators.required, Validators.email ]],
      password: ['',  Validators.required ],
      remember: [ false ]
    });
  }


  ngAfterViewInit(): void {
    this.googleInit();
  }

  googleInit(){

    google.accounts.id.initialize({
      client_id: '986576626915-temgurhn05rtpdr24a8udr6icbj886aq.apps.googleusercontent.com',
      callback: (response: any) => this.handleCredentialResponse(response)
    });

    google.accounts.id.renderButton(
      // document.getElementById("buttonDiv"),
      this.googleBtn.nativeElement,
      { theme: "outline", size: "large" }  // customization attributes
    );
  }

  handleCredentialResponse( response: any ) {
      // console.log("Encoded JWT ID token: " + response.credential);
      this.usuarioService.loginGoogle( response.credential )
        .subscribe( resp => {
          console.log( {login: resp});
          this.router.navigateByUrl('/');
        })
  }

  login() {

    this.usuarioService.login( this.loginForm.value )
      .subscribe( resp => {
        
        if( this.loginForm.get('remember')!.value){
          localStorage.setItem('email', this.loginForm.get('email')!.value);
        }else {
          localStorage.removeItem('email');
          
        }

        this.router.navigateByUrl('/');

      }, (err) => {
        //Si sucede un error 
        Swal.fire('Error', err.error.msg, 'error')
      });

  }

}
