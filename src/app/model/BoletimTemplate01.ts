import { Arquivo } from "./arquivo"

export class BoletimTemplate01 {
    id: number
	
	titulo: string = " "

	textoIntroducao: string= " "
	tituloPrimeiroBanner: string= " "
	textoPrimeiroBanner: string= " " 
	textoBotao01: string= " "
	imagemPrimeiroBanner: Arquivo
	
	textoChamada01: string = " ";
	tituloChamada01: string= " "
	subtituloChamada01: string= " "
	tituloChamada02: string= " ";
	subtituloChamada02: string= " ";
	textoChamada02: string= " ";
	
	imagemPrincipal: Arquivo
	tituloImagemPrincipal: string= " ";
	legendaImagemPrincipal: string= " ";
	tituloChamada03: string= " ";
	subtituloChamada03: string= " ";
	textoChamada03: string= " ";
	tituloChamada04: string= " ";
	subtituloChamada04: string= " ";
	textoChamada04: string= " ";
	
	imagemSegundoBanner: Arquivo
	tituloSegundoBanner: string= " ";
	textoSegundoBanner: string= " ";
	textoBotao02: string= " ";
	textoFinal: string= " ";
}