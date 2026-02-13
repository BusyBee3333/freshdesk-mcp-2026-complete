import type { FreshDeskClient } from '../api/client.js';

export function registerCannedResponseTools(client: FreshDeskClient) {
  return {
    freshdesk_list_canned_responses: {
      description: 'List all canned (saved) responses',
      parameters: {
        type: 'object',
        properties: {},
      },
      handler: async () => {
        const responses = await client.listCannedResponses();
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(responses, null, 2),
            },
          ],
        };
      },
    },

    freshdesk_get_canned_response: {
      description: 'Get a specific canned response by ID',
      parameters: {
        type: 'object',
        properties: {
          response_id: {
            type: 'number',
            description: 'Canned response ID',
          },
        },
        required: ['response_id'],
      },
      handler: async (args: any) => {
        const response = await client.getCannedResponse(args.response_id);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(response, null, 2),
            },
          ],
        };
      },
    },

    freshdesk_create_canned_response: {
      description: 'Create a new canned response',
      parameters: {
        type: 'object',
        properties: {
          title: {
            type: 'string',
            description: 'Response title',
          },
          content: {
            type: 'string',
            description: 'Response content (HTML)',
          },
          group_ids: {
            type: 'array',
            items: { type: 'number' },
            description: 'Group IDs that can use this response',
          },
          visibility: {
            type: 'number',
            description: 'Visibility: 0=All agents, 1=Personal, 2=Groups',
          },
        },
        required: ['title', 'content'],
      },
      handler: async (args: any) => {
        const response = await client.createCannedResponse(args);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(response, null, 2),
            },
          ],
        };
      },
    },

    freshdesk_update_canned_response: {
      description: 'Update an existing canned response',
      parameters: {
        type: 'object',
        properties: {
          response_id: {
            type: 'number',
            description: 'Canned response ID',
          },
          title: {
            type: 'string',
            description: 'Response title',
          },
          content: {
            type: 'string',
            description: 'Response content (HTML)',
          },
          group_ids: {
            type: 'array',
            items: { type: 'number' },
            description: 'Group IDs',
          },
          visibility: {
            type: 'number',
            description: 'Visibility level',
          },
        },
        required: ['response_id'],
      },
      handler: async (args: any) => {
        const { response_id, ...updateData } = args;
        const response = await client.updateCannedResponse(response_id, updateData);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(response, null, 2),
            },
          ],
        };
      },
    },

    freshdesk_delete_canned_response: {
      description: 'Delete a canned response',
      parameters: {
        type: 'object',
        properties: {
          response_id: {
            type: 'number',
            description: 'Canned response ID',
          },
        },
        required: ['response_id'],
      },
      handler: async (args: any) => {
        await client.deleteCannedResponse(args.response_id);
        return {
          content: [
            {
              type: 'text',
              text: `Canned response ${args.response_id} deleted successfully`,
            },
          ],
        };
      },
    },
  };
}
