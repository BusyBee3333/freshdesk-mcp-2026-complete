import type { FreshDeskConfig, FreshDeskError, PaginatedResponse } from '../types/index.js';

export class FreshDeskClient {
  private domain: string;
  private apiKey: string;
  private baseUrl: string;
  private authHeader: string;

  constructor(config: FreshDeskConfig) {
    this.domain = config.domain;
    this.apiKey = config.apiKey;
    this.baseUrl = `https://${this.domain}.freshdesk.com/api/v2`;
    // FreshDesk uses Basic auth with API key as username and 'X' as password
    this.authHeader = `Basic ${Buffer.from(`${this.apiKey}:X`).toString('base64')}`;
  }

  private async request<T>(
    method: string,
    endpoint: string,
    body?: any,
    queryParams?: Record<string, any>
  ): Promise<T> {
    const url = new URL(`${this.baseUrl}${endpoint}`);
    
    if (queryParams) {
      Object.entries(queryParams).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    const headers: Record<string, string> = {
      'Authorization': this.authHeader,
      'Content-Type': 'application/json',
    };

    const options: RequestInit = {
      method,
      headers,
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(url.toString(), options);

    if (!response.ok) {
      let errorData: FreshDeskError;
      try {
        errorData = await response.json();
      } catch {
        errorData = {
          description: `HTTP ${response.status}: ${response.statusText}`,
        };
      }
      throw new Error(
        `FreshDesk API Error: ${errorData.description}${
          errorData.errors ? '\n' + JSON.stringify(errorData.errors, null, 2) : ''
        }`
      );
    }

    if (response.status === 204) {
      return {} as T;
    }

    return response.json();
  }

  async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    return this.request<T>('GET', endpoint, undefined, params);
  }

  async post<T>(endpoint: string, body: any): Promise<T> {
    return this.request<T>('POST', endpoint, body);
  }

  async put<T>(endpoint: string, body: any): Promise<T> {
    return this.request<T>('PUT', endpoint, body);
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>('DELETE', endpoint);
  }

  async paginate<T>(
    endpoint: string,
    params: Record<string, any> = {},
    maxResults?: number
  ): Promise<PaginatedResponse<T>> {
    const results: T[] = [];
    let page = 1;
    const perPage = params.per_page || 30;

    while (true) {
      const pageParams = { ...params, page, per_page: perPage };
      const pageResults = await this.get<T[]>(endpoint, pageParams);

      if (!pageResults || pageResults.length === 0) {
        break;
      }

      results.push(...pageResults);

      if (maxResults && results.length >= maxResults) {
        return {
          results: results.slice(0, maxResults),
          total: results.length,
        };
      }

      if (pageResults.length < perPage) {
        break;
      }

      page++;
    }

    return {
      results,
      total: results.length,
    };
  }

  // Ticket endpoints
  async listTickets(params?: Record<string, any>) {
    return this.paginate('/tickets', params);
  }

  async getTicket(id: number) {
    return this.get(`/tickets/${id}`);
  }

  async createTicket(data: any) {
    return this.post('/tickets', data);
  }

  async updateTicket(id: number, data: any) {
    return this.put(`/tickets/${id}`, data);
  }

  async deleteTicket(id: number) {
    return this.delete(`/tickets/${id}`);
  }

  async restoreTicket(id: number) {
    return this.put(`/tickets/${id}/restore`, {});
  }

  async listConversations(ticketId: number) {
    return this.get(`/tickets/${ticketId}/conversations`);
  }

  async addReply(ticketId: number, data: any) {
    return this.post(`/tickets/${ticketId}/reply`, data);
  }

  async addNote(ticketId: number, data: any) {
    return this.post(`/tickets/${ticketId}/notes`, data);
  }

  async listTimeEntries(ticketId: number) {
    return this.get(`/tickets/${ticketId}/time_entries`);
  }

  async addTimeEntry(ticketId: number, data: any) {
    return this.post(`/tickets/${ticketId}/time_entries`, data);
  }

  async listWatchers(ticketId: number) {
    return this.get(`/tickets/${ticketId}/watchers`);
  }

  // Contact endpoints
  async listContacts(params?: Record<string, any>) {
    return this.paginate('/contacts', params);
  }

  async getContact(id: number) {
    return this.get(`/contacts/${id}`);
  }

  async createContact(data: any) {
    return this.post('/contacts', data);
  }

  async updateContact(id: number, data: any) {
    return this.put(`/contacts/${id}`, data);
  }

  async deleteContact(id: number) {
    return this.delete(`/contacts/${id}`);
  }

  async searchContacts(query: string) {
    return this.get('/search/contacts', { query });
  }

  async mergeContacts(primaryId: number, secondaryId: number) {
    return this.post(`/contacts/${primaryId}/merge`, { secondary_contact_id: secondaryId });
  }

  async makeAgent(contactId: number, data: any) {
    return this.put(`/contacts/${contactId}/make_agent`, data);
  }

  async listContactFields() {
    return this.get('/contact_fields');
  }

  // Company endpoints
  async listCompanies(params?: Record<string, any>) {
    return this.paginate('/companies', params);
  }

  async getCompany(id: number) {
    return this.get(`/companies/${id}`);
  }

  async createCompany(data: any) {
    return this.post('/companies', data);
  }

  async updateCompany(id: number, data: any) {
    return this.put(`/companies/${id}`, data);
  }

  async deleteCompany(id: number) {
    return this.delete(`/companies/${id}`);
  }

  async listCompanyFields() {
    return this.get('/company_fields');
  }

  // Agent endpoints
  async listAgents(params?: Record<string, any>) {
    return this.paginate('/agents', params);
  }

  async getAgent(id: number) {
    return this.get(`/agents/${id}`);
  }

  async updateAgent(id: number, data: any) {
    return this.put(`/agents/${id}`, data);
  }

  async getCurrentAgent() {
    return this.get('/agents/me');
  }

  // Group endpoints
  async listGroups(params?: Record<string, any>) {
    return this.paginate('/groups', params);
  }

  async getGroup(id: number) {
    return this.get(`/groups/${id}`);
  }

  async createGroup(data: any) {
    return this.post('/groups', data);
  }

  async updateGroup(id: number, data: any) {
    return this.put(`/groups/${id}`, data);
  }

  async deleteGroup(id: number) {
    return this.delete(`/groups/${id}`);
  }

  // Role endpoints
  async listRoles() {
    return this.get('/roles');
  }

  async getRole(id: number) {
    return this.get(`/roles/${id}`);
  }

  // Product endpoints
  async listProducts(params?: Record<string, any>) {
    return this.paginate('/products', params);
  }

  async getProduct(id: number) {
    return this.get(`/products/${id}`);
  }

  async createProduct(data: any) {
    return this.post('/products', data);
  }

  async updateProduct(id: number, data: any) {
    return this.put(`/products/${id}`, data);
  }

  async deleteProduct(id: number) {
    return this.delete(`/products/${id}`);
  }

  // Forum endpoints
  async listForumCategories() {
    return this.get('/discussions/categories');
  }

  async getForumCategory(id: number) {
    return this.get(`/discussions/categories/${id}`);
  }

  async listForums(categoryId?: number) {
    const endpoint = categoryId 
      ? `/discussions/categories/${categoryId}/forums`
      : '/discussions/forums';
    return this.get(endpoint);
  }

  async getForum(id: number) {
    return this.get(`/discussions/forums/${id}`);
  }

  async listTopics(forumId: number, params?: Record<string, any>) {
    return this.get(`/discussions/forums/${forumId}/topics`, params);
  }

  async createTopic(forumId: number, data: any) {
    return this.post(`/discussions/forums/${forumId}/topics`, data);
  }

  // Solution endpoints
  async listSolutionCategories() {
    return this.get('/solutions/categories');
  }

  async getSolutionCategory(id: number) {
    return this.get(`/solutions/categories/${id}`);
  }

  async listSolutionFolders(categoryId: number) {
    return this.get(`/solutions/categories/${categoryId}/folders`);
  }

  async getSolutionFolder(id: number) {
    return this.get(`/solutions/folders/${id}`);
  }

  async listArticles(folderId: number) {
    return this.get(`/solutions/folders/${folderId}/articles`);
  }

  async getArticle(id: number) {
    return this.get(`/solutions/articles/${id}`);
  }

  async createArticle(folderId: number, data: any) {
    return this.post(`/solutions/folders/${folderId}/articles`, data);
  }

  async updateArticle(id: number, data: any) {
    return this.put(`/solutions/articles/${id}`, data);
  }

  // Canned Response endpoints
  async listCannedResponses() {
    return this.get('/canned_responses');
  }

  async getCannedResponse(id: number) {
    return this.get(`/canned_responses/${id}`);
  }

  async createCannedResponse(data: any) {
    return this.post('/canned_responses', data);
  }

  async updateCannedResponse(id: number, data: any) {
    return this.put(`/canned_responses/${id}`, data);
  }

  async deleteCannedResponse(id: number) {
    return this.delete(`/canned_responses/${id}`);
  }

  // Survey endpoints
  async listSurveys() {
    return this.get('/surveys/satisfaction_surveys');
  }

  async getSatisfactionRatings(params?: Record<string, any>) {
    return this.get('/surveys/satisfaction_ratings', params);
  }
}
