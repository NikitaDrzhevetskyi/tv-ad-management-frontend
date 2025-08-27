import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IProgram } from '../interfaces/program.interface';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ProgramsService {
  private programs: IProgram[] = [];
  private programsUpdated = new Subject<IProgram[]>();

  constructor(private http: HttpClient) {}

  getPrograms() {
    this.http
      .get<{ message: string; programs: any[] }>(
        'http://localhost:3001/api/programs'
      )
      .pipe(
        map((postDate) => {
          return postDate.programs.map((program) => {
            return {
              id: program._id,
              name: program.name,
              rating: program.rating,
              costPeerMinute: program.costPeerMinute,
            };
          });
        })
      )
      .subscribe((transformedPrograms) => {
        this.programs = transformedPrograms;
        this.programsUpdated.next([...this.programs]);
      });
  }

  getProgramsUpdateListener() {
    return this.programsUpdated.asObservable();
  }

  addProgram(name: string, rating: number, costPeerMinute: number) {
    const program: IProgram = {
      id: null,
      name: name,
      rating: rating,
      costPeerMinute: costPeerMinute,
    };
    this.http
      .post<{ message: string; programId: string }>(
        'http://localhost:3001/api/programs',
        program
      )
      .subscribe((responseData) => {
        const id = responseData.programId;
        program.id = id;
        this.programs.push(program);
        this.programsUpdated.next([...this.programs]);
      });
  }

  deleteProgram(programId: string) {
    this.http
      .delete('http://localhost:3001/api/programs/' + programId)
      .subscribe(() => {
        const updatedPrograms = this.programs.filter(
          (program) => program.id !== programId
        );
        this.programs = updatedPrograms;
        this.programsUpdated.next([...this.programs]);
      });
  }
}
