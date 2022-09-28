import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';

interface filmeInterface{
  id:number,
  filme:string,
  genero:string,
}

interface generoInterface{
  id:number,
  genero: string
}


@Component({
  selector: 'app-filmes',
  templateUrl: './filmes.component.html',
  styleUrls: ['./filmes.component.scss']
})
export class FilmesComponent implements OnInit {
  private url="http://localhost:3000/filmes"
  private url_2="http://localhost:3000/genero"
  public listaFilme:any;
  public listaGenero:any;
  public formFilme!:FormGroup;
  public filmeId:number = 0

  constructor(
    private httpClient:HttpClient,
    private formBuilder:FormBuilder,
  ) { }

  get filmes(){
    return this.listaFilme
  }

  set filmes(filme:filmeInterface){
    this.listaFilme.push(filme)
  }

  lerFilmes(): Observable<filmeInterface[]>{
    return this.httpClient.get<filmeInterface[]>(this.url)
  }

  salvarFilmeAPI(objetoFilme:filmeInterface):Observable<filmeInterface>{
    return this.httpClient.post<filmeInterface>(this.url, objetoFilme)
  }

  excluirFilmeAPI(id:number){ 
    return this.httpClient.delete<filmeInterface>(`${this.url}/${id}`)
  }

  editarFilmeAPI(objetoFilme:filmeInterface){
    return this.httpClient.put<filmeInterface>(`${this.url}/${objetoFilme.id}`, objetoFilme)
  }

  ngOnInit(): void {
    this.lerFilmes().subscribe({
      next:(generos:filmeInterface[])=>{
        this.listaFilme=generos;
        console.log(this.listaFilme);
      },
      error:()=>{
        console.log("Erro de importação de filme");
        
      }
    })
    this.formFilme = this.formBuilder.group({
      tituloFilmes: new FormControl('', [Validators.required]), selectGenero: new FormControl ('', [Validators.required])
    })

    this.lerGeneros().subscribe({
      next:(generos:generoInterface[])=>{
        this.listaGenero=generos;
        console.log(this.listaGenero);
      },
      error:()=>{
        console.log("Erro de importação de gêneros");
        
      }
    })

  }

  lerGeneros(): Observable<generoInterface[]>{
    return this.httpClient.get<generoInterface[]>(this.url_2)
  }

  excluirFilme(id:number){
    this.excluirFilmeAPI(id).subscribe({
      next:()=>{
        this.ngOnInit()
      },
      error:()=>{
        console.log("Erro ao excluir");
        
      }
    })
  }

  editarFilme(filme:filmeInterface){
    this.filmeId = filme.id
    const EditFilme = this.formFilme.controls['tituloFilmes'].setValue(filme.filme);
    const EditGenero = this.formFilme.controls['selectGenero'].setValue(filme.genero);
  }

  updateFilme(){
    const id = this.filmeId
    const filme = this.formFilme.controls['tituloFilmes'].value
    const genero = this.formFilme.controls['selectGenero'].value
    const objetoFilme:filmeInterface={id:id, filme:filme, genero:genero}
    this.editarFilmeAPI(objetoFilme).subscribe(
      {
        next:()=>{
          this.filmeId = 0
          this.ngOnInit()
        },error:()=>{
          console.log('deu ruim aqui(update)!');
        }
      }
    )
  }

  salvarFilme(){
    if (this.filmeId > 0 ) {
      this.updateFilme()
    }
    else{
      const id = (this.listaFilme[(this.listaFilme.length)-1].id) + 1
      const filme = this.formFilme.controls['tituloFilmes'].value
      const genero = this.formFilme.controls['selectGenero'].value
      const objetoFilme:filmeInterface={id:id, filme:filme, genero:genero}
  
      this.salvarFilmeAPI(objetoFilme).subscribe({
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
