// Cloudflare Worker - Sushi Vibe Order API
// Deploy this to Cloudflare Workers

// CORS headers for security
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Content-Type': 'application/json'
};

// Admin credentials (CHANGE THESE!)
const ADMIN_USERNAME = 'sushiadmin';
const ADMIN_PASSWORD = 'SushiVibe2026!@#';

// Handle requests
export default {
  async fetch(request, env, ctx) {
    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    const url = new URL(request.url);
    const path = url.pathname;
    
    // Authentication check
    const authHeader = request.headers.get('Authorization');
    const isAuthenticated = authHeader === `Basic ${btoa(`${ADMIN_USERNAME}:${ADMIN_PASSWORD}`)}`;
    
    // GET /api/orders - Fetch all orders (requires auth)
    if (path === '/api/orders' && request.method === 'GET') {
      if (!isAuthenticated) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: corsHeaders });
      }
      
      try {
        const orders = await env.ORDERS_KV.get('all_orders', { type: 'json' }) || [];
        return new Response(JSON.stringify(orders), { headers: corsHeaders });
      } catch (error) {
        return new Response(JSON.stringify({ error: 'Failed to fetch orders' }), { status: 500, headers: corsHeaders });
      }
    }
    
    // POST /api/orders - Create new order (public)
    if (path === '/api/orders' && request.method === 'POST') {
      try {
        const orderData = await request.json();
        
        // Validate required fields
        if (!orderData.name || !orderData.phone || !orderData.package) {
          return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400, headers: corsHeaders });
        }
        
        // Create order object
        const newOrder = {
          id: Date.now().toString(),
          orderNumber: `SV${Date.now().toString().slice(-8)}`,
          name: orderData.name,
          phone: orderData.phone,
          email: orderData.email || '',
          package: orderData.package,
          eventDate: orderData.eventDate || 'TBD',
          message: orderData.message || '',
          status: 'pending',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        // Get existing orders
        let orders = await env.ORDERS_KV.get('all_orders', { type: 'json' }) || [];
        orders.unshift(newOrder); // Add to beginning
        await env.ORDERS_KV.put('all_orders', JSON.stringify(orders));
        
        // Also send email notification via FormSubmit
        await fetch('https://formsubmit.co/sushivibes@proton.me', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            _subject: `🍣 NEW ORDER: ${newOrder.orderNumber} - ${newOrder.name}`,
            Order_Number: newOrder.orderNumber,
            Customer_Name: newOrder.name,
            Phone: newOrder.phone,
            Email: newOrder.email,
            Package: newOrder.package,
            Event_Date: newOrder.eventDate,
            Message: newOrder.message,
            Status: newOrder.status
          })
        }).catch(e => console.error('Email notification failed:', e));
        
        return new Response(JSON.stringify({ success: true, order: newOrder }), { status: 201, headers: corsHeaders });
      } catch (error) {
        return new Response(JSON.stringify({ error: 'Failed to create order' }), { status: 500, headers: corsHeaders });
      }
    }
    
    // PUT /api/orders/:id - Update order status (requires auth)
    if (path.startsWith('/api/orders/') && request.method === 'PUT') {
      if (!isAuthenticated) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: corsHeaders });
      }
      
      const orderId = path.split('/').pop();
      try {
        const updates = await request.json();
        let orders = await env.ORDERS_KV.get('all_orders', { type: 'json' }) || [];
        const orderIndex = orders.findIndex(o => o.id === orderId);
        
        if (orderIndex === -1) {
          return new Response(JSON.stringify({ error: 'Order not found' }), { status: 404, headers: corsHeaders });
        }
        
        orders[orderIndex] = { ...orders[orderIndex], ...updates, updatedAt: new Date().toISOString() };
        await env.ORDERS_KV.put('all_orders', JSON.stringify(orders));
        
        return new Response(JSON.stringify({ success: true, order: orders[orderIndex] }), { headers: corsHeaders });
      } catch (error) {
        return new Response(JSON.stringify({ error: 'Failed to update order' }), { status: 500, headers: corsHeaders });
      }
    }
    
    // DELETE /api/orders/:id - Delete order (requires auth)
    if (path.startsWith('/api/orders/') && request.method === 'DELETE') {
      if (!isAuthenticated) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: corsHeaders });
      }
      
      const orderId = path.split('/').pop();
      try {
        let orders = await env.ORDERS_KV.get('all_orders', { type: 'json' }) || [];
        const filteredOrders = orders.filter(o => o.id !== orderId);
        await env.ORDERS_KV.put('all_orders', JSON.stringify(filteredOrders));
        
        return new Response(JSON.stringify({ success: true }), { headers: corsHeaders });
      } catch (error) {
        return new Response(JSON.stringify({ error: 'Failed to delete order' }), { status: 500, headers: corsHeaders });
      }
    }
    
    // GET /api/stats - Get order statistics (requires auth)
    if (path === '/api/stats' && request.method === 'GET') {
      if (!isAuthenticated) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: corsHeaders });
      }
      
      try {
        const orders = await env.ORDERS_KV.get('all_orders', { type: 'json' }) || [];
        const total = orders.length;
        const pending = orders.filter(o => o.status === 'pending').length;
        const confirmed = orders.filter(o => o.status === 'confirmed').length;
        
        // Calculate revenue
        let revenue = 0;
        orders.forEach(order => {
          if (order.status === 'confirmed') {
            if (order.package === 'The Addition') revenue += 14500;
            else if (order.package === 'The Entourage') revenue += 26000;
            else if (order.package === 'The Dynasty') revenue += 36000;
          }
        });
        
        return new Response(JSON.stringify({ total, pending, confirmed, revenue }), { headers: corsHeaders });
      } catch (error) {
        return new Response(JSON.stringify({ error: 'Failed to fetch stats' }), { status: 500, headers: corsHeaders });
      }
    }
    
    // 404
    return new Response(JSON.stringify({ error: 'Not found' }), { status: 404, headers: corsHeaders });
  }
};
