import type { FreshDeskClient } from '../api/client.js';

export function registerReportingTools(client: FreshDeskClient) {
  return {
    freshdesk_agent_performance: {
      description: 'Get agent performance metrics (tickets resolved, response time, etc.)',
      parameters: {
        type: 'object',
        properties: {
          agent_id: {
            type: 'number',
            description: 'Agent ID',
          },
          start_date: {
            type: 'string',
            description: 'Start date (ISO 8601)',
          },
          end_date: {
            type: 'string',
            description: 'End date (ISO 8601)',
          },
        },
      },
      handler: async (args: any) => {
        // FreshDesk Analytics API endpoint
        const params: any = {};
        if (args.start_date) params.start_date = args.start_date;
        if (args.end_date) params.end_date = args.end_date;
        if (args.agent_id) params.agent_id = args.agent_id;

        const metrics = await client.get('/analytics/reports/agent_performance', params);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(metrics, null, 2),
            },
          ],
        };
      },
    },

    freshdesk_group_performance: {
      description: 'Get group performance metrics',
      parameters: {
        type: 'object',
        properties: {
          group_id: {
            type: 'number',
            description: 'Group ID',
          },
          start_date: {
            type: 'string',
            description: 'Start date (ISO 8601)',
          },
          end_date: {
            type: 'string',
            description: 'End date (ISO 8601)',
          },
        },
      },
      handler: async (args: any) => {
        const params: any = {};
        if (args.start_date) params.start_date = args.start_date;
        if (args.end_date) params.end_date = args.end_date;
        if (args.group_id) params.group_id = args.group_id;

        const metrics = await client.get('/analytics/reports/group_performance', params);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(metrics, null, 2),
            },
          ],
        };
      },
    },

    freshdesk_ticket_volume: {
      description: 'Get ticket volume statistics over time',
      parameters: {
        type: 'object',
        properties: {
          start_date: {
            type: 'string',
            description: 'Start date (ISO 8601)',
          },
          end_date: {
            type: 'string',
            description: 'End date (ISO 8601)',
          },
          group_by: {
            type: 'string',
            description: 'Group by: day, week, month',
          },
        },
      },
      handler: async (args: any) => {
        const params: any = {};
        if (args.start_date) params.start_date = args.start_date;
        if (args.end_date) params.end_date = args.end_date;
        if (args.group_by) params.group_by = args.group_by;

        const metrics = await client.get('/analytics/reports/ticket_volume', params);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(metrics, null, 2),
            },
          ],
        };
      },
    },

    freshdesk_resolution_time: {
      description: 'Get average ticket resolution time metrics',
      parameters: {
        type: 'object',
        properties: {
          start_date: {
            type: 'string',
            description: 'Start date (ISO 8601)',
          },
          end_date: {
            type: 'string',
            description: 'End date (ISO 8601)',
          },
          group_id: {
            type: 'number',
            description: 'Filter by group ID',
          },
          agent_id: {
            type: 'number',
            description: 'Filter by agent ID',
          },
        },
      },
      handler: async (args: any) => {
        const params: any = {};
        if (args.start_date) params.start_date = args.start_date;
        if (args.end_date) params.end_date = args.end_date;
        if (args.group_id) params.group_id = args.group_id;
        if (args.agent_id) params.agent_id = args.agent_id;

        const metrics = await client.get('/analytics/reports/resolution_time', params);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(metrics, null, 2),
            },
          ],
        };
      },
    },

    freshdesk_sla_compliance: {
      description: 'Get SLA compliance metrics',
      parameters: {
        type: 'object',
        properties: {
          start_date: {
            type: 'string',
            description: 'Start date (ISO 8601)',
          },
          end_date: {
            type: 'string',
            description: 'End date (ISO 8601)',
          },
          sla_policy_id: {
            type: 'number',
            description: 'Filter by SLA policy ID',
          },
        },
      },
      handler: async (args: any) => {
        const params: any = {};
        if (args.start_date) params.start_date = args.start_date;
        if (args.end_date) params.end_date = args.end_date;
        if (args.sla_policy_id) params.sla_policy_id = args.sla_policy_id;

        const metrics = await client.get('/analytics/reports/sla_compliance', params);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(metrics, null, 2),
            },
          ],
        };
      },
    },
  };
}
