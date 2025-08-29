import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IProgram } from '../interfaces/program.interface';
import { Subject } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProgramsService {
  private programs: IProgram[] = [];
  private programsUpdated = new Subject<{
    programs: IProgram[];
    programCount: number;
  }>();
  private readonly apiUrl = 'http://localhost:3001/api/programs';

  constructor(private http: HttpClient) {}

  getPrograms(programsPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${programsPerPage}&page=${currentPage}`;
    const fullUrl = this.apiUrl + queryParams;

    console.log(`Service: Requesting ${fullUrl}`);

    this.http
      .get<{ message: string; programs: any[]; maxPrograms: number }>(fullUrl)
      .pipe(
        map((programData) => {
          console.log('Service: Raw response:', programData);
          return {
            programs: programData.programs.map((program) => {
              return {
                id: program._id,
                name: program.name,
                rating: program.rating,
                costPeerMinute: program.costPeerMinute,
              };
            }),
            maxPrograms: programData.maxPrograms,
          };
        }),
        catchError((error) => {
          console.error('Service: Error fetching programs:', error);
          return throwError(() => error);
        })
      )
      .subscribe({
        next: (transformedProgramData) => {
          console.log('Service: Transformed data:', transformedProgramData);
          this.programs = transformedProgramData.programs;
          this.programsUpdated.next({
            programs: [...this.programs],
            programCount: transformedProgramData.maxPrograms,
          });
        },
        error: (error) => {
          console.error('Service: Subscription error:', error);
          this.programsUpdated.error(error);
        },
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

    return this.http
      .post<{ message: string; programId: string }>(this.apiUrl, program)
      .pipe(
        catchError((error) => {
          console.error('Service: Error adding program:', error);
          return throwError(() => error);
        })
      )
      .subscribe({
        next: (responseData) => {
          console.log('Service: Program added successfully:', responseData);
        },
        error: (error) => {
          console.error('Service: Add program subscription error:', error);
        },
      });
  }

  deleteProgram(programId: string) {
    console.log(`Service: Deleting program ${programId}`);
    return this.http.delete(`${this.apiUrl}/${programId}`).pipe(
      catchError((error) => {
        console.error('Service: Error deleting program:', error);
        return throwError(() => error);
      })
    );
  }
}
