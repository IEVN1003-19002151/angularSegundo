import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-zodiaco',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],  
  templateUrl: './zodiaco.component.html',
})
export class ZodiacoComponent implements OnInit {

  zodiacoForm: FormGroup;
  signo: string = '';
  edad: number = 0;
  imagenZodiaco: string = '';
  AnioActual: number = new Date().getFullYear(); 

  constructor(private fb: FormBuilder) {
    this.zodiacoForm = this.fb.group({
      nombre: ['', Validators.required],
      apellidoPaterno: ['', Validators.required],
      apellidoMaterno: ['', Validators.required],
      dia: ['', [Validators.required, Validators.min(1), Validators.max(31)]],
      mes: ['', [Validators.required, Validators.min(1), Validators.max(12)]],
      anio: ['', [Validators.required, Validators.min(1900), Validators.max(this.AnioActual)]],
      sexo: ['', Validators.required] 
    });
  }

  ngOnInit(): void {}

  calcularSigno(): void {
    const dia = this.zodiacoForm.get('dia')?.value;
    const mes = this.zodiacoForm.get('mes')?.value;
    const anio = this.zodiacoForm.get('anio')?.value;
  
    const fechaNacimiento = new Date(anio, mes - 1, dia);
    const hoy = new Date();
  
    this.edad = hoy.getFullYear() - anio;
  
    if (hoy.getMonth() < (mes - 1) || (hoy.getMonth() === (mes - 1) && hoy.getDate() < dia)) {
      this.edad -= 1;
    }
  
    const year = fechaNacimiento.getFullYear();
    const zodiacoSignos = ["Mono", "Gallo", "Perro",
                            "Cerdo", "Rata", "Buey",
                            "Tigre", "Conejo", "Dragón", 
                            "Serpiente", "Caballo", "Cabra"];
    this.signo = zodiacoSignos[year % 12];
  
    this.imagenZodiaco = this.getZodiacoImagenUrl(this.signo);
  }
  

  private getZodiacoImagenUrl(signo: string): string {
    switch (signo) {
      case "Mono":
        return "https://confuciomag.com/wp-content/uploads/2016/01/06_horoscopo_chino_Mono.jpg"; 
      case "Gallo":
        return "https://confuciomag.com/wp-content/uploads/2016/01/06_horoscopo_chino_Gallo.jpg"; 
      case "Perro":
        return "https://confuciomag.com/wp-content/uploads/2016/01/06_horoscopo_chino_Perro.jpg";
      case "Cerdo":
        return "https://confuciomag.com/wp-content/uploads/2016/01/06_horoscopo_chino_Cerdo.jpg"; 
      case "Rata":
        return "https://confuciomag.com/wp-content/uploads/2016/01/06_horoscopo_chino_Rata.jpg"; 
      case "Buey":
        return "https://confuciomag.com/wp-content/uploads/2016/01/06_horoscopo_chino_Buey.jpg"; 
      case "Tigre":
        return "https://confuciomag.com/wp-content/uploads/2016/01/06_horoscopo_chino_Tigre.jpg"; 
      case "Conejo":
        return "https://confuciomag.com/wp-content/uploads/2016/01/06_horoscopo_chino_Conejo.jpg"; 
      case "Dragón":
        return "https://confuciomag.com/wp-content/uploads/2016/01/06_horoscopo_chino_Dragon.jpg"; 
      case "Serpiente":
        return "https://confuciomag.com/wp-content/uploads/2016/01/06_horoscopo_chino_Serpiente.jpg"; 
      case "Caballo":
        return "https://cadenaser.com/resizer/v2/T4QC5VRNYJEMJFYDBLNOR37RKY.png?auth=183046b90c99923c83e5c26688dd8c16595006e86183fe64442900fcfc75b53b&quality=70&width=650&height=487&smart=true"; 
      case "Cabra":
        return "https://confuciomag.com/wp-content/uploads/2016/01/06_horoscopo_chino_Cabra.jpg"; 
      default:
        return ""; 
    }
  }

  onSubmit(): void {
    if (this.zodiacoForm.valid) {
      this.calcularSigno();
    }
  }
}
