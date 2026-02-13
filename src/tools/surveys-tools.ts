import type { FreshDeskClient } from '../api/client.js';

export function registerSurveyTools(client: FreshDeskClient) {
  return {
    freshdesk_list_surveys: {
      description: 'List all satisfaction surveys',
      parameters: {
        type: 'object',
        properties: {},
      },
      handler: async () => {
        const surveys = await client.listSurveys();
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(surveys, null, 2),
            },
          ],
        };
      },
    },

    freshdesk_get_satisfaction_ratings: {
      description: 'Get satisfaction ratings with optional filters',
      parameters: {
        type: 'object',
        properties: {
          created_since: {
            type: 'string',
            description: 'Filter ratings created after this timestamp (ISO 8601)',
          },
          rating: {
            type: 'number',
            description: 'Filter by rating value (1-5)',
          },
          user_id: {
            type: 'number',
            description: 'Filter by user ID',
          },
          ticket_id: {
            type: 'number',
            description: 'Filter by ticket ID',
          },
        },
      },
      handler: async (args: any) => {
        const ratings = await client.getSatisfactionRatings(args);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(ratings, null, 2),
            },
          ],
        };
      },
    },
  };
}
