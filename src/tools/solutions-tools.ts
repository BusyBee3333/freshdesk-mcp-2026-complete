import type { FreshDeskClient } from '../api/client.js';

export function registerSolutionTools(client: FreshDeskClient) {
  return {
    freshdesk_list_solution_categories: {
      description: 'List all solution (knowledge base) categories',
      parameters: {
        type: 'object',
        properties: {},
      },
      handler: async () => {
        const categories = await client.listSolutionCategories();
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

    freshdesk_get_solution_category: {
      description: 'Get a specific solution category by ID',
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
        const category = await client.getSolutionCategory(args.category_id);
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

    freshdesk_list_solution_folders: {
      description: 'List all folders in a solution category',
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
        const folders = await client.listSolutionFolders(args.category_id);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(folders, null, 2),
            },
          ],
        };
      },
    },

    freshdesk_get_solution_folder: {
      description: 'Get a specific solution folder by ID',
      parameters: {
        type: 'object',
        properties: {
          folder_id: {
            type: 'number',
            description: 'Folder ID',
          },
        },
        required: ['folder_id'],
      },
      handler: async (args: any) => {
        const folder = await client.getSolutionFolder(args.folder_id);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(folder, null, 2),
            },
          ],
        };
      },
    },

    freshdesk_list_articles: {
      description: 'List all articles in a solution folder',
      parameters: {
        type: 'object',
        properties: {
          folder_id: {
            type: 'number',
            description: 'Folder ID',
          },
        },
        required: ['folder_id'],
      },
      handler: async (args: any) => {
        const articles = await client.listArticles(args.folder_id);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(articles, null, 2),
            },
          ],
        };
      },
    },

    freshdesk_get_article: {
      description: 'Get a specific knowledge base article by ID',
      parameters: {
        type: 'object',
        properties: {
          article_id: {
            type: 'number',
            description: 'Article ID',
          },
        },
        required: ['article_id'],
      },
      handler: async (args: any) => {
        const article = await client.getArticle(args.article_id);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(article, null, 2),
            },
          ],
        };
      },
    },

    freshdesk_create_article: {
      description: 'Create a new knowledge base article',
      parameters: {
        type: 'object',
        properties: {
          folder_id: {
            type: 'number',
            description: 'Folder ID',
          },
          title: {
            type: 'string',
            description: 'Article title',
          },
          description: {
            type: 'string',
            description: 'Article content (HTML)',
          },
          status: {
            type: 'number',
            description: 'Status: 1=Draft, 2=Published',
          },
          article_type: {
            type: 'number',
            description: 'Article type: 1=Permanent, 2=Workaround',
          },
          tags: {
            type: 'array',
            items: { type: 'string' },
            description: 'Tags',
          },
          seo_data: {
            type: 'object',
            description: 'SEO metadata',
          },
        },
        required: ['folder_id', 'title', 'description'],
      },
      handler: async (args: any) => {
        const { folder_id, ...articleData } = args;
        const article = await client.createArticle(folder_id, articleData);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(article, null, 2),
            },
          ],
        };
      },
    },

    freshdesk_update_article: {
      description: 'Update an existing knowledge base article',
      parameters: {
        type: 'object',
        properties: {
          article_id: {
            type: 'number',
            description: 'Article ID',
          },
          title: {
            type: 'string',
            description: 'Article title',
          },
          description: {
            type: 'string',
            description: 'Article content (HTML)',
          },
          status: {
            type: 'number',
            description: 'Status: 1=Draft, 2=Published',
          },
          tags: {
            type: 'array',
            items: { type: 'string' },
            description: 'Tags',
          },
        },
        required: ['article_id'],
      },
      handler: async (args: any) => {
        const { article_id, ...updateData } = args;
        const article = await client.updateArticle(article_id, updateData);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(article, null, 2),
            },
          ],
        };
      },
    },
  };
}
