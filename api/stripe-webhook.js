const { createClient } = require('@supabase/supabase-js');
const stripe = require('stripe');

module.exports.config = {
  api: { bodyParser: false }
};

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const sig = req.headers['stripe-signature'];
  if (!sig) return res.status(400).json({ error: 'Missing stripe-signature header' });

  // Collect raw body chunks
  let rawBody = '';
  for await (const chunk of req) {
    rawBody += chunk;
  }

  let event;
  try {
    const stripeClient = stripe(process.env.STRIPE_SECRET_KEY);
    event = stripeClient.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Stripe signature failed:', err.message);
    return res.status(400).json({ error: 'Webhook signature verification failed' });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const invoiceId = session.metadata?.invoice_id || session.client_reference_id;
    if (invoiceId) {
      const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
      const { error } = await supabase.from('invoices').update({ paid_at: new Date().toISOString() }).eq('id', invoiceId);
      if (error) console.error('Failed to mark invoice paid:', error);
    }
  }

  return res.status(200).json({ received: true });
};
