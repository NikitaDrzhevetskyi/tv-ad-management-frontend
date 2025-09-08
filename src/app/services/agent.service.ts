import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IAgent } from '../interfaces/agent.interface';
import { Subject, Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AgentService {
  private readonly apiUrl = 'http://localhost:3001/api/agents';
  private agentsUpdated = new Subject<{
    agents: IAgent[];
    agentCount: number;
  }>();

  constructor(private http: HttpClient) {}

  createAgent(agentData: IAgent): Observable<any> {
    return this.http
      .post<{ message: string; agent: IAgent }>(this.apiUrl, agentData)
      .pipe(
        catchError((error) => {
          console.error('Error creating agent:', error);
          return throwError(error);
        })
      );
  }

  getAgents(agentsPerPage: number, currentPage: number): void {
    const queryParams = `?pagesize=${agentsPerPage}&page=${currentPage}`;

    this.http
      .get<{ message: string; agents: IAgent[]; maxAgents: number }>(
        this.apiUrl + queryParams
      )
      .pipe(
        catchError((error) => {
          console.error('Error fetching agents:', error);
          return throwError(error);
        })
      )
      .subscribe((agentData) => {
        this.agentsUpdated.next({
          agents: agentData.agents,
          agentCount: agentData.maxAgents,
        });
      });
  }

  getAgentById(agentId: string): Observable<IAgent> {
    return this.http
      .get<{ message: string; agent: IAgent }>(`${this.apiUrl}/${agentId}`)
      .pipe(
        map((response) => response.agent),
        catchError((error) => {
          console.error('Error fetching agent:', error);
          return throwError(error);
        })
      );
  }

  updateAgent(agentId: string, agentData: IAgent): Observable<any> {
    return this.http
      .put<{ message: string; agent: IAgent }>(
        `${this.apiUrl}/${agentId}`,
        agentData
      )
      .pipe(
        catchError((error) => {
          console.error('Error updating agent:', error);
          return throwError(error);
        })
      );
  }

  deleteAgent(agentId: string): Observable<any> {
    return this.http
      .delete<{ message: string }>(`${this.apiUrl}/${agentId}`)
      .pipe(
        catchError((error) => {
          console.error('Error deleting agent:', error);
          return throwError(error);
        })
      );
  }

  getAgentsUpdateListener(): Observable<{
    agents: IAgent[];
    agentCount: number;
  }> {
    return this.agentsUpdated.asObservable();
  }
}
