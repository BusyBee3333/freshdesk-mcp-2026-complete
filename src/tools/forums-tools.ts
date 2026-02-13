import type { FreshDeskClient } from '../api/client.js';

export function registerForumTools(client: FreshDeskClient) {
  return {
    freshdesk_list_forum_categories: {
      description: 'List all forum categories',
      parameters: {
        type: 'object',
        properties: {},
      },
      handler: async () => {
        const categories = await client.listForumCategories();
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(categories, null, 2),
            },
          ],
        };
      },
    },

    freshdesk_get_forum_category: {
      description: 'Get a specific forum category by ID',
      parameters: {
        type: 'object',
        properties: {
          category_id: {
            type: 'number',
            description: 'Category ID',
          },
        },
        required: ['category_id'],
      },
      handler: async (args: any) => {
        const category = await client.getForumCategory(args.category_id);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(category, null, 2),
            },
          ],
        };
      },
    },

    freshdesk_list_forums: {
      description: 'List all forums, optionally filtered by category',
      parameters: {
        type: 'object',
        properties: {
          category_id: {
            type: 'number',
            description: 'Filter by category ID',
          },
        },
      },
      handler: async (args: any) => {
        const forums = await client.listForums(args.category_id);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(forums, null, 2),
            },
          ],
        };
      },
    },

    freshdesk_get_forum: {
      description: 'Get a specific forum by ID',
      parameters: {
        type: 'object',
        properties: {
          forum_id: {
            type: 'number',
            description: 'Forum ID',
          },
        },
        required: ['forum_id'],
      },
      handler: async (args: any) => {
        const forum = await client.getForum(args.forum_id);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(forum, null, 2),
            },
          ],
        };
      },
    },

    freshdesk_list_topics: {
      description: 'List all topics in a forum',
      parameters: {
        type: 'object',
        properties: {
          forum_id: {
            type: 'number',
            description: 'Forum ID',
          },
          filter: {
            type: 'string',
            description: 'Filter: new, stickies, my_topics, participated',
          },
          sort_by: {
            type: 'string',
            description: 'Sort by: created_at, updated_at',
          },
          order: {
            type: 'string',
            description: 'Order: asc, desc',
          },
        },
        required: ['forum_id'],
      },
      handler: async (args: any) => {
        const { forum_id, ...params } = args;
        const topics = await client.listTopics(forum_id, params);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(topics, null, 2),
            },
          ],
        };
      },
    },

    freshdesk_create_topic: {
      description: 'Create a new topic in a forum',
      parameters: {
        type: 'object',
        properties: {
          forum_id: {
            type: 'number',
            description: 'Forum ID',
          },
          title: {
            type: 'string',
            description: 'Topic title',
          },
          message: {
            type: 'string',
            description: 'Topic message (HTML)',
          },
          sticky: {
            type: 'boolean',
            description: 'Make sticky (pinned)',
          },
          locked: {
            type: 'boolean',
            description: 'Lock topic (no more replies)',
          },
        },
        required: ['forum_id', 'title', 'message'],
      },
      handler: async (args: any) => {
        const { forum_id, ...topicData } = args;
        const topic = await client.createTopic(forum_id, topicData);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(topic, null, 2),
            },
          ],
        };
      },
    },
  };
}
