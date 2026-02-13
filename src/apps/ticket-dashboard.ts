export function getTicketDashboardApp(): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>FreshDesk Ticket Dashboard</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 20px;
      color: #333;
    }
    .container { max-width: 1400px; margin: 0 auto; }
    .header {
      background: white;
      padding: 30px;
      border-radius: 12px;
      margin-bottom: 20px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }
    h1 { color: #667eea; font-size: 32px; margin-bottom: 10px; }
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      margin-bottom: 20px;
    }
    .stat-card {
      background: white;
      padding: 24px;
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      transition: transform 0.2s;
    }
    .stat-card:hover { transform: translateY(-4px); }
    .stat-card h3 {
      font-size: 14px;
      color: #666;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 8px;
    }
    .stat-card .value {
      font-size: 36px;
      font-weight: bold;
      color: #667eea;
      margin-bottom: 4px;
    }
    .stat-card .change {
      font-size: 14px;
      color: #10b981;
    }
    .stat-card .change.negative { color: #ef4444; }
    .ticket-list {
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      padding: 24px;
    }
    .ticket-list h2 {
      color: #667eea;
      margin-bottom: 20px;
      font-size: 24px;
    }
    .ticket-item {
      border-left: 4px solid #667eea;
      background: #f9fafb;
      padding: 16px;
      margin-bottom: 12px;
      border-radius: 6px;
      transition: all 0.2s;
    }
    .ticket-item:hover {
      background: #f3f4f6;
      transform: translateX(4px);
    }
    .ticket-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
    }
    .ticket-id {
      font-weight: bold;
      color: #667eea;
      font-size: 14px;
    }
    .ticket-status {
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
    }
    .status-open { background: #dbeafe; color: #1e40af; }
    .status-pending { background: #fef3c7; color: #92400e; }
    .status-resolved { background: #d1fae5; color: #065f46; }
    .status-closed { background: #e5e7eb; color: #374151; }
    .ticket-subject {
      font-size: 16px;
      font-weight: 600;
      margin-bottom: 6px;
      color: #111827;
    }
    .ticket-meta {
      font-size: 13px;
      color: #6b7280;
    }
    .priority-high { border-left-color: #ef4444; }
    .priority-urgent { border-left-color: #dc2626; }
    .priority-low { border-left-color: #10b981; }
    .filters {
      display: flex;
      gap: 12px;
      margin-bottom: 20px;
      flex-wrap: wrap;
    }
    .filter-btn {
      padding: 10px 20px;
      border: 2px solid #667eea;
      background: white;
      color: #667eea;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 600;
      transition: all 0.2s;
    }
    .filter-btn:hover, .filter-btn.active {
      background: #667eea;
      color: white;
    }
    .loading {
      text-align: center;
      padding: 40px;
      color: #667eea;
      font-size: 18px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎫 Ticket Dashboard</h1>
      <p>Real-time overview of your support tickets</p>
    </div>

    <div class="stats-grid">
      <div class="stat-card">
        <h3>Open Tickets</h3>
        <div class="value" id="stat-open">-</div>
        <div class="change">+12% from yesterday</div>
      </div>
      <div class="stat-card">
        <h3>Pending</h3>
        <div class="value" id="stat-pending">-</div>
        <div class="change">-8% from yesterday</div>
      </div>
      <div class="stat-card">
        <h3>Resolved Today</h3>
        <div class="value" id="stat-resolved">-</div>
        <div class="change">+15% from yesterday</div>
      </div>
      <div class="stat-card">
        <h3>Avg Response Time</h3>
        <div class="value" id="stat-response">-</div>
        <div class="change negative">+5 min from yesterday</div>
      </div>
    </div>

    <div class="ticket-list">
      <h2>Recent Tickets</h2>
      <div class="filters">
        <button class="filter-btn active" onclick="filterTickets('all')">All</button>
        <button class="filter-btn" onclick="filterTickets('open')">Open</button>
        <button class="filter-btn" onclick="filterTickets('pending')">Pending</button>
        <button class="filter-btn" onclick="filterTickets('high')">High Priority</button>
        <button class="filter-btn" onclick="filterTickets('urgent')">Urgent</button>
      </div>
      <div id="ticket-container">
        <div class="loading">Loading tickets...</div>
      </div>
    </div>
  </div>

  <script>
    // Sample data - in production, this would call MCP tools
    const sampleTickets = [
      {
        id: 12345,
        subject: "Cannot access customer portal",
        status: "open",
        priority: "high",
        requester: "john.doe@example.com",
        created: "2 hours ago"
      },
      {
        id: 12344,
        subject: "Billing discrepancy on invoice #5678",
        status: "pending",
        priority: "urgent",
        requester: "jane.smith@example.com",
        created: "5 hours ago"
      },
      {
        id: 12343,
        subject: "Feature request: Dark mode",
        status: "open",
        priority: "low",
        requester: "bob.wilson@example.com",
        created: "1 day ago"
      },
      {
        id: 12342,
        subject: "API documentation unclear",
        status: "resolved",
        priority: "medium",
        requester: "alice.johnson@example.com",
        created: "2 days ago"
      },
    ];

    function getStatusClass(status) {
      const map = {
        open: 'status-open',
        pending: 'status-pending',
        resolved: 'status-resolved',
        closed: 'status-closed'
      };
      return map[status] || 'status-open';
    }

    function getPriorityClass(priority) {
      const map = {
        high: 'priority-high',
        urgent: 'priority-urgent',
        low: 'priority-low'
      };
      return map[priority] || '';
    }

    function renderTickets(tickets) {
      const container = document.getElementById('ticket-container');
      container.innerHTML = tickets.map(ticket => \`
        <div class="ticket-item \${getPriorityClass(ticket.priority)}">
          <div class="ticket-header">
            <span class="ticket-id">#\${ticket.id}</span>
            <span class="ticket-status \${getStatusClass(ticket.status)}">\${ticket.status.toUpperCase()}</span>
          </div>
          <div class="ticket-subject">\${ticket.subject}</div>
          <div class="ticket-meta">
            <strong>\${ticket.requester}</strong> • Priority: \${ticket.priority} • Created \${ticket.created}
          </div>
        </div>
      \`).join('');
    }

    function filterTickets(filter) {
      // Update active button
      document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
      });
      event.target.classList.add('active');

      // Filter tickets
      let filtered = sampleTickets;
      if (filter !== 'all') {
        filtered = sampleTickets.filter(t => 
          t.status === filter || t.priority === filter
        );
      }
      renderTickets(filtered);
    }

    // Initialize
    setTimeout(() => {
      document.getElementById('stat-open').textContent = '127';
      document.getElementById('stat-pending').textContent = '43';
      document.getElementById('stat-resolved').textContent = '89';
      document.getElementById('stat-response').textContent = '2.3h';
      renderTickets(sampleTickets);
    }, 500);
  </script>
</body>
</html>
  `;
}
