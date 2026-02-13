// FreshDesk API v2 Client with Basic Auth

import type { FreshDeskConfig } from './types/index.js';

export class FreshDeskClient {
  private domain: string;
  private authHeader: string;
  private baseUrl: string;

  constructor(config: FreshDeskConfig) {
    this.domain = config.domain;
    // Basic auth: base64(apiKey:X)
    this.authHeader = 'Basic ' + Buffer.from(`${config.apiKey}:X`).toString('base64');
    this.baseUrl = `https://${this.domain}.freshdesk.com/api/v2`;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const headers = new Headers(options.headers);
    headers.set('Authorization', this.authHeader);
    headers.set('Content-Type', 'application/json');

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `FreshDesk API error (${response.status}): ${errorText}`
      );
    }

    // Handle 204 No Content
    if (response.status === 204) {
      return {} as T;
    }

    const data = await response.json();
    return data as T;
  }

  // GET request
  async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    let url = endpoint;
    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            value.forEach((v) => searchParams.append(key, String(v)));
          } else {
            searchParams.append(key, String(value));
          }
        }
      });
      const queryString = searchParams.toString();
      if (queryString) {
        url += `?${queryString}`;
      }
    }
    return this.request<T>(url, { method: 'GET' });
  }

  // POST request
  async post<T>(endpoint: string, body?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  // PUT request
  async put<T>(endpoint: string, body?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }

  // DELETE request
  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  // TICKETS
  async getTickets(params?: any) {
    return this.get('/tickets', params);
  }

  async getTicket(id: number, include?: string[]) {
    const params = include ? { include: include.join(',') } : undefined;
    return this.get(`/tickets/${id}`, params);
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

  async getTicketConversations(id: number) {
    return this.get(`/tickets/${id}/conversations`);
  }

  async addTicketReply(id: number, data: any) {
    return this.post(`/tickets/${id}/reply`, data);
  }

  async addTicketNote(id: number, data: any) {
    return this.post(`/tickets/${id}/notes`, data);
  }

  async getTicketTimeEntries(id: number) {
    return this.get(`/tickets/${id}/time_entries`);
  }

  async getTicketSatisfactionRatings(id: number) {
    return this.get(`/tickets/${id}/satisfaction_ratings`);
  }

  async searchTickets(query: string) {
    return this.get(`/search/tickets?query="${encodeURIComponent(query)}"`);
  }

  async filterTickets(query: string, params?: any) {
    return this.get(`/tickets/filter?query=${encodeURIComponent(query)}`, params);
  }

  // CONTACTS
  async getContacts(params?: any) {
    return this.get('/contacts', params);
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

  async makeContactAgent(id: number) {
    return this.put(`/contacts/${id}/make_agent`, {});
  }

  async searchContacts(params: any) {
    return this.get('/contacts/autocomplete', params);
  }

  async filterContacts(query: string) {
    return this.get(`/contacts?query=${encodeURIComponent(query)}`);
  }

  // COMPANIES
  async getCompanies(params?: any) {
    return this.get('/companies', params);
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

  async searchCompanies(name: string) {
    return this.get('/companies/autocomplete', { name });
  }

  async filterCompanies(query: string) {
    return this.get(`/companies/filter?query=${encodeURIComponent(query)}`);
  }

  // AGENTS
  async getAgents(params?: any) {
    return this.get('/agents', params);
  }

  async getAgent(id: number) {
    return this.get(`/agents/${id}`);
  }

  async updateAgent(id: number, data: any) {
    return this.put(`/agents/${id}`, data);
  }

  async deleteAgent(id: number) {
    return this.delete(`/agents/${id}`);
  }

  async getCurrentAgent() {
    return this.get('/agents/me');
  }

  // GROUPS
  async getGroups(params?: any) {
    return this.get('/groups', params);
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

  // PRODUCTS
  async getProducts(params?: any) {
    return this.get('/products', params);
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

  // ROLES
  async getRoles() {
    return this.get('/roles');
  }

  async getRole(id: number) {
    return this.get(`/roles/${id}`);
  }

  // CANNED RESPONSES
  async getCannedResponses(params?: any) {
    return this.get('/canned_responses', params);
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

  async getCannedResponseFolders() {
    return this.get('/canned_response_folders');
  }

  // SOLUTIONS (KB)
  async getSolutionCategories(params?: any) {
    return this.get('/solutions/categories', params);
  }

  async getSolutionCategory(id: number) {
    return this.get(`/solutions/categories/${id}`);
  }

  async createSolutionCategory(data: any) {
    return this.post('/solutions/categories', data);
  }

  async updateSolutionCategory(id: number, data: any) {
    return this.put(`/solutions/categories/${id}`, data);
  }

  async deleteSolutionCategory(id: number) {
    return this.delete(`/solutions/categories/${id}`);
  }

  async getSolutionFolders(category_id: number) {
    return this.get(`/solutions/categories/${category_id}/folders`);
  }

  async getSolutionFolder(category_id: number, folder_id: number) {
    return this.get(`/solutions/categories/${category_id}/folders/${folder_id}`);
  }

  async createSolutionFolder(category_id: number, data: any) {
    return this.post(`/solutions/categories/${category_id}/folders`, data);
  }

  async updateSolutionFolder(category_id: number, folder_id: number, data: any) {
    return this.put(`/solutions/categories/${category_id}/folders/${folder_id}`, data);
  }

  async deleteSolutionFolder(category_id: number, folder_id: number) {
    return this.delete(`/solutions/categories/${category_id}/folders/${folder_id}`);
  }

  async getSolutionArticles(folder_id: number, params?: any) {
    return this.get(`/solutions/folders/${folder_id}/articles`, params);
  }

  async getSolutionArticle(id: number) {
    return this.get(`/solutions/articles/${id}`);
  }

  async createSolutionArticle(folder_id: number, data: any) {
    return this.post(`/solutions/folders/${folder_id}/articles`, data);
  }

  async updateSolutionArticle(id: number, data: any) {
    return this.put(`/solutions/articles/${id}`, data);
  }

  async deleteSolutionArticle(id: number) {
    return this.delete(`/solutions/articles/${id}`);
  }

  async searchSolutions(term: string) {
    return this.get(`/solutions/articles?term=${encodeURIComponent(term)}`);
  }

  // FORUMS
  async getForumCategories() {
    return this.get('/discussions/categories');
  }

  async getForums(category_id?: number) {
    if (category_id) {
      return this.get(`/discussions/categories/${category_id}/forums`);
    }
    return this.get('/discussions/forums');
  }

  async getForum(id: number) {
    return this.get(`/discussions/forums/${id}`);
  }

  async createForum(data: any) {
    return this.post('/discussions/forums', data);
  }

  async updateForum(id: number, data: any) {
    return this.put(`/discussions/forums/${id}`, data);
  }

  async getForumTopics(forum_id: number, params?: any) {
    return this.get(`/discussions/forums/${forum_id}/topics`, params);
  }

  async getForumTopic(id: number) {
    return this.get(`/discussions/topics/${id}`);
  }

  async createForumTopic(forum_id: number, data: any) {
    return this.post(`/discussions/forums/${forum_id}/topics`, data);
  }

  async updateForumTopic(id: number, data: any) {
    return this.put(`/discussions/topics/${id}`, data);
  }

  async deleteForumTopic(id: number) {
    return this.delete(`/discussions/topics/${id}`);
  }

  async getForumPosts(topic_id: number) {
    return this.get(`/discussions/topics/${topic_id}/posts`);
  }

  async createForumPost(topic_id: number, data: any) {
    return this.post(`/discussions/topics/${topic_id}/posts`, data);
  }

  // SURVEYS
  async getSurveys() {
    return this.get('/surveys');
  }

  async getSurveyResults(survey_id: number, params?: any) {
    return this.get(`/surveys/${survey_id}/survey_results`, params);
  }

  async getSatisfactionRatings(params?: any) {
    return this.get('/surveys/satisfaction_ratings', params);
  }

  // BUSINESS HOURS
  async getBusinessHours() {
    return this.get('/business_hours');
  }

  async getBusinessHour(id: number) {
    return this.get(`/business_hours/${id}`);
  }

  // SLA POLICIES
  async getSLAPolicies() {
    return this.get('/sla_policies');
  }

  async getSLAPolicy(id: number) {
    return this.get(`/sla_policies/${id}`);
  }

  // EMAIL CONFIGS
  async getEmailConfigs() {
    return this.get('/email_configs');
  }

  async getEmailConfig(id: number) {
    return this.get(`/email_configs/${id}`);
  }

  // TICKET FIELDS
  async getTicketFields() {
    return this.get('/ticket_fields');
  }

  async getTicketField(id: number) {
    return this.get(`/ticket_fields/${id}`);
  }

  // SETTINGS
  async getSettings() {
    return this.get('/settings/helpdesk');
  }

  // TIME ENTRIES
  async getAllTimeEntries(params?: any) {
    return this.get('/time_entries', params);
  }

  async getTimeEntry(id: number) {
    return this.get(`/time_entries/${id}`);
  }

  async createTimeEntry(data: any) {
    return this.post('/time_entries', data);
  }

  async updateTimeEntry(id: number, data: any) {
    return this.put(`/time_entries/${id}`, data);
  }

  async deleteTimeEntry(id: number) {
    return this.delete(`/time_entries/${id}`);
  }

  async startTimer(id: number) {
    return this.put(`/time_entries/${id}/start_timer`, {});
  }

  async stopTimer(id: number) {
    return this.put(`/time_entries/${id}/stop_timer`, {});
  }
}
