import type { FreshDeskClient } from '../api/client.js';

export function registerCompanyTools(client: FreshDeskClient) {
  return {
    freshdesk_list_companies: {
      description: 'List all companies with optional filters',
      parameters: {
        type: 'object',
        properties: {
          per_page: {
            type: 'number',
            description: 'Results per page (default 30, max 100)',
          },
          max_results: {
            type: 'number',
            description: 'Maximum total results to return',
          },
        },
      },
      handler: async (args: any) => {
        const result = await client.listCompanies(args);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      },
    },

    freshdesk_get_company: {
      description: 'Get a specific company by ID',
      parameters: {
        type: 'object',
        properties: {
          company_id: {
            type: 'number',
            description: 'Company ID',
          },
        },
        required: ['company_id'],
      },
      handler: async (args: any) => {
        const company = await client.getCompany(args.company_id);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(company, null, 2),
            },
          ],
        };
      },
    },

    freshdesk_create_company: {
      description: 'Create a new company',
      parameters: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            description: 'Company name',
          },
          description: {
            type: 'string',
            description: 'Company description',
          },
          domains: {
            type: 'array',
            items: { type: 'string' },
            description: 'Email domains associated with company',
          },
          note: {
            type: 'string',
            description: 'Internal note about company',
          },
          custom_fields: {
            type: 'object',
            description: 'Custom field values',
          },
          health_score: {
            type: 'string',
            description: 'Health score',
          },
          account_tier: {
            type: 'string',
            description: 'Account tier',
          },
          renewal_date: {
            type: 'string',
            description: 'Renewal date (ISO 8601)',
          },
          industry: {
            type: 'string',
            description: 'Industry',
          },
        },
        required: ['name'],
      },
      handler: async (args: any) => {
        const company = await client.createCompany(args);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(company, null, 2),
            },
          ],
        };
      },
    },

    freshdesk_update_company: {
      description: 'Update an existing company',
      parameters: {
        type: 'object',
        properties: {
          company_id: {
            type: 'number',
            description: 'Company ID',
          },
          name: {
            type: 'string',
            description: 'Company name',
          },
          description: {
            type: 'string',
            description: 'Company description',
          },
          domains: {
            type: 'array',
            items: { type: 'string' },
            description: 'Email domains',
          },
          note: {
            type: 'string',
            description: 'Internal note',
          },
          custom_fields: {
            type: 'object',
            description: 'Custom field values',
          },
          health_score: {
            type: 'string',
            description: 'Health score',
          },
          account_tier: {
            type: 'string',
            description: 'Account tier',
          },
          renewal_date: {
            type: 'string',
            description: 'Renewal date (ISO 8601)',
          },
          industry: {
            type: 'string',
            description: 'Industry',
          },
        },
        required: ['company_id'],
      },
      handler: async (args: any) => {
        const { company_id, ...updateData } = args;
        const company = await client.updateCompany(company_id, updateData);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(company, null, 2),
            },
          ],
        };
      },
    },

    freshdesk_delete_company: {
      description: 'Delete a company',
      parameters: {
        type: 'object',
        properties: {
          company_id: {
            type: 'number',
            description: 'Company ID',
          },
        },
        required: ['company_id'],
      },
      handler: async (args: any) => {
        await client.deleteCompany(args.company_id);
        return {
          content: [
            {
              type: 'text',
              text: `Company ${args.company_id} deleted successfully`,
            },
          ],
        };
      },
    },

    freshdesk_list_company_fields: {
      description: 'List all company custom fields',
      parameters: {
        type: 'object',
        properties: {},
      },
      handler: async () => {
        const fields = await client.listCompanyFields();
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(fields, null, 2),
            },
          ],
        };
      },
    },
  };
}
