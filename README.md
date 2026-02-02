> **🚀 Don't want to self-host?** [Join the waitlist for our fully managed solution →](https://mcpengage.com/freshdesk)
> 
> Zero setup. Zero maintenance. Just connect and automate.

---

# 🎫 Freshdesk MCP Server — AI-Native Support Operations

## 💡 What This Unlocks

**Turn Claude into your L1 support engineer.** This MCP server gives AI direct access to your Freshdesk helpdesk—triaging tickets, drafting responses, managing contacts, and surfacing insights—all through natural language commands.

### 🎯 Freshdesk-Native Power Moves

Real support workflows you can automate instantly:

1. **Morning ticket triage ritual**  
   *"Show me all new tickets from the past 12 hours, categorize by urgency, assign high-priority ones to our senior agents, and draft acknowledgment replies for the rest."*  
   → Automate the first hour of your support day.

2. **Customer sentiment analysis**  
   *"Search all tickets from customer email 'john@acme.com', analyze tone across conversations, flag any escalating frustration, suggest proactive outreach strategies."*  
   → Turn ticket history into relationship intelligence.

3. **SLA compliance sweep**  
   *"List all tickets approaching SLA breach (< 2 hours remaining), group by priority, draft urgent response templates, notify assigned agents via their email."*  
   → Prevent SLA violations before they happen.

4. **Knowledge base gap detection**  
   *"Search tickets for recurring phrases like 'how do I', 'can't figure out', 'doesn't work'—identify top 10 repeat questions, draft KB articles for each, assign to documentation team."*  
   → Data-driven knowledge base strategy.

5. **Bulk ticket cleanup operations**  
   *"Find all 'Waiting on Customer' tickets older than 14 days with no response, send polite check-in messages, update status to 'Pending', tag for closure in 7 days if still no reply."*  
   → Automated ticket hygiene without manual busywork.

### 🔗 The Real Power: Combining Tools

Claude orchestrates multi-step support workflows:

- `search_tickets` (keyword/tag) → `get_ticket` (details) → `reply_ticket` (drafted response)
- `list_tickets` (filtered by status) → `update_ticket` (bulk status changes)
- `list_contacts` → enrich with ticket history → identify VIP customers
- `create_ticket` → assign to agent → add private note with context

## 📦 What's Inside

**8 REST API tools** covering core Freshdesk support operations:

| Tool | Purpose |
|------|---------|
| `list_tickets` | Query tickets with filters (status, priority, agent, date) |
| `get_ticket` | Full ticket details including conversations & metadata |
| `create_ticket` | Generate new tickets from any source with custom fields |
| `update_ticket` | Modify ticket properties (status, priority, assignment, tags) |
| `reply_ticket` | Add public replies or private notes to tickets |
| `list_contacts` | Browse contact/requester directory with search |
| `list_agents` | View agent roster with availability & roles |
| `search_tickets` | Advanced search with Freshdesk query language |

All with proper **Basic Auth** handling, error management, and TypeScript types.

## 🚀 Quick Start

### Option 1: Claude Desktop (Local)

1. **Clone and build:**
   ```bash
   git clone https://github.com/BusyBee3333/Freshdesk-MCP-2026-Complete.git
   cd freshdesk-mcp-2026-complete
   npm install
   npm run build
   ```

2. **Get your Freshdesk API credentials:**
   - Log in to your Freshdesk account
   - Go to **Profile Settings** → **View API Key** (right sidebar)
   - Copy your API key (long alphanumeric string)
   - Note your **Freshdesk domain** (e.g., `yourcompany` from `yourcompany.freshdesk.com`)

3. **Configure Claude Desktop:**
   
   On macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`  
   On Windows: `%APPDATA%\Claude\claude_desktop_config.json`

   ```json
   {
     "mcpServers": {
       "freshdesk": {
         "command": "node",
         "args": ["/ABSOLUTE/PATH/TO/freshdesk-mcp-2026-complete/dist/index.js"],
         "env": {
           "FRESHDESK_API_KEY": "your_api_key_here",
           "FRESHDESK_DOMAIN": "yourcompany"
         }
       }
     }
   }
   ```

4. **Restart Claude Desktop**  
   You'll see the 🔌 icon with Freshdesk tools available.

### Option 2: Docker

```bash
docker build -t freshdesk-mcp .
docker run \
  -e FRESHDESK_API_KEY=your_key_here \
  -e FRESHDESK_DOMAIN=yourcompany \
  freshdesk-mcp
