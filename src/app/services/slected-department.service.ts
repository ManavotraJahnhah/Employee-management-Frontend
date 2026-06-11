import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SelectedDepartmentService {
  // Service utilitaire pour partager l'identifiant de l'employé sélectionné
  // Utilise un BehaviorSubject pour que les composants puissent s'abonner
  private selectedSubject = new BehaviorSubject<number | null>(null);
  selected$ = this.selectedSubject.asObservable();

  setSelected(id: number | null): void {
    this.selectedSubject.next(id);
  }

  // Retourne la valeur actuelle sans s'abonner (snapshot)
  getSelectedSnapshot(): number | null {
    return this.selectedSubject.getValue();
  }

  clear(): void {
    this.selectedSubject.next(null);
  }
}
