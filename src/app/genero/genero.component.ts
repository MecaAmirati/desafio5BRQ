import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';

interface generoInterface{
  id:number,
  genero: string
}

@Component({
  selector: 'app-genero',
  templateUrl: './genero.component.html',
  styleUrls: ['./genero.component.scss']
})

export class GeneroComponent implements OnInit {
  private url="http://localhost:3000/genero"
  public listaGenero:any;
  public formGenero!:FormGroup;

  constructor(
    private httpClient:HttpClient,
    private formBuilder:FormBuilder,

    ) { }

  get generos(){
    return this.listaGenero
  }

  set generos(genero:generoInterface){
    this.listaGenero.push(genero)
  }

  lerGeneros(): Observable<generoInterface[]>{
    return this.httpClient.get<generoInterface[]>(this.url)
  }

  salvarGeneroAPI(objetoGenero:generoInterface):Observable<generoInterface>{
    return this.httpClient.post<generoInterface>(this.url, objetoGenero)
  }

  excluirGeneroAPI(id:number){ 
    return this.httpClient.delete<generoInterface>(`${this.url}/${id}`)
  }

  editarGeneroAPI(objetoGenero:generoInterface){
    return this.httpClient.put<generoInterface>(`${this.url}/${objetoGenero.id}`, objetoGenero)
  }

  ngOnInit(): void {
    this.lerGeneros().subscribe({
      next:(generos:generoInterface[])=>{
        this.listaGenero=generos;
        console.log(this.listaGenero);
      },
      error:()=>{
        console.log("Erro de importação de gênero");
        
      }
    })
    this.formGenero = this.formBuilder.group({
      tituloFilmes: new FormControl('', [Validators.required])
    })
  }

  excluirGenero(id:number){
    this.excluirGeneroAPI(id).subscribe({
      next:()=>{
        this.ngOnInit()
      },
      error:()=>{
        console.log("Erro ao excluir");
        
      }
    })
  }

  editarGenero(genero:generoInterface){
    genero.genero = "teste"
    this.editarGeneroAPI(genero).subscribe({
      next:()=>{
        this.ngOnInit()
      },
      error:()=>{
        console.log("Erro ao editar");
        
      }
    })
    

  }

  salvarGenero(){
    const id = (this.listaGenero[(this.listaGenero.length)-1].id) + 1
    const genero = this.formGenero.controls['tituloFilmes'].value
    const objetoGenero:generoInterface={id:id, genero:genero}

    this.salvarGeneroAPI(objetoGenero).subscribe({
      next:()=>{
        this.ngOnInit()
      },
      error:()=>{
        console.log("Erro de importação de gênero");
        
      }
    })

  }
}
