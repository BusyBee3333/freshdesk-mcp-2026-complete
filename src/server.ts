import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { FreshDeskClient } from './api/client.js';
import { registerTicketTools } from './tools/tickets-tools.js';
import { registerContactTools } from './tools/contacts-tools.js';
import { registerCompanyTools } from './tools/companies-tools.js';
import { registerAgentTools } from './tools/agents-tools.js';
import { registerGroupTools } from './tools/groups-tools.js';
import { registerRoleTools } from './tools/roles-tools.js';
import { registerProductTools } from './tools/products-tools.js';
import { registerForumTools } from './tools/forums-tools.js';
import { registerSolutionTools } from './tools/solutions-tools.js';
import { registerCannedResponseTools } from './tools/canned-responses-tools.js';
import { registerSurveyTools } from './tools/surveys-tools.js';
import { registerReportingTools } from './tools/reporting-tools.js';

// App HTML templates
import { getTicketDashboardApp } from './apps/ticket-dashboard.js';
import { getTicketDetailApp } from './apps/ticket-detail.js';
import { getTicketGridApp } from './apps/ticket-grid.js';
import { getContactDetailApp } from './apps/contact-detail.js';
import { getContactGridApp } from './apps/contact-grid.js';
import { getCompanyDetailApp } from './apps/company-detail.js';
import { getCompanyGridApp } from './apps/company-grid.js';
import { getAgentDashboardApp } from './apps/agent-dashboard.js';
import { getAgentPerformanceApp } from './apps/agent-performance.js';
import { getGroupManagerApp } from './apps/group-manager.js';
import { getKnowledgeBaseApp } from './apps/knowledge-base.js';
import { getArticleEditorApp } from './apps/article-editor.js';
import { getForumBrowserApp } from './apps/forum-browser.js';
import { getCannedResponsesApp } from './apps/canned-responses.js';
import { getSurveyResultsApp } from './apps/survey-results.js';
import { getSLADashboardApp } from './apps/sla-dashboard.js';
import { getTicketVolumeApp } from './apps/ticket-volume.js';
import { getResolutionTimesApp } from './apps/resolution-times.js';
import { getProductManagerApp } from './apps/product-manager.js';
import { getTimeTrackingApp } from './apps/time-tracking.js';

export class FreshDeskServer {
  private server: Server;
  private client: FreshDeskClient;
  private tools: Record<string, any> = {};

  constructor() {
    this.server = new Server(
      {
        name: 'freshdesk-mcp-server',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
          resources: {},
        },
      }
    );

    // Get configuration from environment
    const domain = process.env.FRESHDESK_DOMAIN;
    const apiKey = process.env.FRESHDESK_API_KEY;

    if (!domain || !apiKey) {
      throw new Error('FRESHDESK_DOMAIN and FRESHDESK_API_KEY environment variables are required');
    }

    this.client = new FreshDeskClient({ domain, apiKey });

    // Register all tools
    this.registerAllTools();

    // Set up request handlers
    this.setupHandlers();

    // Error handling
    this.server.onerror = (error) => {
      console.error('[MCP Error]', error);
    };

