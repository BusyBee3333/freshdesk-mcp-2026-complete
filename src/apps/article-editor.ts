export function getArticleEditorApp(): string {
  return `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><title>Article Editor</title><style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;background:#f5f7fa;padding:20px}.container{max-width:1000px;margin:0 auto}.header{background:white;padding:24px;border-radius:12px;margin-bottom:20px;box-shadow:0 2px 4px rgba(0,0,0,0.1);display:flex;justify-content:space-between;align-items:center}.header h1{font-size:24px;color:#1f2937}.actions{display:flex;gap:12px}button{padding:10px 20px;border:none;border-radius:6px;cursor:pointer;font-weight:600}.btn-primary{background:#667eea;color:white}.btn-secondary{background:#e5e7eb;color:#374151}.editor-card{background:white;padding:30px;border-radius:12px;box-shadow:0 2px 4px rgba(0,0,0,0.1)}.form-group{margin-bottom:24px}.form-group label{display:block;font-weight:600;color:#374151;margin-bottom:8px;font-size:14px}.form-group input,.form-group select,.form-group textarea{width:100%;padding:12px;border:1px solid #d1d5db;border-radius:6px;font-family:inherit;font-size:14px}.form-group textarea{min-height:300px;resize:vertical}.form-group input:focus,.form-group select:focus,.form-group textarea:focus{outline:none;border-color:#667eea}.meta-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:16px}.toolbar{display:flex;gap:8px;margin-bottom:12px;padding:12px;background:#f9fafb;border-radius:6px}.toolbar button{padding:8px 12px;background:white;border:1px solid #d1d5db;border-radius:4px;cursor:pointer;font-size:12px}.toolbar button:hover{background:#f3f4f6}</style></head><body><div class="container"><div class="header"><h1>✏️ Article Editor</h1><div class="actions"><button class="btn-secondary">Preview</button><button class="btn-secondary">Save Draft</button><button class="btn-primary">Publish</button></div></div><div class="editor-card"><form><div class="form-group"><label>Article Title</label><input type="text" placeholder="Enter article title..." value="How to reset your password"></div><div class="meta-grid"><div class="form-group"><label>Category</label><select><option>Getting Started</option><option>Account & Billing</option><option selected>Technical Issues</option><option>API Documentation</option></select></div><div class="form-group"><label>Folder</label><select><option>Account Management</option><option selected>Login & Access</option><option>Troubleshooting</option></select></div></div><div class="form-group"><label>Status</label><select><option>Draft</option><option selected>Published</option></select></div><div class="form-group"><label>Tags</label><input type="text" placeholder="password, reset, login" value="password, reset, login, security"></div><div class="form-group"><label>Content</label><div class="toolbar"><button type="button">Bold</button><button type="button">Italic</button><button type="button">Link</button><button type="button">Image</button><button type="button">Code</button><button type="button">List</button></div><textarea placeholder="Write your article content here...">## Overview

If you've forgotten your password or are having trouble logging in, follow these steps to reset your password:

## Steps to Reset Password

1. Navigate to the login page
2. Click "Forgot Password?" below the login form
3. Enter your email address
4. Check your email for a reset link
5. Click the link and create a new password

## Password Requirements

Your new password must:
- Be at least 8 characters long
- Contain at least one uppercase letter
- Contain at least one number
- Contain at least one special character

## Still Having Issues?

If you continue to have problems, please contact our support team.</textarea></div><div class="form-group"><label>SEO Description</label><input type="text" placeholder="Brief description for search engines..." value="Learn how to reset your password and regain access to your account"></div></form></div></div></body></html>`;
}
