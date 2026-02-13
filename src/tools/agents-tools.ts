import type { FreshDeskClient } from '../api/client.js';

export function registerAgentTools(client: FreshDeskClient) {
  return {
    freshdesk_list_agents: {
      description: 'List all agents',
      parameters: {
        type: 'object',
        properties: {
          email: {
            type: 'string',
            description: 'Filter by email',
          },
          mobile: {
            type: 'string',
            description: 'Filter by mobile number',
          },
          phone: {
            type: 'string',
            description: 'Filter by phone number',
          },
          state: {
            type: 'string',
            description: 'Filter by state (fulltime, occasional)',
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
        const result = await client.listAgents(args);
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

    freshdesk_get_agent: {
      description: 'Get a specific agent by ID',
      parameters: {
        type: 'object',
        properties: {
          agent_id: {
            type: 'number',
            description: 'Agent ID',
          },
        },
        required: ['agent_id'],
      },
      handler: async (args: any) => {
        const agent = await client.getAgent(args.agent_id);
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

    freshdesk_update_agent: {
      description: 'Update an existing agent',
      parameters: {
        type: 'object',
        properties: {
          agent_id: {
            type: 'number',
            description: 'Agent ID',
          },
          occasional: {
            type: 'boolean',
            description: 'Make occasional agent',
          },
          signature: {
            type: 'string',
            description: 'Email signature',
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
          available: {
            type: 'boolean',
            description: 'Agent availability',
          },
        },
        required: ['agent_id'],
      },
      handler: async (args: any) => {
        const { agent_id, ...updateData } = args;
        const agent = await client.updateAgent(agent_id, updateData);
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

    freshdesk_get_current_agent: {
      description: 'Get the current authenticated agent (me)',
      parameters: {
        type: 'object',
        properties: {},
      },
      handler: async () => {
        const agent = await client.getCurrentAgent();
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
  };
}
