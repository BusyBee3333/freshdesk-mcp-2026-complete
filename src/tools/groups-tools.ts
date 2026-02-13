import type { FreshDeskClient } from '../api/client.js';

export function registerGroupTools(client: FreshDeskClient) {
  return {
    freshdesk_list_groups: {
      description: 'List all groups',
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
        const result = await client.listGroups(args);
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

    freshdesk_get_group: {
      description: 'Get a specific group by ID',
      parameters: {
        type: 'object',
        properties: {
          group_id: {
            type: 'number',
            description: 'Group ID',
          },
        },
        required: ['group_id'],
      },
      handler: async (args: any) => {
        const group = await client.getGroup(args.group_id);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(group, null, 2),
            },
          ],
        };
      },
    },

    freshdesk_create_group: {
      description: 'Create a new group',
      parameters: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            description: 'Group name',
          },
          description: {
            type: 'string',
            description: 'Group description',
          },
          escalate_to: {
            type: 'number',
            description: 'Agent ID to escalate to',
          },
          unassigned_for: {
            type: 'string',
            description: 'Time before escalation (e.g., "30m", "2h")',
          },
          business_calendar_id: {
            type: 'number',
            description: 'Business calendar ID',
          },
          agent_ids: {
            type: 'array',
            items: { type: 'number' },
            description: 'Agent IDs in this group',
          },
        },
        required: ['name'],
      },
      handler: async (args: any) => {
        const group = await client.createGroup(args);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(group, null, 2),
            },
          ],
        };
      },
    },

    freshdesk_update_group: {
      description: 'Update an existing group',
      parameters: {
        type: 'object',
        properties: {
          group_id: {
            type: 'number',
            description: 'Group ID',
          },
          name: {
            type: 'string',
            description: 'Group name',
          },
          description: {
            type: 'string',
            description: 'Group description',
          },
          escalate_to: {
            type: 'number',
            description: 'Agent ID to escalate to',
          },
          unassigned_for: {
            type: 'string',
            description: 'Time before escalation',
          },
          agent_ids: {
            type: 'array',
            items: { type: 'number' },
            description: 'Agent IDs',
          },
        },
        required: ['group_id'],
      },
      handler: async (args: any) => {
        const { group_id, ...updateData } = args;
        const group = await client.updateGroup(group_id, updateData);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(group, null, 2),
            },
          ],
        };
      },
    },

    freshdesk_delete_group: {
      description: 'Delete a group',
      parameters: {
        type: 'object',
        properties: {
          group_id: {
            type: 'number',
            description: 'Group ID',
          },
        },
        required: ['group_id'],
      },
      handler: async (args: any) => {
        await client.deleteGroup(args.group_id);
        return {
          content: [
            {
              type: 'text',
              text: `Group ${args.group_id} deleted successfully`,
            },
          ],
        };
      },
    },
  };
}