    process.on('SIGINT', async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  private registerAllTools() {
    const toolModules = [
      registerTicketTools(this.client),
      registerContactTools(this.client),
      registerCompanyTools(this.client),
      registerAgentTools(this.client),
      registerGroupTools(this.client),
      registerRoleTools(this.client),
      registerProductTools(this.client),
      registerForumTools(this.client),
      registerSolutionTools(this.client),
      registerCannedResponseTools(this.client),
      registerSurveyTools(this.client),
      registerReportingTools(this.client),
    ];

    for (const module of toolModules) {
      this.tools = { ...this.tools, ...module };
    }
  }

  private setupHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: Object.entries(this.tools).map(([name, tool]) => ({
        name,
        description: tool.description,
        inputSchema: tool.parameters,
      })),
    }));

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const tool = this.tools[request.params.name];
      if (!tool) {
        throw new Error(`Tool not found: ${request.params.name}`);
      }

      try {
        return await tool.handler(request.params.arguments || {});
      } catch (error: any) {
        return {
          content: [
            {
              type: 'text',
              text: `Error: ${error.message}`,
            },
          ],
          isError: true,
        };
      }
    });

    // Resources (MCP Apps)
    this.server.setRequestHandler(ListResourcesRequestSchema, async () => ({
      resources: [
        {
          uri: 'freshdesk://app/ticket-dashboard',
          mimeType: 'text/html',
          name: 'Ticket Dashboard',
          description: 'Interactive dashboard for managing tickets',
        },
        {
          uri: 'freshdesk://app/ticket-detail',
          mimeType: 'text/html',
          name: 'Ticket Detail',
          description: 'Detailed ticket view and management',
        },
        {
          uri: 'freshdesk://app/ticket-grid',
          mimeType: 'text/html',
          name: 'Ticket Grid',
          description: 'Sortable and filterable ticket grid',
        },
        {
          uri: 'freshdesk://app/contact-detail',
          mimeType: 'text/html',
          name: 'Contact Detail',
          description: 'Contact profile and history',
        },
        {
          uri: 'freshdesk://app/contact-grid',
          mimeType: 'text/html',
          name: 'Contact Grid',
          description: 'Contact management grid',
        },
        {
          uri: 'freshdesk://app/company-detail',
          mimeType: 'text/html',
          name: 'Company Detail',
          description: 'Company profile and analytics',
        },
        {
          uri: 'freshdesk://app/company-grid',
          mimeType: 'text/html',
          name: 'Company Grid',
          description: 'Company management grid',
        },
        {
          uri: 'freshdesk://app/agent-dashboard',
          mimeType: 'text/html',
          name: 'Agent Dashboard',
          description: 'Agent workload and performance',
        },
        {
          uri: 'freshdesk://app/agent-performance',
          mimeType: 'text/html',
          name: 'Agent Performance',
          description: 'Detailed agent metrics and analytics',
        },
        {
          uri: 'freshdesk://app/group-manager',
          mimeType: 'text/html',
          name: 'Group Manager',
          description: 'Manage groups and assignments',
        },
        {
          uri: 'freshdesk://app/knowledge-base',
          mimeType: 'text/html',
          name: 'Knowledge Base',
          description: 'Browse and search knowledge base',
        },
        {
          uri: 'freshdesk://app/article-editor',
          mimeType: 'text/html',
          name: 'Article Editor',
          description: 'Create and edit knowledge base articles',
        },
        {
          uri: 'freshdesk://app/forum-browser',
          mimeType: 'text/html',
          name: 'Forum Browser',
          description: 'Browse community forums and discussions',
        },
        {
          uri: 'freshdesk://app/canned-responses',
          mimeType: 'text/html',
          name: 'Canned Responses',
          description: 'Manage saved response templates',
        },
        {
          uri: 'freshdesk://app/survey-results',
          mimeType: 'text/html',
          name: 'Survey Results',
          description: 'Customer satisfaction survey analytics',
        },
        {
          uri: 'freshdesk://app/sla-dashboard',
          mimeType: 'text/html',
          name: 'SLA Dashboard',
          description: 'SLA compliance monitoring',
        },
        {
          uri: 'freshdesk://app/ticket-volume',
          mimeType: 'text/html',
          name: 'Ticket Volume',
          description: 'Ticket volume trends and analytics',
        },
        {
          uri: 'freshdesk://app/resolution-times',
          mimeType: 'text/html',
          name: 'Resolution Times',
          description: 'Resolution time analysis',
        },
        {
          uri: 'freshdesk://app/product-manager',
          mimeType: 'text/html',
          name: 'Product Manager',
          description: 'Manage products and categories',
        },
        {
          uri: 'freshdesk://app/time-tracking',
          mimeType: 'text/html',
          name: 'Time Tracking',
          description: 'Track and analyze time entries',
        },
      ],
    }));

    this.server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
      const uri = request.params.uri;
      const appName = uri.replace('freshdesk://app/', '');

      let html: string;
      switch (appName) {
        case 'ticket-dashboard':
          html = getTicketDashboardApp();
          break;
        case 'ticket-detail':
          html = getTicketDetailApp();
          break;
        case 'ticket-grid':
          html = getTicketGridApp();
          break;
        case 'contact-detail':
          html = getContactDetailApp();
          break;
        case 'contact-grid':
          html = getContactGridApp();
          break;
        case 'company-detail':
          html = getCompanyDetailApp();
          break;
        case 'company-grid':
          html = getCompanyGridApp();
          break;
        case 'agent-dashboard':
          html = getAgentDashboardApp();
          break;
        case 'agent-performance':
          html = getAgentPerformanceApp();
          break;
        case 'group-manager':
          html = getGroupManagerApp();
          break;
        case 'knowledge-base':
          html = getKnowledgeBaseApp();
          break;
        case 'article-editor':
          html = getArticleEditorApp();
          break;
        case 'forum-browser':
          html = getForumBrowserApp();
          break;
        case 'canned-responses':
          html = getCannedResponsesApp();
          break;
        case 'survey-results':
          html = getSurveyResultsApp();
          break;
        case 'sla-dashboard':
          html = getSLADashboardApp();
          break;
        case 'ticket-volume':
          html = getTicketVolumeApp();
          break;
        case 'resolution-times':
          html = getResolutionTimesApp();
          break;
        case 'product-manager':
          html = getProductManagerApp();
          break;
        case 'time-tracking':
          html = getTimeTrackingApp();
          break;
        default:
          throw new Error(`Unknown app: ${appName}`);
      }

      return {
        contents: [
          {
            uri,
            mimeType: 'text/html',
            text: html,
          },
        ],
      };
    });
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('FreshDesk MCP server running on stdio');
  }
}