```

## 🔐 Authentication

Freshdesk uses **API Key authentication** (HTTP Basic Auth):

1. **Find your API key:** Profile Settings → View API Key (or regenerate if needed)
2. **API Key format:** Long alphanumeric string (treat like a password)
3. **Authentication method:** Basic Auth with API key as username, "X" as password (handled automatically by MCP server)

**Security notes:**
- API keys have same permissions as your user account (admin keys = full access)
- Never commit API keys to version control
- Rotate keys regularly from Freshdesk settings
- Use environment variables or secrets management for production

**Rate limits:** Freshdesk enforces rate limits based on plan:
- **Estate/Forest plans:** 50,000 API calls/hour
- **Garden plans:** 1,000 API calls/hour
- **Sprout/Blossom plans:** Varies by plan

## 🎯 Example Prompts

Once connected to Claude, use natural language for support operations:

### Ticket Management
- *"Show me all new tickets from the past 24 hours, sorted by priority."*
- *"Create a ticket from customer john@acme.com: subject 'Login issues', description 'User can't access dashboard', priority High, assign to the Mobile team."*
- *"Update ticket #12345 to status Resolved, add tag 'billing-issue', and assign to the Billing group."*

### Ticket Responses
- *"Reply to ticket #789 with: 'Thanks for reaching out! I've escalated this to our engineering team. You'll hear back within 24 hours.' Mark as Pending."*
- *"Add a private note to ticket #456: 'Customer is VIP account—prioritize and offer phone support if needed.'"*

### Searching & Analysis
- *"Search for all tickets with tag 'bug' that are still open, created in the past 7 days."*
- *"Find tickets containing 'refund request' in the description, show me the top 5 by creation date."*
- *"Search for tickets assigned to agent sarah@company.com with status 'Waiting on Customer' for more than 5 days."*

### Contact & Agent Management
- *"List all contacts whose email contains '@enterprise.com' and show their ticket history."*
- *"Show me all active agents, their email addresses, and current ticket workload."*

### Bulk Operations
- *"Find all tickets tagged 'needs-followup' that are older than 3 days, send a check-in message to each customer asking if issue is resolved."*
- *"List all tickets with priority 4 (Urgent) that don't have an assigned agent—distribute evenly across available agents."*

### Intelligence Extraction
- *"Analyze all resolved tickets from the past month, extract common issues, rank by frequency, generate a report."*
- *"Which agent has the fastest average response time this week? Show stats for top 5 agents."*
- *"Identify tickets that have been reopened multiple times—flag for process improvement review."*

## 🛠️ Development

### Prerequisites
- Node.js 18+
- npm or yarn
- Freshdesk account with API access enabled

### Local Setup

```bash
git clone https://github.com/BusyBee3333/Freshdesk-MCP-2026-Complete.git
cd freshdesk-mcp-2026-complete
npm install
cp .env.example .env
# Edit .env with your Freshdesk credentials
npm run build
npm run dev
```

### Testing

```bash
npm test                  # Run all tests
npm run test:watch        # Watch mode
npm run test:coverage     # Coverage report
```

### Testing with Freshdesk Sandbox

Freshdesk offers a **sandbox environment** for testing:
- Clone your production helpdesk to sandbox in admin settings
- Use sandbox domain (`yourcompany-sandbox.freshdesk.com`)
- Test MCP operations without affecting live tickets

## 🐛 Troubleshooting

### "Authentication failed" / 401 error
- **API key incorrect:** Double-check you copied the full key from Profile Settings
- **Domain mismatch:** Ensure `FRESHDESK_DOMAIN` matches your actual subdomain (without `.freshdesk.com`)
- **Key revoked:** If you regenerated your API key, update the environment variable
- **Insufficient permissions:** Some operations require admin/agent roles

### "Tools not appearing in Claude"
- **Restart required:** Always restart Claude Desktop after config changes
- **Absolute paths:** Use full paths in config (no `~` or relative paths)
- **Build check:** Verify `dist/index.js` exists after running `npm run build`

### "Rate limit exceeded" / 429 error
- **Check your plan:** Freshdesk limits API calls based on subscription tier
- **Throttle requests:** Add delays between bulk operations
- **Monitor usage:** Check API call consumption in Freshdesk admin settings

### Ticket operation errors
- **Invalid IDs:** Freshdesk uses numeric ticket IDs (not strings)
- **Status codes:** Use numeric status values (2=Open, 3=Pending, 4=Resolved, 5=Closed)
- **Custom fields:** Check your helpdesk's custom field configuration for valid field names
- **Email validation:** Requester email must be valid format for ticket creation

## 📖 Resources

- **[Freshdesk API v2 Docs](https://developers.freshdesk.com/api/)** — Official REST API reference
- **[API Authentication Guide](https://developers.freshdesk.com/api/#authentication)** — How to use API keys
- **[Tickets API](https://developers.freshdesk.com/api/#tickets)** — Create, update, search tickets
- **[Contacts API](https://developers.freshdesk.com/api/#contacts)** — Manage requesters
- **[Search Syntax](https://developers.freshdesk.com/api/#filter_tickets)** — Advanced search query language
- **[Webhooks](https://developers.freshdesk.com/api/#webhooks)** — Real-time event notifications
- **[MCP Protocol Specification](https://modelcontextprotocol.io/)** — How MCP servers work
- **[Claude Desktop Documentation](https://claude.ai/desktop)** — Desktop app setup

## 🤝 Contributing

Contributions welcome! To add features:

1. Fork the repo
2. Create a feature branch (`git checkout -b feature/ticket-merge`)
3. Commit your changes (`git commit -m 'Add ticket merge capability'`)
4. Push to the branch (`git push origin feature/ticket-merge`)
5. Open a Pull Request

**Ideas for contributions:**
- Support for ticket attachments (file uploads)
- Custom field management helpers
- Group & company management tools
- Time tracking integration
- Satisfaction survey response parsing
- Canned response library integration
- Ticket merge/split operations
- SLA policy management

## 📄 License

MIT License - see [LICENSE](LICENSE) for details

## 🙏 Credits

Built by [MCPEngage](https://mcpengage.com) — AI infrastructure for business software.

Want more MCP servers? Check out our [full catalog](https://mcpengage.com) covering 30+ business platforms.

---

**Questions?** Open an issue or join our [Discord community](https://discord.gg/mcpengage).
