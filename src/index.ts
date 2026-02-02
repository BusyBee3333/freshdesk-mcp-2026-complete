#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

// ============================================
// CONFIGURATION
// ============================================
const MCP_NAME = "freshdesk";
const MCP_VERSION = "1.0.0";

// ============================================
// API CLIENT - Freshdesk uses Basic Auth with API key
// ============================================
class FreshdeskClient {
  private apiKey: string;
  private domain: string;
  private baseUrl: string;

  constructor(apiKey: string, domain: string) {
    this.apiKey = apiKey;
    this.domain = domain;
    this.baseUrl = `https://${domain}.freshdesk.com/api/v2`;
  }

  private getAuthHeader(): string {
    // Freshdesk uses Basic Auth: API key as username, "X" as password
    return "Basic " + Buffer.from(`${this.apiKey}:X`).toString("base64");
  }

  async request(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        "Authorization": this.getAuthHeader(),
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Freshdesk API error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    // Handle 204 No Content
    if (response.status === 204) {
      return { success: true };
    }

    return response.json();
  }

  async get(endpoint: string) {
    return this.request(endpoint, { method: "GET" });
  }

  async post(endpoint: string, data: any) {
    return this.request(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async put(endpoint: string, data: any) {
    return this.request(endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async delete(endpoint: string) {
    return this.request(endpoint, { method: "DELETE" });
  }
}

// ============================================
// TOOL DEFINITIONS
// ============================================
const tools = [
  {
    name: "list_tickets",
    description: "List all tickets with optional filtering. Returns tickets sorted by created_at descending.",
    inputSchema: {
      type: "object" as const,
      properties: {
        filter: {
          type: "string",
          description: "Filter tickets by predefined filters: new_and_my_open, watching, spam, deleted, or all_tickets",
          enum: ["new_and_my_open", "watching", "spam", "deleted", "all_tickets"],
        },
        page: { type: "number", description: "Page number for pagination (default: 1)" },
        per_page: { type: "number", description: "Results per page, max 100 (default: 30)" },
        order_by: { type: "string", description: "Order by field: created_at, due_by, updated_at, status" },
        order_type: { type: "string", enum: ["asc", "desc"], description: "Sort order" },
      },
    },
  },
  {
    name: "get_ticket",
    description: "Get a specific ticket by ID with full details including conversations",
    inputSchema: {
      type: "object" as const,
      properties: {
        id: { type: "number", description: "Ticket ID" },
        include: {
          type: "string",
          description: "Include additional data: conversations, requester, company, stats",
        },
      },
      required: ["id"],
    },
  },
  {
    name: "create_ticket",
    description: "Create a new support ticket",
    inputSchema: {
      type: "object" as const,
      properties: {
        subject: { type: "string", description: "Ticket subject (required)" },
        description: { type: "string", description: "HTML content of the ticket (required)" },
        email: { type: "string", description: "Email of the requester (required if no requester_id)" },
        requester_id: { type: "number", description: "ID of the requester (required if no email)" },
        priority: {
          type: "number",
          description: "Priority: 1=Low, 2=Medium, 3=High, 4=Urgent",
          enum: [1, 2, 3, 4],
        },
        status: {
          type: "number",
          description: "Status: 2=Open, 3=Pending, 4=Resolved, 5=Closed",
          enum: [2, 3, 4, 5],
        },
        type: { type: "string", description: "Ticket type (as configured in your helpdesk)" },
        source: {
          type: "number",
          description: "Source: 1=Email, 2=Portal, 3=Phone, 7=Chat, 9=Feedback Widget, 10=Outbound Email",
        },
        group_id: { type: "number", description: "ID of the group to assign" },
        responder_id: { type: "number", description: "ID of the agent to assign" },
        tags: {
          type: "array",
          items: { type: "string" },
          description: "Tags to add to the ticket",
        },
        custom_fields: { type: "object", description: "Custom field values as key-value pairs" },
      },
      required: ["subject", "description"],
    },
  },
  {
    name: "update_ticket",
    description: "Update an existing ticket's properties",
    inputSchema: {
      type: "object" as const,
      properties: {
        id: { type: "number", description: "Ticket ID" },
        subject: { type: "string", description: "Updated subject" },
        description: { type: "string", description: "Updated description" },
        priority: { type: "number", description: "Priority: 1=Low, 2=Medium, 3=High, 4=Urgent" },
        status: { type: "number", description: "Status: 2=Open, 3=Pending, 4=Resolved, 5=Closed" },
        type: { type: "string", description: "Ticket type" },
        group_id: { type: "number", description: "Group to assign" },
        responder_id: { type: "number", description: "Agent to assign" },
        tags: { type: "array", items: { type: "string" }, description: "Tags (replaces existing)" },
        custom_fields: { type: "object", description: "Custom field values" },
      },
      required: ["id"],
    },
  },
  {
    name: "reply_ticket",
    description: "Add a reply to a ticket (creates a conversation)",
    inputSchema: {
      type: "object" as const,
      properties: {
        id: { type: "number", description: "Ticket ID" },
        body: { type: "string", description: "HTML content of the reply (required)" },
        from_email: { type: "string", description: "Email address to send reply from" },
        user_id: { type: "number", description: "ID of the agent/contact adding the note" },
        cc_emails: {
          type: "array",
          items: { type: "string" },
          description: "CC email addresses",
        },
        bcc_emails: {
          type: "array",
          items: { type: "string" },
          description: "BCC email addresses",
        },
        private: { type: "boolean", description: "If true, creates a private note instead of public reply" },
      },
      required: ["id", "body"],
    },
  },
  {
    name: "list_contacts",
    description: "List all contacts in your helpdesk",
    inputSchema: {
      type: "object" as const,
      properties: {
        email: { type: "string", description: "Filter by email address" },
        phone: { type: "string", description: "Filter by phone number" },
        mobile: { type: "string", description: "Filter by mobile number" },
        company_id: { type: "number", description: "Filter by company ID" },
        state: { type: "string", enum: ["blocked", "deleted", "unverified", "verified"], description: "Filter by state" },
        page: { type: "number", description: "Page number" },
        per_page: { type: "number", description: "Results per page (max 100)" },
      },
    },
  },
  {
    name: "list_agents",
    description: "List all agents in your helpdesk",
    inputSchema: {
      type: "object" as const,
      properties: {
        email: { type: "string", description: "Filter by email" },
        phone: { type: "string", description: "Filter by phone" },
        state: { type: "string", enum: ["fulltime", "occasional"], description: "Filter by agent type" },
        page: { type: "number", description: "Page number" },
        per_page: { type: "number", description: "Results per page (max 100)" },
      },
    },
  },
  {
    name: "search_tickets",
    description: "Search tickets using Freshdesk query language. Supports field:value syntax.",
    inputSchema: {
      type: "object" as const,
      properties: {
        query: {
          type: "string",
          description: 'Search query using Freshdesk syntax. Examples: "status:2", "priority:4 AND created_at:>\'2023-01-01\'", "tag:\'urgent\'"',
        },
        page: { type: "number", description: "Page number (each page has 30 results)" },
      },
      required: ["query"],
    },
  },
];

// ============================================
// TOOL HANDLERS
// ============================================
async function handleTool(client: FreshdeskClient, name: string, args: any) {
  switch (name) {
    case "list_tickets": {
      const params = new URLSearchParams();
      if (args.filter) params.append("filter", args.filter);
      if (args.page) params.append("page", args.page.toString());
      if (args.per_page) params.append("per_page", args.per_page.toString());
      if (args.order_by) params.append("order_by", args.order_by);
      if (args.order_type) params.append("order_type", args.order_type);
      const query = params.toString();
      return await client.get(`/tickets${query ? `?${query}` : ""}`);
    }

    case "get_ticket": {
      const { id, include } = args;
      const query = include ? `?include=${include}` : "";
      return await client.get(`/tickets/${id}${query}`);
    }

    case "create_ticket": {
      const { subject, description, email, requester_id, priority, status, type, source, group_id, responder_id, tags, custom_fields } = args;
      const payload: any = { subject, description };
      if (email) payload.email = email;
      if (requester_id) payload.requester_id = requester_id;
      if (priority) payload.priority = priority;
      if (status) payload.status = status;
      if (type) payload.type = type;
      if (source) payload.source = source;
      if (group_id) payload.group_id = group_id;
      if (responder_id) payload.responder_id = responder_id;
      if (tags) payload.tags = tags;
      if (custom_fields) payload.custom_fields = custom_fields;
      return await client.post("/tickets", payload);
    }

    case "update_ticket": {
      const { id, ...updates } = args;
      return await client.put(`/tickets/${id}`, updates);
    }

    case "reply_ticket": {
      const { id, body, from_email, user_id, cc_emails, bcc_emails, private: isPrivate } = args;
      const payload: any = { body };
      if (from_email) payload.from_email = from_email;
      if (user_id) payload.user_id = user_id;
      if (cc_emails) payload.cc_emails = cc_emails;
      if (bcc_emails) payload.bcc_emails = bcc_emails;
      
      // Private notes use a different endpoint
      if (isPrivate) {
        payload.private = true;
        return await client.post(`/tickets/${id}/notes`, payload);
      }
      return await client.post(`/tickets/${id}/reply`, payload);
    }

    case "list_contacts": {
      const params = new URLSearchParams();
      if (args.email) params.append("email", args.email);
      if (args.phone) params.append("phone", args.phone);
      if (args.mobile) params.append("mobile", args.mobile);
      if (args.company_id) params.append("company_id", args.company_id.toString());
      if (args.state) params.append("state", args.state);
      if (args.page) params.append("page", args.page.toString());
      if (args.per_page) params.append("per_page", args.per_page.toString());
      const query = params.toString();
      return await client.get(`/contacts${query ? `?${query}` : ""}`);
    }

    case "list_agents": {
      const params = new URLSearchParams();
      if (args.email) params.append("email", args.email);
      if (args.phone) params.append("phone", args.phone);
      if (args.state) params.append("state", args.state);
      if (args.page) params.append("page", args.page.toString());
      if (args.per_page) params.append("per_page", args.per_page.toString());
      const query = params.toString();
      return await client.get(`/agents${query ? `?${query}` : ""}`);
    }

    case "search_tickets": {
      const { query, page } = args;
      const params = new URLSearchParams();
      params.append("query", `"${query}"`);
      if (page) params.append("page", page.toString());
      return await client.get(`/search/tickets?${params.toString()}`);
    }

    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

// ============================================
// SERVER SETUP
// ============================================
async function main() {
  const apiKey = process.env.FRESHDESK_API_KEY;
  const domain = process.env.FRESHDESK_DOMAIN;
  
  if (!apiKey) {
    console.error("Error: FRESHDESK_API_KEY environment variable required");
    process.exit(1);
  }
  if (!domain) {
    console.error("Error: FRESHDESK_DOMAIN environment variable required (e.g., 'yourcompany' for yourcompany.freshdesk.com)");
    process.exit(1);
  }

  const client = new FreshdeskClient(apiKey, domain);

  const server = new Server(
    { name: `${MCP_NAME}-mcp`, version: MCP_VERSION },
    { capabilities: { tools: {} } }
  );

  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools,
  }));

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    
    try {
      const result = await handleTool(client, name, args || {});
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      return {
        content: [{ type: "text", text: `Error: ${message}` }],
        isError: true,
      };
    }
  });

  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error(`${MCP_NAME} MCP server running on stdio`);
}

main().catch(console.error);
