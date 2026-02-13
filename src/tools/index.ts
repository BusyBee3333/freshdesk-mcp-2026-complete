// FreshDesk MCP Tools - 60+ comprehensive tools

import { z } from 'zod';
import type { FreshDeskClient } from '../api-client.js';

export function registerTools(client: FreshDeskClient) {
  return [
    // ==================== TICKET TOOLS ====================
    {
      name: 'freshdesk_list_tickets',
      description: 'List all tickets with optional filters and pagination',
      inputSchema: z.object({
        page: z.number().optional().describe('Page number'),
        per_page: z.number().optional().describe('Results per page (max 100)'),
        updated_since: z.string().optional().describe('Filter by updated date (ISO 8601)'),
        include: z.array(z.string()).optional().describe('Include related resources: requester, company, stats'),
        order_by: z.string().optional().describe('Field to order by'),
        order_type: z.enum(['asc', 'desc']).optional().describe('Sort order'),
      }),
      execute: async (args: any) => {
        const tickets = await client.getTickets(args);
        return { tickets };
      },
    },

    {
      name: 'freshdesk_get_ticket',
      description: 'Get a specific ticket by ID',
      inputSchema: z.object({
        id: z.number().describe('Ticket ID'),
        include: z.array(z.string()).optional().describe('Include: requester, company, stats, conversations'),
      }),
      execute: async (args: any) => {
        const ticket = await client.getTicket(args.id, args.include);
        return { ticket };
      },
    },

    {
      name: 'freshdesk_create_ticket',
      description: 'Create a new support ticket',
      inputSchema: z.object({
        subject: z.string().describe('Ticket subject'),
        description: z.string().describe('Ticket description (HTML allowed)'),
        email: z.string().email().optional().describe('Requester email'),
        phone: z.string().optional().describe('Requester phone'),
        requester_id: z.number().optional().describe('Existing contact ID'),
        status: z.number().optional().describe('Status: 2=Open, 3=Pending, 4=Resolved, 5=Closed'),
        priority: z.number().optional().describe('Priority: 1=Low, 2=Medium, 3=High, 4=Urgent'),
        source: z.number().optional().describe('Source: 1=Email, 2=Portal, 3=Phone, 7=Chat'),
        type: z.string().optional().describe('Ticket type'),
        group_id: z.number().optional().describe('Group ID'),
        product_id: z.number().optional().describe('Product ID'),
        company_id: z.number().optional().describe('Company ID'),
        tags: z.array(z.string()).optional().describe('Tags'),
        cc_emails: z.array(z.string()).optional().describe('CC email addresses'),
        custom_fields: z.record(z.any()).optional().describe('Custom field values'),
      }),
      execute: async (args: any) => {
        const ticket = await client.createTicket(args);
        return { ticket, message: 'Ticket created successfully' };
      },
    },

    {
      name: 'freshdesk_update_ticket',
      description: 'Update an existing ticket',
      inputSchema: z.object({
        id: z.number().describe('Ticket ID'),
        subject: z.string().optional().describe('New subject'),
        description: z.string().optional().describe('New description'),
        status: z.number().optional().describe('Status: 2=Open, 3=Pending, 4=Resolved, 5=Closed'),
        priority: z.number().optional().describe('Priority: 1=Low, 2=Medium, 3=High, 4=Urgent'),
        type: z.string().optional().describe('Ticket type'),
        group_id: z.number().optional().describe('Assign to group'),
        responder_id: z.number().optional().describe('Assign to agent'),
        tags: z.array(z.string()).optional().describe('Tags'),
        custom_fields: z.record(z.any()).optional().describe('Custom fields'),
      }),
      execute: async (args: any) => {
        const { id, ...data } = args;
        const ticket = await client.updateTicket(id, data);
        return { ticket, message: 'Ticket updated successfully' };
      },
    },

    {
      name: 'freshdesk_delete_ticket',
      description: 'Delete (trash) a ticket',
      inputSchema: z.object({
        id: z.number().describe('Ticket ID'),
      }),
      execute: async (args: any) => {
        await client.deleteTicket(args.id);
        return { message: 'Ticket deleted successfully' };
      },
    },

    {
      name: 'freshdesk_restore_ticket',
      description: 'Restore a deleted ticket',
      inputSchema: z.object({
        id: z.number().describe('Ticket ID'),
      }),
      execute: async (args: any) => {
        await client.restoreTicket(args.id);
        return { message: 'Ticket restored successfully' };
      },
    },

    {
      name: 'freshdesk_search_tickets',
      description: 'Search tickets using query string',
      inputSchema: z.object({
        query: z.string().describe('Search query (e.g., "priority:3 AND status:2")'),
      }),
      execute: async (args: any) => {
        const results = await client.searchTickets(args.query);
        return { results };
      },
    },

    {
      name: 'freshdesk_filter_tickets',
      description: 'Filter tickets with advanced query',
      inputSchema: z.object({
        query: z.string().describe('Filter query string'),
        page: z.number().optional().describe('Page number'),
        per_page: z.number().optional().describe('Results per page'),
      }),
      execute: async (args: any) => {
        const { query, ...params } = args;
        const results = await client.filterTickets(query, params);
        return { results };
      },
    },

    {
      name: 'freshdesk_get_ticket_conversations',
      description: 'Get all conversations (replies/notes) for a ticket',
      inputSchema: z.object({
        id: z.number().describe('Ticket ID'),
      }),
      execute: async (args: any) => {
        const conversations = await client.getTicketConversations(args.id);
        return { conversations };
      },
    },

    {
      name: 'freshdesk_add_ticket_reply',
      description: 'Add a public reply to a ticket',
      inputSchema: z.object({
        id: z.number().describe('Ticket ID'),
        body: z.string().describe('Reply content (HTML allowed)'),
        from_email: z.string().optional().describe('From email address'),
        user_id: z.number().optional().describe('Agent user ID'),
        cc_emails: z.array(z.string()).optional().describe('CC addresses'),
        bcc_emails: z.array(z.string()).optional().describe('BCC addresses'),
      }),
      execute: async (args: any) => {
        const { id, ...data } = args;
        const reply = await client.addTicketReply(id, data);
        return { reply, message: 'Reply added successfully' };
      },
    },

    {
      name: 'freshdesk_add_ticket_note',
      description: 'Add a private note to a ticket',
      inputSchema: z.object({
        id: z.number().describe('Ticket ID'),
        body: z.string().describe('Note content (HTML allowed)'),
        user_id: z.number().optional().describe('Agent user ID'),
        notify_emails: z.array(z.string()).optional().describe('Agents to notify'),
        private: z.boolean().optional().describe('Private note (default true)'),
      }),
      execute: async (args: any) => {
        const { id, ...data } = args;
        const note = await client.addTicketNote(id, data);
        return { note, message: 'Note added successfully' };
      },
    },

    {
      name: 'freshdesk_get_ticket_time_entries',
      description: 'Get time entries logged on a ticket',
      inputSchema: z.object({
        id: z.number().describe('Ticket ID'),
      }),
      execute: async (args: any) => {
        const timeEntries = await client.getTicketTimeEntries(args.id);
        return { timeEntries };
      },
    },

    {
      name: 'freshdesk_get_ticket_satisfaction',
      description: 'Get satisfaction ratings for a ticket',
      inputSchema: z.object({
        id: z.number().describe('Ticket ID'),
      }),
      execute: async (args: any) => {
        const ratings = await client.getTicketSatisfactionRatings(args.id);
        return { ratings };
      },
    },

    // ==================== CONTACT TOOLS ====================
    {
      name: 'freshdesk_list_contacts',
      description: 'List all contacts with optional filters',
      inputSchema: z.object({
        page: z.number().optional().describe('Page number'),
        per_page: z.number().optional().describe('Results per page'),
        email: z.string().optional().describe('Filter by email'),
        mobile: z.string().optional().describe('Filter by mobile'),
        phone: z.string().optional().describe('Filter by phone'),
        company_id: z.number().optional().describe('Filter by company'),
        state: z.enum(['verified', 'unverified', 'all', 'deleted', 'blocked']).optional(),
      }),
      execute: async (args: any) => {
        const contacts = await client.getContacts(args);
        return { contacts };
      },
    },

    {
      name: 'freshdesk_get_contact',
      description: 'Get a specific contact by ID',
      inputSchema: z.object({
        id: z.number().describe('Contact ID'),
      }),
      execute: async (args: any) => {
        const contact = await client.getContact(args.id);
        return { contact };
      },
    },

    {
      name: 'freshdesk_create_contact',
      description: 'Create a new contact',
      inputSchema: z.object({
        name: z.string().describe('Contact name'),
        email: z.string().email().optional().describe('Email address'),
        phone: z.string().optional().describe('Phone number'),
        mobile: z.string().optional().describe('Mobile number'),
        twitter_id: z.string().optional().describe('Twitter handle'),
        unique_external_id: z.string().optional().describe('External ID'),
        description: z.string().optional().describe('Description/notes'),
        job_title: z.string().optional().describe('Job title'),
        language: z.string().optional().describe('Language code (e.g., en)'),
        time_zone: z.string().optional().describe('Time zone'),
        company_id: z.number().optional().describe('Company ID'),
        address: z.string().optional().describe('Address'),
        tags: z.array(z.string()).optional().describe('Tags'),
        custom_fields: z.record(z.any()).optional().describe('Custom fields'),
      }),
      execute: async (args: any) => {
        const contact = await client.createContact(args);
        return { contact, message: 'Contact created successfully' };
      },
    },

    {
      name: 'freshdesk_update_contact',
      description: 'Update an existing contact',
      inputSchema: z.object({
        id: z.number().describe('Contact ID'),
        name: z.string().optional().describe('Contact name'),
        email: z.string().email().optional().describe('Email address'),
        phone: z.string().optional().describe('Phone number'),
        mobile: z.string().optional().describe('Mobile number'),
        job_title: z.string().optional().describe('Job title'),
        company_id: z.number().optional().describe('Company ID'),
        address: z.string().optional().describe('Address'),
        tags: z.array(z.string()).optional().describe('Tags'),
        custom_fields: z.record(z.any()).optional().describe('Custom fields'),
      }),
      execute: async (args: any) => {
        const { id, ...data } = args;
        const contact = await client.updateContact(id, data);
        return { contact, message: 'Contact updated successfully' };
      },
    },

    {
      name: 'freshdesk_delete_contact',
      description: 'Delete a contact permanently',
      inputSchema: z.object({
        id: z.number().describe('Contact ID'),
      }),
      execute: async (args: any) => {
        await client.deleteContact(args.id);
        return { message: 'Contact deleted successfully' };
      },
    },

    {
      name: 'freshdesk_make_agent',
      description: 'Convert a contact to an agent',
      inputSchema: z.object({
        id: z.number().describe('Contact ID'),
      }),
      execute: async (args: any) => {
        const agent = await client.makeContactAgent(args.id);
        return { agent, message: 'Contact converted to agent successfully' };
      },
    },

    {
      name: 'freshdesk_search_contacts',
      description: 'Search contacts by name or email',
      inputSchema: z.object({
        query: z.string().describe('Search query (name or email)'),
      }),
      execute: async (args: any) => {
        const contacts = await client.searchContacts({ query: args.query });
        return { contacts };
      },
    },

    {
      name: 'freshdesk_filter_contacts',
      description: 'Filter contacts with query string',
      inputSchema: z.object({
        query: z.string().describe('Filter query'),
      }),
      execute: async (args: any) => {
        const contacts = await client.filterContacts(args.query);
        return { contacts };
      },
    },

    // ==================== COMPANY TOOLS ====================
    {
      name: 'freshdesk_list_companies',
      description: 'List all companies with pagination',
      inputSchema: z.object({
        page: z.number().optional().describe('Page number'),
        per_page: z.number().optional().describe('Results per page'),
      }),
      execute: async (args: any) => {
        const companies = await client.getCompanies(args);
        return { companies };
      },
    },

    {
      name: 'freshdesk_get_company',
      description: 'Get a specific company by ID',
      inputSchema: z.object({
        id: z.number().describe('Company ID'),
      }),
      execute: async (args: any) => {
        const company = await client.getCompany(args.id);
        return { company };
      },
    },

    {
      name: 'freshdesk_create_company',
      description: 'Create a new company',
      inputSchema: z.object({
        name: z.string().describe('Company name'),
        description: z.string().optional().describe('Description'),
        domains: z.array(z.string()).optional().describe('Email domains'),
        note: z.string().optional().describe('Internal note'),
        custom_fields: z.record(z.any()).optional().describe('Custom fields'),
        health_score: z.string().optional().describe('Health score'),
        account_tier: z.string().optional().describe('Account tier'),
        renewal_date: z.string().optional().describe('Renewal date (ISO 8601)'),
        industry: z.string().optional().describe('Industry'),
      }),
      execute: async (args: any) => {
        const company = await client.createCompany(args);
        return { company, message: 'Company created successfully' };
      },
    },

    {
      name: 'freshdesk_update_company',
      description: 'Update an existing company',
      inputSchema: z.object({
        id: z.number().describe('Company ID'),
        name: z.string().optional().describe('Company name'),
        description: z.string().optional().describe('Description'),
        domains: z.array(z.string()).optional().describe('Email domains'),
        note: z.string().optional().describe('Internal note'),
        custom_fields: z.record(z.any()).optional().describe('Custom fields'),
      }),
      execute: async (args: any) => {
        const { id, ...data } = args;
        const company = await client.updateCompany(id, data);
        return { company, message: 'Company updated successfully' };
      },
    },

    {
      name: 'freshdesk_delete_company',
      description: 'Delete a company',
      inputSchema: z.object({
        id: z.number().describe('Company ID'),
      }),
      execute: async (args: any) => {
        await client.deleteCompany(args.id);
        return { message: 'Company deleted successfully' };
      },
    },

    {
      name: 'freshdesk_search_companies',
      description: 'Search companies by name',
      inputSchema: z.object({
        name: z.string().describe('Company name to search'),
      }),
      execute: async (args: any) => {
        const companies = await client.searchCompanies(args.name);
        return { companies };
      },
    },

    {
      name: 'freshdesk_filter_companies',
      description: 'Filter companies with query',
      inputSchema: z.object({
        query: z.string().describe('Filter query'),
      }),
      execute: async (args: any) => {
        const companies = await client.filterCompanies(args.query);
        return { companies };
      },
    },

    // ==================== AGENT TOOLS ====================
    {
      name: 'freshdesk_list_agents',
      description: 'List all agents',
      inputSchema: z.object({
        page: z.number().optional().describe('Page number'),
        per_page: z.number().optional().describe('Results per page'),
      }),
      execute: async (args: any) => {
        const agents = await client.getAgents(args);
        return { agents };
      },
    },

    {
      name: 'freshdesk_get_agent',
      description: 'Get a specific agent by ID',
      inputSchema: z.object({
        id: z.number().describe('Agent ID'),
      }),
      execute: async (args: any) => {
        const agent = await client.getAgent(args.id);
        return { agent };
      },
    },

    {
      name: 'freshdesk_get_current_agent',
      description: 'Get currently authenticated agent details',
      inputSchema: z.object({}),
      execute: async () => {
        const agent = await client.getCurrentAgent();
        return { agent };
      },
    },

    {
      name: 'freshdesk_update_agent',
      description: 'Update an agent',
      inputSchema: z.object({
        id: z.number().describe('Agent ID'),
        occasional: z.boolean().optional().describe('Occasional agent'),
        signature: z.string().optional().describe('Email signature'),
        ticket_scope: z.number().optional().describe('Ticket scope'),
      }),
      execute: async (args: any) => {
        const { id, ...data } = args;
        const agent = await client.updateAgent(id, data);
        return { agent, message: 'Agent updated successfully' };
      },
    },

    {
      name: 'freshdesk_delete_agent',
      description: 'Delete (deactivate) an agent',
      inputSchema: z.object({
        id: z.number().describe('Agent ID'),
      }),
      execute: async (args: any) => {
        await client.deleteAgent(args.id);
        return { message: 'Agent deleted successfully' };
      },
    },

    // ==================== GROUP TOOLS ====================
    {
      name: 'freshdesk_list_groups',
      description: 'List all agent groups',
      inputSchema: z.object({
        page: z.number().optional().describe('Page number'),
        per_page: z.number().optional().describe('Results per page'),
      }),
      execute: async (args: any) => {
        const groups = await client.getGroups(args);
        return { groups };
      },
    },

    {
      name: 'freshdesk_get_group',
      description: 'Get a specific group by ID',
      inputSchema: z.object({
        id: z.number().describe('Group ID'),
      }),
      execute: async (args: any) => {
        const group = await client.getGroup(args.id);
        return { group };
      },
    },

    {
      name: 'freshdesk_create_group',
      description: 'Create a new agent group',
      inputSchema: z.object({
        name: z.string().describe('Group name'),
        description: z.string().optional().describe('Group description'),
        escalate_to: z.number().optional().describe('Escalate to group ID'),
        unassigned_for: z.string().optional().describe('Time before escalation'),
        business_calendar_id: z.number().optional().describe('Business hours ID'),
        agent_ids: z.array(z.number()).optional().describe('Agent IDs'),
      }),
      execute: async (args: any) => {
        const group = await client.createGroup(args);
        return { group, message: 'Group created successfully' };
      },
    },

    {
      name: 'freshdesk_update_group',
      description: 'Update an existing group',
      inputSchema: z.object({
        id: z.number().describe('Group ID'),
        name: z.string().optional().describe('Group name'),
        description: z.string().optional().describe('Group description'),
        escalate_to: z.number().optional().describe('Escalate to group ID'),
        agent_ids: z.array(z.number()).optional().describe('Agent IDs'),
      }),
      execute: async (args: any) => {
        const { id, ...data } = args;
        const group = await client.updateGroup(id, data);
        return { group, message: 'Group updated successfully' };
      },
    },

    {
      name: 'freshdesk_delete_group',
      description: 'Delete a group',
      inputSchema: z.object({
        id: z.number().describe('Group ID'),
      }),
      execute: async (args: any) => {
        await client.deleteGroup(args.id);
        return { message: 'Group deleted successfully' };
      },
    },

    // ==================== PRODUCT TOOLS ====================
    {
      name: 'freshdesk_list_products',
      description: 'List all products',
      inputSchema: z.object({
        page: z.number().optional().describe('Page number'),
        per_page: z.number().optional().describe('Results per page'),
      }),
      execute: async (args: any) => {
        const products = await client.getProducts(args);
        return { products };
      },
    },

    {
      name: 'freshdesk_get_product',
      description: 'Get a specific product by ID',
      inputSchema: z.object({
        id: z.number().describe('Product ID'),
      }),
      execute: async (args: any) => {
        const product = await client.getProduct(args.id);
        return { product };
      },
    },

    {
      name: 'freshdesk_create_product',
      description: 'Create a new product',
      inputSchema: z.object({
        name: z.string().describe('Product name'),
        description: z.string().optional().describe('Product description'),
      }),
      execute: async (args: any) => {
        const product = await client.createProduct(args);
        return { product, message: 'Product created successfully' };
      },
    },

    {
      name: 'freshdesk_update_product',
      description: 'Update an existing product',
      inputSchema: z.object({
        id: z.number().describe('Product ID'),
        name: z.string().optional().describe('Product name'),
        description: z.string().optional().describe('Product description'),
      }),
      execute: async (args: any) => {
        const { id, ...data } = args;
        const product = await client.updateProduct(id, data);
        return { product, message: 'Product updated successfully' };
      },
    },

    {
      name: 'freshdesk_delete_product',
      description: 'Delete a product',
      inputSchema: z.object({
        id: z.number().describe('Product ID'),
      }),
      execute: async (args: any) => {
        await client.deleteProduct(args.id);
        return { message: 'Product deleted successfully' };
      },
    },

    // ==================== ROLE TOOLS ====================
    {
      name: 'freshdesk_list_roles',
      description: 'List all agent roles',
      inputSchema: z.object({}),
      execute: async () => {
        const roles = await client.getRoles();
        return { roles };
      },
    },

    {
      name: 'freshdesk_get_role',
      description: 'Get a specific role by ID',
      inputSchema: z.object({
        id: z.number().describe('Role ID'),
      }),
      execute: async (args: any) => {
        const role = await client.getRole(args.id);
        return { role };
      },
    },

    // ==================== CANNED RESPONSE TOOLS ====================
    {
      name: 'freshdesk_list_canned_responses',
      description: 'List all canned responses',
      inputSchema: z.object({
        page: z.number().optional().describe('Page number'),
        per_page: z.number().optional().describe('Results per page'),
      }),
      execute: async (args: any) => {
        const responses = await client.getCannedResponses(args);
        return { responses };
      },
    },

    {
      name: 'freshdesk_get_canned_response',
      description: 'Get a specific canned response by ID',
      inputSchema: z.object({
        id: z.number().describe('Canned response ID'),
      }),
      execute: async (args: any) => {
        const response = await client.getCannedResponse(args.id);
        return { response };
      },
    },

    {
      name: 'freshdesk_create_canned_response',
      description: 'Create a new canned response',
      inputSchema: z.object({
        title: z.string().describe('Response title'),
        content: z.string().describe('Response content (HTML allowed)'),
        folder_id: z.number().optional().describe('Folder ID'),
      }),
      execute: async (args: any) => {
        const response = await client.createCannedResponse(args);
        return { response, message: 'Canned response created successfully' };
      },
    },

    {
      name: 'freshdesk_update_canned_response',
      description: 'Update an existing canned response',
      inputSchema: z.object({
        id: z.number().describe('Canned response ID'),
        title: z.string().optional().describe('Response title'),
        content: z.string().optional().describe('Response content'),
      }),
      execute: async (args: any) => {
        const { id, ...data } = args;
        const response = await client.updateCannedResponse(id, data);
        return { response, message: 'Canned response updated successfully' };
      },
    },

    {
      name: 'freshdesk_delete_canned_response',
      description: 'Delete a canned response',
      inputSchema: z.object({
        id: z.number().describe('Canned response ID'),
      }),
      execute: async (args: any) => {
        await client.deleteCannedResponse(args.id);
        return { message: 'Canned response deleted successfully' };
      },
    },

    {
      name: 'freshdesk_list_canned_response_folders',
      description: 'List all canned response folders',
      inputSchema: z.object({}),
      execute: async () => {
        const folders = await client.getCannedResponseFolders();
        return { folders };
      },
    },

    // ==================== SOLUTION/KB TOOLS ====================
    {
      name: 'freshdesk_list_solution_categories',
      description: 'List all knowledge base categories',
      inputSchema: z.object({
        page: z.number().optional().describe('Page number'),
        per_page: z.number().optional().describe('Results per page'),
      }),
      execute: async (args: any) => {
        const categories = await client.getSolutionCategories(args);
        return { categories };
      },
    },

    {
      name: 'freshdesk_get_solution_category',
      description: 'Get a specific KB category by ID',
      inputSchema: z.object({
        id: z.number().describe('Category ID'),
      }),
      execute: async (args: any) => {
        const category = await client.getSolutionCategory(args.id);
        return { category };
      },
    },

    {
      name: 'freshdesk_create_solution_category',
      description: 'Create a new KB category',
      inputSchema: z.object({
        name: z.string().describe('Category name'),
        description: z.string().optional().describe('Category description'),
      }),
      execute: async (args: any) => {
        const category = await client.createSolutionCategory(args);
        return { category, message: 'Category created successfully' };
      },
    },

    {
      name: 'freshdesk_update_solution_category',
      description: 'Update a KB category',
      inputSchema: z.object({
        id: z.number().describe('Category ID'),
        name: z.string().optional().describe('Category name'),
        description: z.string().optional().describe('Description'),
      }),
      execute: async (args: any) => {
        const { id, ...data } = args;
        const category = await client.updateSolutionCategory(id, data);
        return { category, message: 'Category updated successfully' };
      },
    },

    {
      name: 'freshdesk_delete_solution_category',
      description: 'Delete a KB category',
      inputSchema: z.object({
        id: z.number().describe('Category ID'),
      }),
      execute: async (args: any) => {
        await client.deleteSolutionCategory(args.id);
        return { message: 'Category deleted successfully' };
      },
    },

    {
      name: 'freshdesk_list_solution_folders',
      description: 'List all folders in a KB category',
      inputSchema: z.object({
        category_id: z.number().describe('Category ID'),
      }),
      execute: async (args: any) => {
        const folders = await client.getSolutionFolders(args.category_id);
        return { folders };
      },
    },

    {
      name: 'freshdesk_get_solution_folder',
      description: 'Get a specific KB folder',
      inputSchema: z.object({
        category_id: z.number().describe('Category ID'),
        folder_id: z.number().describe('Folder ID'),
      }),
      execute: async (args: any) => {
        const folder = await client.getSolutionFolder(args.category_id, args.folder_id);
        return { folder };
      },
    },

    {
      name: 'freshdesk_create_solution_folder',
      description: 'Create a new KB folder',
      inputSchema: z.object({
        category_id: z.number().describe('Category ID'),
        name: z.string().describe('Folder name'),
        description: z.string().optional().describe('Folder description'),
        visibility: z.number().optional().describe('Visibility level'),
      }),
      execute: async (args: any) => {
        const { category_id, ...data } = args;
        const folder = await client.createSolutionFolder(category_id, data);
        return { folder, message: 'Folder created successfully' };
      },
    },

    {
      name: 'freshdesk_update_solution_folder',
      description: 'Update a KB folder',
      inputSchema: z.object({
        category_id: z.number().describe('Category ID'),
        folder_id: z.number().describe('Folder ID'),
        name: z.string().optional().describe('Folder name'),
        description: z.string().optional().describe('Description'),
      }),
      execute: async (args: any) => {
        const { category_id, folder_id, ...data } = args;
        const folder = await client.updateSolutionFolder(category_id, folder_id, data);
        return { folder, message: 'Folder updated successfully' };
      },
    },

    {
      name: 'freshdesk_delete_solution_folder',
      description: 'Delete a KB folder',
      inputSchema: z.object({
        category_id: z.number().describe('Category ID'),
        folder_id: z.number().describe('Folder ID'),
      }),
      execute: async (args: any) => {
        await client.deleteSolutionFolder(args.category_id, args.folder_id);
        return { message: 'Folder deleted successfully' };
      },
    },

    {
      name: 'freshdesk_list_solution_articles',
      description: 'List all articles in a KB folder',
      inputSchema: z.object({
        folder_id: z.number().describe('Folder ID'),
        page: z.number().optional().describe('Page number'),
        per_page: z.number().optional().describe('Results per page'),
      }),
      execute: async (args: any) => {
        const { folder_id, ...params } = args;
        const articles = await client.getSolutionArticles(folder_id, params);
        return { articles };
      },
    },

    {
      name: 'freshdesk_get_solution_article',
      description: 'Get a specific KB article by ID',
      inputSchema: z.object({
        id: z.number().describe('Article ID'),
      }),
      execute: async (args: any) => {
        const article = await client.getSolutionArticle(args.id);
        return { article };
      },
    },

    {
      name: 'freshdesk_create_solution_article',
      description: 'Create a new KB article',
      inputSchema: z.object({
        folder_id: z.number().describe('Folder ID'),
        title: z.string().describe('Article title'),
        description: z.string().describe('Article content (HTML allowed)'),
        status: z.number().optional().describe('Status: 1=Draft, 2=Published'),
        tags: z.array(z.string()).optional().describe('Tags'),
      }),
      execute: async (args: any) => {
        const { folder_id, ...data } = args;
        const article = await client.createSolutionArticle(folder_id, data);
        return { article, message: 'Article created successfully' };
      },
    },

    {
      name: 'freshdesk_update_solution_article',
      description: 'Update a KB article',
      inputSchema: z.object({
        id: z.number().describe('Article ID'),
        title: z.string().optional().describe('Article title'),
        description: z.string().optional().describe('Article content'),
        status: z.number().optional().describe('Status'),
        tags: z.array(z.string()).optional().describe('Tags'),
      }),
      execute: async (args: any) => {
        const { id, ...data } = args;
        const article = await client.updateSolutionArticle(id, data);
        return { article, message: 'Article updated successfully' };
      },
    },

    {
      name: 'freshdesk_delete_solution_article',
      description: 'Delete a KB article',
      inputSchema: z.object({
        id: z.number().describe('Article ID'),
      }),
      execute: async (args: any) => {
        await client.deleteSolutionArticle(args.id);
        return { message: 'Article deleted successfully' };
      },
    },

    {
      name: 'freshdesk_search_solutions',
      description: 'Search knowledge base articles',
      inputSchema: z.object({
        term: z.string().describe('Search term'),
      }),
      execute: async (args: any) => {
        const results = await client.searchSolutions(args.term);
        return { results };
      },
    },

    // ==================== FORUM TOOLS ====================
    {
      name: 'freshdesk_list_forum_categories',
      description: 'List all forum categories',
      inputSchema: z.object({}),
      execute: async () => {
        const categories = await client.getForumCategories();
        return { categories };
      },
    },

    {
      name: 'freshdesk_list_forums',
      description: 'List all forums (optionally filter by category)',
      inputSchema: z.object({
        category_id: z.number().optional().describe('Filter by category ID'),
      }),
      execute: async (args: any) => {
        const forums = await client.getForums(args.category_id);
        return { forums };
      },
    },

    {
      name: 'freshdesk_get_forum',
      description: 'Get a specific forum by ID',
      inputSchema: z.object({
        id: z.number().describe('Forum ID'),
      }),
      execute: async (args: any) => {
        const forum = await client.getForum(args.id);
        return { forum };
      },
    },

    {
      name: 'freshdesk_create_forum',
      description: 'Create a new forum',
      inputSchema: z.object({
        name: z.string().describe('Forum name'),
        description: z.string().optional().describe('Forum description'),
        forum_category_id: z.number().describe('Category ID'),
        forum_visibility: z.number().optional().describe('Visibility level'),
      }),
      execute: async (args: any) => {
        const forum = await client.createForum(args);
        return { forum, message: 'Forum created successfully' };
      },
    },

    {
      name: 'freshdesk_update_forum',
      description: 'Update an existing forum',
      inputSchema: z.object({
        id: z.number().describe('Forum ID'),
        name: z.string().optional().describe('Forum name'),
        description: z.string().optional().describe('Description'),
      }),
      execute: async (args: any) => {
        const { id, ...data } = args;
        const forum = await client.updateForum(id, data);
        return { forum, message: 'Forum updated successfully' };
      },
    },

    {
      name: 'freshdesk_list_forum_topics',
      description: 'List all topics in a forum',
      inputSchema: z.object({
        forum_id: z.number().describe('Forum ID'),
        page: z.number().optional().describe('Page number'),
        per_page: z.number().optional().describe('Results per page'),
      }),
      execute: async (args: any) => {
        const { forum_id, ...params } = args;
        const topics = await client.getForumTopics(forum_id, params);
        return { topics };
      },
    },

    {
      name: 'freshdesk_get_forum_topic',
      description: 'Get a specific forum topic by ID',
      inputSchema: z.object({
        id: z.number().describe('Topic ID'),
      }),
      execute: async (args: any) => {
        const topic = await client.getForumTopic(args.id);
        return { topic };
      },
    },

    {
      name: 'freshdesk_create_forum_topic',
      description: 'Create a new forum topic',
      inputSchema: z.object({
        forum_id: z.number().describe('Forum ID'),
        title: z.string().describe('Topic title'),
        message: z.string().describe('Topic message (HTML allowed)'),
        sticky: z.boolean().optional().describe('Sticky topic'),
        locked: z.boolean().optional().describe('Locked topic'),
      }),
      execute: async (args: any) => {
        const { forum_id, ...data } = args;
        const topic = await client.createForumTopic(forum_id, data);
        return { topic, message: 'Topic created successfully' };
      },
    },

    {
      name: 'freshdesk_update_forum_topic',
      description: 'Update a forum topic',
      inputSchema: z.object({
        id: z.number().describe('Topic ID'),
        title: z.string().optional().describe('Topic title'),
        message: z.string().optional().describe('Message'),
        sticky: z.boolean().optional().describe('Sticky'),
        locked: z.boolean().optional().describe('Locked'),
      }),
      execute: async (args: any) => {
        const { id, ...data } = args;
        const topic = await client.updateForumTopic(id, data);
        return { topic, message: 'Topic updated successfully' };
      },
    },

    {
      name: 'freshdesk_delete_forum_topic',
      description: 'Delete a forum topic',
      inputSchema: z.object({
        id: z.number().describe('Topic ID'),
      }),
      execute: async (args: any) => {
        await client.deleteForumTopic(args.id);
        return { message: 'Topic deleted successfully' };
      },
    },

    {
      name: 'freshdesk_list_forum_posts',
      description: 'List all posts in a forum topic',
      inputSchema: z.object({
        topic_id: z.number().describe('Topic ID'),
      }),
      execute: async (args: any) => {
        const posts = await client.getForumPosts(args.topic_id);
        return { posts };
      },
    },

    {
      name: 'freshdesk_create_forum_post',
      description: 'Create a reply/post in a forum topic',
      inputSchema: z.object({
        topic_id: z.number().describe('Topic ID'),
        body: z.string().describe('Post content (HTML allowed)'),
      }),
      execute: async (args: any) => {
        const { topic_id, ...data } = args;
        const post = await client.createForumPost(topic_id, data);
        return { post, message: 'Post created successfully' };
      },
    },

    // ==================== SURVEY TOOLS ====================
    {
      name: 'freshdesk_list_surveys',
      description: 'List all customer satisfaction surveys',
      inputSchema: z.object({}),
      execute: async () => {
        const surveys = await client.getSurveys();
        return { surveys };
      },
    },

    {
      name: 'freshdesk_get_survey_results',
      description: 'Get results for a specific survey',
      inputSchema: z.object({
        survey_id: z.number().describe('Survey ID'),
        page: z.number().optional().describe('Page number'),
        per_page: z.number().optional().describe('Results per page'),
      }),
      execute: async (args: any) => {
        const { survey_id, ...params } = args;
        const results = await client.getSurveyResults(survey_id, params);
        return { results };
      },
    },

    {
      name: 'freshdesk_get_satisfaction_ratings',
      description: 'Get all satisfaction ratings across surveys',
      inputSchema: z.object({
        created_since: z.string().optional().describe('Filter by date (ISO 8601)'),
        page: z.number().optional().describe('Page number'),
        per_page: z.number().optional().describe('Results per page'),
      }),
      execute: async (args: any) => {
        const ratings = await client.getSatisfactionRatings(args);
        return { ratings };
      },
    },

    // ==================== TIME ENTRY TOOLS ====================
    {
      name: 'freshdesk_list_time_entries',
      description: 'List all time entries',
      inputSchema: z.object({
        page: z.number().optional().describe('Page number'),
        per_page: z.number().optional().describe('Results per page'),
      }),
      execute: async (args: any) => {
        const timeEntries = await client.getAllTimeEntries(args);
        return { timeEntries };
      },
    },

    {
      name: 'freshdesk_get_time_entry',
      description: 'Get a specific time entry by ID',
      inputSchema: z.object({
        id: z.number().describe('Time entry ID'),
      }),
      execute: async (args: any) => {
        const timeEntry = await client.getTimeEntry(args.id);
        return { timeEntry };
      },
    },

    {
      name: 'freshdesk_create_time_entry',
      description: 'Create a new time entry',
      inputSchema: z.object({
        ticket_id: z.number().describe('Ticket ID'),
        time_spent: z.string().describe('Time spent (e.g., "01:30" for 1h 30m)'),
        billable: z.boolean().optional().describe('Is billable'),
        note: z.string().optional().describe('Note/description'),
        agent_id: z.number().optional().describe('Agent ID'),
      }),
      execute: async (args: any) => {
        const timeEntry = await client.createTimeEntry(args);
        return { timeEntry, message: 'Time entry created successfully' };
      },
    },

    {
      name: 'freshdesk_update_time_entry',
      description: 'Update an existing time entry',
      inputSchema: z.object({
        id: z.number().describe('Time entry ID'),
        time_spent: z.string().optional().describe('Time spent'),
        billable: z.boolean().optional().describe('Is billable'),
        note: z.string().optional().describe('Note'),
      }),
      execute: async (args: any) => {
        const { id, ...data } = args;
        const timeEntry = await client.updateTimeEntry(id, data);
        return { timeEntry, message: 'Time entry updated successfully' };
      },
    },

    {
      name: 'freshdesk_delete_time_entry',
      description: 'Delete a time entry',
      inputSchema: z.object({
        id: z.number().describe('Time entry ID'),
      }),
      execute: async (args: any) => {
        await client.deleteTimeEntry(args.id);
        return { message: 'Time entry deleted successfully' };
      },
    },

    {
      name: 'freshdesk_start_timer',
      description: 'Start a time tracking timer',
      inputSchema: z.object({
        id: z.number().describe('Time entry ID'),
      }),
      execute: async (args: any) => {
        const timeEntry = await client.startTimer(args.id);
        return { timeEntry, message: 'Timer started successfully' };
      },
    },

    {
      name: 'freshdesk_stop_timer',
      description: 'Stop a running time tracking timer',
      inputSchema: z.object({
        id: z.number().describe('Time entry ID'),
      }),
      execute: async (args: any) => {
        const timeEntry = await client.stopTimer(args.id);
        return { timeEntry, message: 'Timer stopped successfully' };
      },
    },

    // ==================== CONFIGURATION TOOLS ====================
    {
      name: 'freshdesk_get_business_hours',
      description: 'Get all business hours configurations',
      inputSchema: z.object({}),
      execute: async () => {
        const businessHours = await client.getBusinessHours();
        return { businessHours };
      },
    },

    {
      name: 'freshdesk_get_business_hour',
      description: 'Get a specific business hours configuration',
      inputSchema: z.object({
        id: z.number().describe('Business hours ID'),
      }),
      execute: async (args: any) => {
        const businessHour = await client.getBusinessHour(args.id);
        return { businessHour };
      },
    },

    {
      name: 'freshdesk_get_sla_policies',
      description: 'Get all SLA policies',
      inputSchema: z.object({}),
      execute: async () => {
        const policies = await client.getSLAPolicies();
        return { policies };
      },
    },

    {
      name: 'freshdesk_get_sla_policy',
      description: 'Get a specific SLA policy',
      inputSchema: z.object({
        id: z.number().describe('SLA policy ID'),
      }),
      execute: async (args: any) => {
        const policy = await client.getSLAPolicy(args.id);
        return { policy };
      },
    },

    {
      name: 'freshdesk_get_email_configs',
      description: 'Get all email configurations',
      inputSchema: z.object({}),
      execute: async () => {
        const configs = await client.getEmailConfigs();
        return { configs };
      },
    },

    {
      name: 'freshdesk_get_email_config',
      description: 'Get a specific email configuration',
      inputSchema: z.object({
        id: z.number().describe('Email config ID'),
      }),
      execute: async (args: any) => {
        const config = await client.getEmailConfig(args.id);
        return { config };
      },
    },

    {
      name: 'freshdesk_get_ticket_fields',
      description: 'Get all ticket field configurations',
      inputSchema: z.object({}),
      execute: async () => {
        const fields = await client.getTicketFields();
        return { fields };
      },
    },

    {
      name: 'freshdesk_get_ticket_field',
      description: 'Get a specific ticket field configuration',
      inputSchema: z.object({
        id: z.number().describe('Ticket field ID'),
      }),
      execute: async (args: any) => {
        const field = await client.getTicketField(args.id);
        return { field };
      },
    },

    {
      name: 'freshdesk_get_settings',
      description: 'Get helpdesk settings and configuration',
      inputSchema: z.object({}),
      execute: async () => {
        const settings = await client.getSettings();
        return { settings };
      },
    },
  ];
}
