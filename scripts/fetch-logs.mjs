 
import { GoogleAuth } from 'google-auth-library';
import fetch from 'node-fetch';

async function main() {
  const auth = new GoogleAuth({
    keyFile: 'gcp-billing-key.json',
    scopes: ['https://www.googleapis.com/auth/cloud-platform'],
  });

  const client = await auth.getClient();
  const token = await client.getAccessToken();

  const res = await fetch('https://logging.googleapis.com/v2/entries:list', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token.token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      resourceNames: ['projects/knight-shift-agents'],
      filter: 'resource.type="cloud_run_revision" AND resource.labels.service_name="knight-shift-orchestrator" AND severity>=ERROR',
      orderBy: 'timestamp desc',
      pageSize: 5
    })
  });

  const data = await res.json();
  console.log(JSON.stringify(data, null, 2));
}

main().catch(console.error);
