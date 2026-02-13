import type { FreshDeskClient } from '../api/client.js';

export function registerContactTools(client: FreshDeskClient) {
  return {
    freshdesk_list_contacts: {
      description: 'List all contacts with optional filters',
      parameters: {
        type: 'object',
        properties: {
          email: {
            type: 'string',
            description: 'Filter by email',
          },
          phone: {
            type: 'string',
            description: 'Filter by phone',
          },
          mobile: {
            type: 'string',
            description: 'Filter by mobile',
          },
          company_id: {
            type: 'number',
            description: 'Filter by company ID',
          },
          state: {
            type: 'string',
            description: 'Filter by state (verified, unverified, deleted, blocked)',
          },
          updated_since: {
            type: 'string',
            description: 'Filter contacts updated after this timestamp (ISO 8601)',
          },
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
        const result = await client.listContacts(args);
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

    freshdesk_get_contact: {
      description: 'Get a specific contact by ID',
      parameters: {
        type: 'object',
        properties: {
          contact_id: {
            type: 'number',
            description: 'Contact ID',
          },
        },
        required: ['contact_id'],
      },
      handler: async (args: any) => {
        const contact = await client.getContact(args.contact_id);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(contact, null, 2),
            },
          ],
        };
      },
    },

    freshdesk_create_contact: {
      description: 'Create a new contact',
      parameters: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            description: 'Contact name',
          },
          email: {
            type: 'string',
            description: 'Email address',
          },
          phone: {
            type: 'string',
            description: 'Phone number',
          },
          mobile: {
            type: 'string',
            description: 'Mobile number',
          },
          twitter_id: {
            type: 'string',
            description: 'Twitter handle',
          },
          unique_external_id: {
            type: 'string',
            description: 'External ID from your system',
          },
          company_id: {
            type: 'number',
            description: 'Company ID',
          },
          description: {
            type: 'string',
            description: 'Contact description',
          },
          job_title: {
            type: 'string',
            description: 'Job title',
          },
          language: {
            type: 'string',
            description: 'Language code (e.g., "en")',
          },
          time_zone: {
            type: 'string',
            description: 'Time zone',
          },
          tags: {
            type: 'array',
            items: { type: 'string' },
            description: 'Tags',
          },
          address: {
            type: 'string',
            description: 'Address',
          },
          custom_fields: {
            type: 'object',
            description: 'Custom field values',
          },
        },
        required: ['name'],
      },
      handler: async (args: any) => {
        const contact = await client.createContact(args);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(contact, null, 2),
            },
          ],
        };
      },
    },

    freshdesk_update_contact: {
      description: 'Update an existing contact',
      parameters: {
        type: 'object',
        properties: {
          contact_id: {
            type: 'number',
            description: 'Contact ID',
          },
          name: {
            type: 'string',
            description: 'Contact name',
          },
          email: {
            type: 'string',
            description: 'Email address',
          },
          phone: {
            type: 'string',
            description: 'Phone number',
          },
          mobile: {
            type: 'string',
            description: 'Mobile number',
          },
          company_id: {
            type: 'number',
            description: 'Company ID',
          },
          description: {
            type: 'string',
            description: 'Contact description',
          },
          job_title: {
            type: 'string',
            description: 'Job title',
          },
          tags: {
            type: 'array',
            items: { type: 'string' },
            description: 'Tags',
          },
          custom_fields: {
            type: 'object',
            description: 'Custom field values',
          },
        },
        required: ['contact_id'],
      },
      handler: async (args: any) => {
        const { contact_id, ...updateData } = args;
        const contact = await client.updateContact(contact_id, updateData);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(contact, null, 2),
            },
          ],
        };
      },
    },

    freshdesk_delete_contact: {
      description: 'Delete a contact',
      parameters: {
        type: 'object',
        properties: {
          contact_id: {
            type: 'number',
            description: 'Contact ID',
          },
        },
        required: ['contact_id'],
      },
      handler: async (args: any) => {
        await client.deleteContact(args.contact_id);
        return {
          content: [
            {
              type: 'text',
              text: `Contact ${args.contact_id} deleted successfully`,
            },
          ],
        };
      },
    },

    freshdesk_search_contacts: {
      description: 'Search contacts by query string',
      parameters: {
        type: 'object',
        properties: {
          query: {
            type: 'string',
            description: 'Search query (searches name, email, phone, mobile)',
          },
        },
        required: ['query'],
      },
      handler: async (args: any) => {
        const results = await client.searchContacts(args.query);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(results, null, 2),
            },
          ],
        };
      },
    },

    freshdesk_merge_contacts: {
      description: 'Merge two contacts (secondary contact will be deleted)',
      parameters: {
        type: 'object',
        properties: {
          primary_contact_id: {
            type: 'number',
            description: 'Primary contact ID (will be kept)',
          },
          secondary_contact_id: {
            type: 'number',
            description: 'Secondary contact ID (will be merged and deleted)',
          },
        },
        required: ['primary_contact_id', 'secondary_contact_id'],
      },
      handler: async (args: any) => {
        const result = await client.mergeContacts(args.primary_contact_id, args.secondary_contact_id);
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

    freshdesk_make_agent: {
      description: 'Convert a contact to an agent',
      parameters: {
        type: 'object',
        properties: {
          contact_id: {
            type: 'number',
            description: 'Contact ID',
          },
          occasional: {
            type: 'boolean',
            description: 'Make occasional agent (limited access)',
          },
          signature: {
            type: 'string',
            description: 'Agent email signature',
          },
          ticket_scope: {
            type: 'number',
            description: 'Ticket scope: 1=Global, 2=Group, 3=Restricted',
          },
          group_ids: {
            type: 'array',
            items: { type: 'number' },
            description: 'Group IDs',
          },
          role_ids: {
            type: 'array',
            items: { type: 'number' },
            description: 'Role IDs',
          },
        },
        required: ['contact_id'],
      },
      handler: async (args: any) => {
        const { contact_id, ...agentData } = args;
        const agent = await client.makeAgent(contact_id, agentData);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(agent, null, 2),
            },
          ],
        };
      },
    },

    freshdesk_list_contact_fields: {
      description: 'List all contact custom fields',
      parameters: {
        type: 'object',
        properties: {},
      },
      handler: async () => {
        const fields = await client.listContactFields();
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
