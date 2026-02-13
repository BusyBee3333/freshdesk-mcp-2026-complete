export function getTicketDetailApp(): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>FreshDesk Ticket Detail</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
      background: #f5f7fa;
      padding: 20px;
    }
    .container { max-width: 1200px; margin: 0 auto; }
    .header {
      background: white;
      padding: 30px;
      border-radius: 12px;
      margin-bottom: 20px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .ticket-id { color: #667eea; font-size: 14px; font-weight: 600; margin-bottom: 8px; }
    h1 { font-size: 28px; margin-bottom: 16px; color: #1f2937; }
    .meta-row {
      display: flex;
      gap: 24px;
      flex-wrap: wrap;
      color: #6b7280;
      font-size: 14px;
    }
    .meta-item { display: flex; align-items: center; gap: 6px; }
    .badge {
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
    }
    .badge-open { background: #dbeafe; color: #1e40af; }
    .badge-high { background: #fee2e2; color: #991b1b; }
    .main-grid { display: grid; grid-template-columns: 1fr 350px; gap: 20px; }
    .conversation-panel {
      background: white;
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .sidebar {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }
    .sidebar-card {
      background: white;
      border-radius: 12px;
      padding: 20px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .sidebar-card h3 {
      font-size: 16px;
      margin-bottom: 16px;
      color: #1f2937;
    }
    .field-row {
      display: flex;
      justify-content: space-between;
      padding: 10px 0;
      border-bottom: 1px solid #e5e7eb;
    }
    .field-row:last-child { border-bottom: none; }
    .field-label { color: #6b7280; font-size: 14px; }
    .field-value { color: #1f2937; font-weight: 600; font-size: 14px; }
    .conversation-item {
      padding: 16px;
      background: #f9fafb;
      border-radius: 8px;
      margin-bottom: 12px;
      border-left: 3px solid #667eea;
    }
    .conv-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 12px;
      font-size: 14px;
    }
    .conv-author { font-weight: 600; color: #1f2937; }
    .conv-time { color: #9ca3af; }
    .conv-body { line-height: 1.6; color: #374151; }
    .reply-box {
      margin-top: 20px;
      padding: 20px;
      background: #f9fafb;
      border-radius: 8px;
    }
    .reply-box textarea {
      width: 100%;
      padding: 12px;
      border: 1px solid #d1d5db;
      border-radius: 6px;
      font-family: inherit;
      font-size: 14px;
      resize: vertical;
      min-height: 100px;
    }
    .btn {
      padding: 10px 20px;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 600;
      font-size: 14px;
      margin-top: 12px;
    }
    .btn-primary { background: #667eea; color: white; }
    .btn-secondary { background: #e5e7eb; color: #374151; margin-left: 8px; }
    .action-buttons {
      display: flex;
      gap: 8px;
      margin-top: 20px;
    }
    @media (max-width: 768px) {
      .main-grid { grid-template-columns: 1fr; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="ticket-id">#12345</div>
      <h1>Cannot access customer portal</h1>
      <div class="meta-row">
        <span class="meta-item">
          <span class="badge badge-open">OPEN</span>
        </span>
        <span class="meta-item">
          <span class="badge badge-high">HIGH PRIORITY</span>
        </span>
        <span class="meta-item">👤 john.doe@example.com</span>
        <span class="meta-item">🕐 Created 2 hours ago</span>
        <span class="meta-item">🔄 Updated 15 mins ago</span>
      </div>
    </div>

    <div class="main-grid">
      <div class="conversation-panel">
        <h2 style="margin-bottom: 20px;">Conversation</h2>
        
        <div class="conversation-item">
          <div class="conv-header">
            <span class="conv-author">John Doe</span>
            <span class="conv-time">2 hours ago</span>
          </div>
          <div class="conv-body">
            I've been trying to log into the customer portal for the past hour but keep getting an error message. 
            It says "Authentication failed" even though I'm using the correct credentials. Can someone help?
          </div>
        </div>

        <div class="conversation-item" style="border-left-color: #10b981;">
          <div class="conv-header">
            <span class="conv-author">Support Agent (You)</span>
            <span class="conv-time">1 hour ago</span>
          </div>
          <div class="conv-body">
            Hi John, thank you for reaching out. I've checked your account and I see the issue. 
            Your account was temporarily locked due to multiple failed login attempts. I've unlocked it now. 
            Please try logging in again and let me know if you still face any issues.
          </div>
        </div>

        <div class="reply-box">
          <h3 style="margin-bottom: 12px;">Add Reply</h3>
          <textarea placeholder="Type your reply here..."></textarea>
          <div class="action-buttons">
            <button class="btn btn-primary">Send Reply</button>
            <button class="btn btn-secondary">Add Private Note</button>
            <button class="btn btn-secondary">Add Time Entry</button>
          </div>
        </div>
      </div>

      <div class="sidebar">
        <div class="sidebar-card">
          <h3>Ticket Properties</h3>
          <div class="field-row">
            <span class="field-label">Status</span>
            <span class="field-value">Open</span>
          </div>
          <div class="field-row">
            <span class="field-label">Priority</span>
            <span class="field-value">High</span>
          </div>
          <div class="field-row">
            <span class="field-label">Type</span>
            <span class="field-value">Technical Issue</span>
          </div>
          <div class="field-row">
            <span class="field-label">Source</span>
            <span class="field-value">Email</span>
          </div>
          <div class="field-row">
            <span class="field-label">Group</span>
            <span class="field-value">Technical Support</span>
          </div>
        </div>

        <div class="sidebar-card">
          <h3>Requester</h3>
          <div class="field-row">
            <span class="field-label">Name</span>
            <span class="field-value">John Doe</span>
          </div>
          <div class="field-row">
            <span class="field-label">Email</span>
            <span class="field-value">john.doe@example.com</span>
          </div>
          <div class="field-row">
            <span class="field-label">Company</span>
            <span class="field-value">Acme Corp</span>
          </div>
          <div class="field-row">
            <span class="field-label">Open Tickets</span>
            <span class="field-value">3</span>
          </div>
        </div>

        <div class="sidebar-card">
          <h3>Actions</h3>
          <button class="btn btn-primary" style="width: 100%; margin-top: 8px;">Update Status</button>
          <button class="btn btn-secondary" style="width: 100%; margin-top: 8px;">Assign Agent</button>
          <button class="btn btn-secondary" style="width: 100%; margin-top: 8px;">Change Priority</button>
          <button class="btn btn-secondary" style="width: 100%; margin-top: 8px;">Merge Ticket</button>
        </div>
      </div>
    </div>
  </div>
</body>
</html>
  `;
}
