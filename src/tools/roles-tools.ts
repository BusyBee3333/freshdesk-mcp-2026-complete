import type { FreshDeskClient } from '../api/client.js';

export function registerRoleTools(client: FreshDeskClient) {
  return {
    freshdesk_list_roles: {
      description: 'List all roles',
      parameters: {
        type: 'object',
        properties: {},
      },
      handler: async () => {
        const roles = await client.listRoles();
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(roles, null, 2),
            },
          ],
        };
      },
    },

    freshdesk_get_role: {
      description: 'Get a specific role by ID',
      parameters: {
        type: 'object',
        properties: {
          role_id: {
            type: 'number',
            description: 'Role ID',
          },
        },
        required: ['role_id'],
      },
      handler: async (args: any) => {
        const role = await client.getRole(args.role_id);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(role, null, 2),
            },
          ],
        };
      },
    },
  };
}
