import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Usuario } from 'src/app/models/usuario.model';
import { FileuploadService } from 'src/app/services/fileupload.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styles: [
  ]
})
export class ProfileComponent implements OnInit {

  public perfilForm!: FormGroup;
  public usuario: Usuario;
  public imagenSubir!: File;

  constructor( private fb: FormBuilder, private usuarioService: UsuarioService, private fileupload: FileuploadService) {

      this.usuario = usuarioService.usuario;
   }

  ngOnInit(): void {

    this.perfilForm = this.fb.group({
      nombre: [this.usuario.nombre, Validators.required],
      email: [this.usuario.email, [Validators.required, Validators.email] ],
    });
  }

  actualizarPerfil() {
    console.log(this.perfilForm.value);
    this.usuarioService.actualizarUsuario( this.perfilForm.value )
      .subscribe( () => {
        const { nombre, email } = this.perfilForm.value;
        this.usuario.nombre = nombre;
        this.usuario.email = email;
      })
  }

  cambiarImagen( file: File ) {
    this.imagenSubir = file;
  }

  subirImagen() {
     this.fileupload
     .actualizarFoto( this.imagenSubir, 'usuarios', this.usuario.uid! )
     .then( img => this.usuario.img = img );

  }

}
