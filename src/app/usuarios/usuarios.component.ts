import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';

interface usuarioInterface{
  id:number,
  nome:string,
  email:string,
  tel:number,
}

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss']
})
export class UsuariosComponent implements OnInit {
  private url="http://localhost:3000/usuario"
  public formUsuario!:FormGroup;
  public listaUsuario:any;
  public usuarioId:number = 0;

  constructor(
    private httpClient:HttpClient,
    private formBuilder:FormBuilder,
  ) { }

  get usuarios(){
    return this.listaUsuario
  }

  set usuarios(usuario:usuarioInterface){
    this.listaUsuario.push(usuario)
  }

  salvarUsuarioAPI(objetoUsuario:usuarioInterface):Observable<usuarioInterface>{
    return this.httpClient.post<usuarioInterface>(this.url, objetoUsuario)
  }

  excluirUsuarioAPI(id:number){ 
    return this.httpClient.delete<usuarioInterface>(`${this.url}/${id}`)
  }

  editarUsuarioAPI(objetoUsuario:usuarioInterface){
    return this.httpClient.put<usuarioInterface>(`${this.url}/${objetoUsuario.id}`, objetoUsuario)
  }


  ngOnInit(): void {
    this.lerUsuarios().subscribe({
      next:(generos:usuarioInterface[])=>{
        this.listaUsuario=generos;
        console.log(this.listaUsuario);
      },
      error:()=>{
        console.log("Erro de importação de filme");
        
      }
    })

    this.formUsuario = this.formBuilder.group({
      nome: new FormControl('', [Validators.required]), email: new FormControl ('', [Validators.required]), tel: new FormControl ('', [Validators.required])
    })

    this.lerUsuarios().subscribe({
      next:(generos:usuarioInterface[])=>{
        this.listaUsuario=generos;
        console.log(this.listaUsuario);
      },
      error:()=>{
        console.log("Erro de importação de usuários");
      }
    })
  }

  lerUsuarios(): Observable<usuarioInterface[]>{
    return this.httpClient.get<usuarioInterface[]>(this.url)
  }

  excluirUsuario(id:number){
    this.excluirUsuarioAPI(id).subscribe({
      next:()=>{
        this.ngOnInit()
      },
      error:()=>{
        console.log("Erro ao excluir");
        
      }
    })
  }

  editarUsuario(usuario:usuarioInterface){
    this.usuarioId = usuario.id
    const EditNome = this.formUsuario.controls['nome'].setValue(usuario.nome);
    const EditEmail = this.formUsuario.controls['email'].setValue(usuario.email);
    const EditTel = this.formUsuario.controls['tel'].setValue(usuario.tel);
  }

  updateUsuario(){
    const id = this.usuarioId
    const nome = this.formUsuario.controls['nome'].value
    const email = this.formUsuario.controls['email'].value
    const tel = this.formUsuario.controls['tel'].value
    const objetoUsuario:usuarioInterface={id:id, nome:nome, email:email, tel:tel}
    this.editarUsuarioAPI(objetoUsuario).subscribe(
      {
        next:()=>{
          this.usuarioId = 0
          this.ngOnInit()
        },error:()=>{
          console.log('deu ruim aqui(update)!');
        }
      }
    )
  }

  salvarUsuario(){
    if (this.usuarioId > 0 ) {
      this.updateUsuario()
    }
    else{
      const id = (this.listaUsuario[(this.listaUsuario.length)-1].id) + 1
      const nome = this.formUsuario.controls['nome'].value
      const email = this.formUsuario.controls['email'].value
      const tel = this.formUsuario.controls['tel'].value
      const objetoUsuario:usuarioInterface={id:id, nome:nome, email:email, tel:tel}
  
      this.salvarUsuarioAPI(objetoUsuario).subscribe({
        next:()=>{
          this.ngOnInit()
        },
        error:()=>{
          console.log("Erro de importação de filme");
        }
      })
    }
  }
}
