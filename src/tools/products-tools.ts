import type { FreshDeskClient } from '../api/client.js';

export function registerProductTools(client: FreshDeskClient) {
  return {
    freshdesk_list_products: {
      description: 'List all products',
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
        const result = await client.listProducts(args);
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

    freshdesk_get_product: {
      description: 'Get a specific product by ID',
      parameters: {
        type: 'object',
        properties: {
          product_id: {
            type: 'number',
            description: 'Product ID',
          },
        },
        required: ['product_id'],
      },
      handler: async (args: any) => {
        const product = await client.getProduct(args.product_id);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(product, null, 2),
            },
          ],
        };
      },
    },

    freshdesk_create_product: {
      description: 'Create a new product',
      parameters: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            description: 'Product name',
          },
          description: {
            type: 'string',
            description: 'Product description',
          },
          primary_email: {
            type: 'string',
            description: 'Primary support email for this product',
          },
        },
        required: ['name'],
      },
      handler: async (args: any) => {
        const product = await client.createProduct(args);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(product, null, 2),
            },
          ],
        };
      },
    },

    freshdesk_update_product: {
      description: 'Update an existing product',
      parameters: {
        type: 'object',
        properties: {
          product_id: {
            type: 'number',
            description: 'Product ID',
          },
          name: {
            type: 'string',
            description: 'Product name',
          },
          description: {
            type: 'string',
            description: 'Product description',
          },
          primary_email: {
            type: 'string',
            description: 'Primary support email',
          },
        },
        required: ['product_id'],
      },
      handler: async (args: any) => {
        const { product_id, ...updateData } = args;
        const product = await client.updateProduct(product_id, updateData);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(product, null, 2),
            },
          ],
        };
      },
    },

    freshdesk_delete_product: {
      description: 'Delete a product',
      parameters: {
        type: 'object',
        properties: {
          product_id: {
            type: 'number',
            description: 'Product ID',
          },
        },
        required: ['product_id'],
      },
      handler: async (args: any) => {
        await client.deleteProduct(args.product_id);
        return {
          content: [
            {
              type: 'text',
              text: `Product ${args.product_id} deleted successfully`,
            },
          ],
        };
      },
    },
  };
}
