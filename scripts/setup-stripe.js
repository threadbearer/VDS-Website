/* eslint-disable */
/**
 * Setup Stripe Products & Prices
 * Run: node scripts/setup-stripe.js
 * 
 * WARNING: This creates real products in your Stripe test account.
 */

require('dotenv').config({ path: '.env.local' });
const Stripe = require('stripe');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const plans = [
  {
    name: 'Knight Shift Starter',
    description: '1 AI Agent, 100 conversations/mo, Voice & SMS, Basic Analytics.',
    monthlyPrice: 4900, // $49
    metadata: { plan_id: 'starter' },
  },
  {
    name: 'Knight Shift Professional',
    description: '3 AI Agents, 500 conversations/mo, All Channels, Full Analytics & Lead Scoring.',
    monthlyPrice: 14900, // $149
    metadata: { plan_id: 'professional' },
  },
  {
    name: 'Knight Shift Enterprise',
    description: 'Unlimited Agents & Conversations, Custom Integrations, Dedicated Account Manager.',
    monthlyPrice: 39900, // $399
    metadata: { plan_id: 'enterprise' },
  },
];

async function setup() {
  console.log('🔧 Setting up Stripe products...\n');

  for (const plan of plans) {
    // Check if product already exists with this plan_id
    const existing = await stripe.products.search({
      query: `metadata["plan_id"]:"${plan.metadata.plan_id}"`,
    });

    if (existing.data.length > 0) {
      console.log(`✅ ${plan.name} already exists (${existing.data[0].id})`);
      
      // Check if price exists
      const prices = await stripe.prices.list({
        product: existing.data[0].id,
        active: true,
        limit: 1,
      });
      if (prices.data.length > 0) {
        console.log(`   Price: ${prices.data[0].id} ($${prices.data[0].unit_amount / 100}/mo)\n`);
      }
      continue;
    }

    // Create product
    const product = await stripe.products.create({
      name: plan.name,
      description: plan.description,
      metadata: plan.metadata,
    });

    // Create monthly price
    const price = await stripe.prices.create({
      product: product.id,
      unit_amount: plan.monthlyPrice,
      currency: 'usd',
      recurring: { interval: 'month' },
      metadata: plan.metadata,
    });

    console.log(`✅ Created ${plan.name}`);
    console.log(`   Product: ${product.id}`);
    console.log(`   Price:   ${price.id} ($${plan.monthlyPrice / 100}/mo)\n`);
  }

  console.log('Done! Products are ready in your Stripe dashboard.');
  console.log('View them at: https://dashboard.stripe.com/test/products');
}

setup().catch(console.error);
