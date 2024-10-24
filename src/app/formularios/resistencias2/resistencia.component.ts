import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface Resistencia {
  primeraBanda: string;
  segundaBanda: string;
  terceraBanda: string;
  tolerancia: string;
  valor: number;
  valorMax: number;
  valorMin: number;
}

@Component({
  selector: 'app-resistencia',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './resistencias2.component.html',
  styleUrls: ['./resistencias2.component.css']
})
export default class ResistenciaComponent implements OnInit {
  resistenciaForm!: FormGroup;
  resistencia: Resistencia | null = null; 
  historialResistencias: any[] = [];
  resultados: any[] = [];
  mostrarResultados: boolean = false;

  colorColores: { [key: string]: number } = {
    Negro: 0, Café: 1, Rojo: 2, Naranja: 3, Amarillo: 4,
    Verde: 5, Azul: 6, Morado: 7, Gris: 8, Blanco: 9
  };

  multiplicarValores: { [key: string]: number } = {
    Negro: 1, Café: 10, Rojo: 100, Naranja: 1000, Amarillo: 10000,
    Verde: 100000, Azul: 1000000, Morado: 10000000,
    Gris: 100000000, Blanco: 1000000000
  };

  toleranciaValores: { [key: string]: number } = {
    Oro: 5, Plata: 10
  };

  registroSeleccionado: any = null;

  colores: string[] = ['Negro', 'Café', 'Rojo',
     'Naranja', 'Amarillo', 'Verde',
      'Azul', 'Morado', 'Gris', 'Blanco'];

  constructor(private readonly fb: FormBuilder) {}

  ngOnInit(): void {
    this.resistenciaForm = this.initForm();
  
    const storedResultados = localStorage.getItem('resultadosResistencia');
    if (storedResultados) {
      this.resultados = JSON.parse(storedResultados);
    }
  }

  initForm(): FormGroup {
    return this.fb.group({
      PrimeraBanda: ['', Validators.required],
      SegundaBanda: ['', Validators.required],
      TerceraBanda: ['', Validators.required],
      Tolerancia: ['', Validators.required]
    });
  }

  calcularResistencia(): void {
    const { PrimeraBanda, SegundaBanda, TerceraBanda, Tolerancia } = this.resistenciaForm.value;
    const valor = (this.colorColores[PrimeraBanda] * 10 + this.colorColores[SegundaBanda]) * this.multiplicarValores[TerceraBanda];
    const tolerancia = this.toleranciaValores[Tolerancia];
    const nuevoResultado = {
      primeraBanda: PrimeraBanda, segundaBanda: SegundaBanda, terceraBanda: TerceraBanda, tolerancia: Tolerancia,
      valor, valorMin: valor - (valor * tolerancia / 100), valorMax: valor + (valor * tolerancia / 100)
    };
    this.guardarEnLocalStorage(nuevoResultado);
    this.mostrarResultados = false;
  }

  guardarEnLocalStorage(nuevoResultado: any) {
    this.resultados.unshift(nuevoResultado);
    localStorage.setItem('resultadosResistencia', JSON.stringify(this.resultados));
  }
  
  subImprime(): void {
    const resistenciaGuardada = localStorage.getItem('resistencia');
    if (resistenciaGuardada) this.resistencia = JSON.parse(resistenciaGuardada);
  }

  private colorClasses: { [key: string]: string } = {
    'Negro': 'bg-black text-white',
    'Café': 'bg-amber-700 text-white',
    'Rojo': 'bg-red-600 text-white',
    'Naranja': 'bg-orange-600 text-white',
    'Amarillo': 'bg-yellow-500 text-white',
    'Verde': 'bg-green-600 text-white',
    'Azul': 'bg-blue-600 text-white',
    'Morado': 'bg-purple-600 text-white',
    'Gris': 'bg-gray-600 text-white',
    'Blanco': 'bg-white text-black',
    'Oro': 'bg-yellow-300 text-black',
    'Plata': 'bg-gray-300 text-black'
  };

  getColorClass(color: string): string {
    return this.colorClasses[color] || '';
  }

  mostrarResultadosImprimir() {
    this.resultados = JSON.parse(localStorage.getItem('resultadosResistencia') || '[]');
    this.mostrarResultados = true;
  }

  seleccionarRegistro(registro: any): void {
    this.registroSeleccionado = registro;
  }

  eliminarRegistroSeleccionado(): void {
    if (this.registroSeleccionado) {
      const dato = this.resultados.indexOf(this.registroSeleccionado);
      if (dato > -1) {
        this.resultados.splice(dato, 1);
        localStorage.setItem('resultadosResistencia', JSON.stringify(this.resultados));
        this.registroSeleccionado = null;
      }
    }
  }

  eliminarRegistro(index: number): void {
    this.resultados.splice(index, 1);
  }
}
