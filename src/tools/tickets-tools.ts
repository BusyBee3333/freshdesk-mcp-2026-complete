import type { FreshDeskClient } from '../api/client.js';

export function registerTicketTools(client: FreshDeskClient) {
  return {
    freshdesk_list_tickets: {
      description: 'List all tickets with optional filters (status, priority, requester_id, etc.)',
      parameters: {
        type: 'object',
        properties: {
          filter: {
            type: 'string',
            description: 'Filter predefined queries (new_and_my_open, watching, spam, deleted)',
          },
          requester_id: {
            type: 'number',
            description: 'Filter by requester contact ID',
          },
          email: {
            type: 'string',
            description: 'Filter by requester email',
          },
          company_id: {
            type: 'number',
            description: 'Filter by company ID',
          },
          updated_since: {
            type: 'string',
            description: 'Filter tickets updated after this timestamp (ISO 8601)',
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
        const result = await client.listTickets(args);
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

    freshdesk_get_ticket: {
      description: 'Get a specific ticket by ID',
      parameters: {
        type: 'object',
        properties: {
          ticket_id: {
            type: 'number',
            description: 'Ticket ID',
          },
        },
        required: ['ticket_id'],
      },
      handler: async (args: any) => {
        const ticket = await client.getTicket(args.ticket_id);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(ticket, null, 2),
            },
          ],
        };
      },
    },

    freshdesk_create_ticket: {
      description: 'Create a new ticket',
      parameters: {
        type: 'object',
        properties: {
          subject: {
            type: 'string',
            description: 'Ticket subject',
          },
          description: {
            type: 'string',
            description: 'Ticket description (HTML)',
          },
          email: {
            type: 'string',
            description: 'Requester email (required if no requester_id)',
          },
          requester_id: {
            type: 'number',
            description: 'Requester contact ID',
          },
          status: {
            type: 'number',
            description: 'Status: 2=Open, 3=Pending, 4=Resolved, 5=Closed',
          },
          priority: {
            type: 'number',
            description: 'Priority: 1=Low, 2=Medium, 3=High, 4=Urgent',
          },
          source: {
            type: 'number',
            description: 'Source: 1=Email, 2=Portal, 3=Phone, 7=Chat, 8=Feedback, 9=Outbound Email',
          },
          type: {
            type: 'string',
            description: 'Ticket type',
          },
          responder_id: {
            type: 'number',
            description: 'Agent ID to assign',
          },
          group_id: {
            type: 'number',
            description: 'Group ID to assign',
          },
          company_id: {
            type: 'number',
            description: 'Company ID',
          },
          product_id: {
            type: 'number',
            description: 'Product ID',
          },
          tags: {
            type: 'array',
            items: { type: 'string' },
            description: 'Tags',
          },
          cc_emails: {
            type: 'array',
            items: { type: 'string' },
            description: 'CC email addresses',
          },
          custom_fields: {
            type: 'object',
            description: 'Custom field values',
          },
        },
        required: ['subject', 'description'],
      },
      handler: async (args: any) => {
        const ticket = await client.createTicket(args);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(ticket, null, 2),
            },
          ],
        };
      },
    },

    freshdesk_update_ticket: {
      description: 'Update an existing ticket',
      parameters: {
        type: 'object',
        properties: {
          ticket_id: {
            type: 'number',
            description: 'Ticket ID',
          },
          subject: {
            type: 'string',
            description: 'Ticket subject',
          },
          description: {
            type: 'string',
            description: 'Ticket description',
          },
          status: {
            type: 'number',
            description: 'Status: 2=Open, 3=Pending, 4=Resolved, 5=Closed',
          },
          priority: {
            type: 'number',
            description: 'Priority: 1=Low, 2=Medium, 3=High, 4=Urgent',
          },
          type: {
            type: 'string',
            description: 'Ticket type',
          },
          responder_id: {
            type: 'number',
            description: 'Agent ID',
          },
          group_id: {
            type: 'number',
            description: 'Group ID',
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
        required: ['ticket_id'],
      },
      handler: async (args: any) => {
        const { ticket_id, ...updateData } = args;
        const ticket = await client.updateTicket(ticket_id, updateData);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(ticket, null, 2),
            },
          ],
        };
      },
    },

    freshdesk_delete_ticket: {
      description: 'Delete a ticket (moves to trash)',
      parameters: {
        type: 'object',
        properties: {
          ticket_id: {
            type: 'number',
            description: 'Ticket ID',
          },
        },
        required: ['ticket_id'],
      },
      handler: async (args: any) => {
        await client.deleteTicket(args.ticket_id);
        return {
          content: [
            {
              type: 'text',
              text: `Ticket ${args.ticket_id} deleted successfully`,
            },
          ],
        };
      },
    },

    freshdesk_restore_ticket: {
      description: 'Restore a deleted ticket from trash',
      parameters: {
        type: 'object',
        properties: {
          ticket_id: {
            type: 'number',
            description: 'Ticket ID',
          },
        },
        required: ['ticket_id'],
      },
      handler: async (args: any) => {
        const ticket = await client.restoreTicket(args.ticket_id);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(ticket, null, 2),
            },
          ],
        };
      },
    },

    freshdesk_list_conversations: {
      description: 'List all conversations (replies and notes) for a ticket',
      parameters: {
        type: 'object',
        properties: {
          ticket_id: {
            type: 'number',
            description: 'Ticket ID',
          },
        },
        required: ['ticket_id'],
      },
      handler: async (args: any) => {
        const conversations = await client.listConversations(args.ticket_id);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(conversations, null, 2),
            },
          ],
        };
      },
    },

    freshdesk_add_reply: {
      description: 'Add a public reply to a ticket',
      parameters: {
        type: 'object',
        properties: {
          ticket_id: {
            type: 'number',
            description: 'Ticket ID',
          },
          body: {
            type: 'string',
            description: 'Reply body (HTML)',
          },
          from_email: {
            type: 'string',
            description: 'From email (must be an agent email)',
          },
          user_id: {
            type: 'number',
            description: 'Agent user ID',
          },
          cc_emails: {
            type: 'array',
            items: { type: 'string' },
            description: 'CC email addresses',
          },
          bcc_emails: {
            type: 'array',
            items: { type: 'string' },
            description: 'BCC email addresses',
          },
        },
        required: ['ticket_id', 'body'],
      },
      handler: async (args: any) => {
        const { ticket_id, ...replyData } = args;
        const reply = await client.addReply(ticket_id, replyData);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(reply, null, 2),
            },
          ],
        };
      },
    },

    freshdesk_add_note: {
      description: 'Add a private note to a ticket',
      parameters: {
        type: 'object',
        properties: {
          ticket_id: {
            type: 'number',
            description: 'Ticket ID',
          },
          body: {
            type: 'string',
            description: 'Note body (HTML)',
          },
          user_id: {
            type: 'number',
            description: 'Agent user ID',
          },
          notify_emails: {
            type: 'array',
            items: { type: 'string' },
            description: 'Email addresses to notify',
          },
          private: {
            type: 'boolean',
            description: 'Make note private (default true)',
          },
        },
        required: ['ticket_id', 'body'],
      },
      handler: async (args: any) => {
        const { ticket_id, ...noteData } = args;
        const note = await client.addNote(ticket_id, noteData);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(note, null, 2),
            },
          ],
        };
      },
    },

    freshdesk_list_time_entries: {
      description: 'List all time entries for a ticket',
      parameters: {
        type: 'object',
        properties: {
          ticket_id: {
            type: 'number',
            description: 'Ticket ID',
          },
        },
        required: ['ticket_id'],
      },
      handler: async (args: any) => {
        const entries = await client.listTimeEntries(args.ticket_id);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(entries, null, 2),
            },
          ],
        };
      },
    },

    freshdesk_add_time_entry: {
      description: 'Add a time entry to a ticket',
      parameters: {
        type: 'object',
        properties: {
          ticket_id: {
            type: 'number',
            description: 'Ticket ID',
          },
          time_spent: {
            type: 'string',
            description: 'Time spent (e.g., "01:30" for 1 hour 30 minutes)',
          },
          billable: {
            type: 'boolean',
            description: 'Is billable',
          },
          note: {
            type: 'string',
            description: 'Note about time entry',
          },
          agent_id: {
            type: 'number',
            description: 'Agent ID',
          },
          executed_at: {
            type: 'string',
            description: 'When the work was done (ISO 8601)',
          },
        },
        required: ['ticket_id', 'time_spent'],
      },
      handler: async (args: any) => {
        const { ticket_id, ...entryData } = args;
        const entry = await client.addTimeEntry(ticket_id, entryData);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(entry, null, 2),
            },
          ],
        };
      },
    },

    freshdesk_list_watchers: {
      description: 'List all watchers for a ticket',
      parameters: {
        type: 'object',
        properties: {
          ticket_id: {
            type: 'number',
            description: 'Ticket ID',
          },
        },
        required: ['ticket_id'],
      },
      handler: async (args: any) => {
        const watchers = await client.listWatchers(args.ticket_id);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(watchers, null, 2),
            },
          ],
        };
      },
    },
  };
}
