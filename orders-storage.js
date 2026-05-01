/**
 * Sushi Vibe - Order Storage Manager
 * Uses localStorage to store orders (no database needed)
 * All data stays in the browser - works offline
 */

// Storage key
const STORAGE_KEY = 'sushi_vibe_orders';

// Initialize storage with sample orders if empty
function initOrders() {
    const existing = localStorage.getItem(STORAGE_KEY);
    if (!existing) {
        // Add some sample orders for demonstration
        const sampleOrders = [
            {
                order_id: 'ORD-' + Date.now() + '-001',
                order_date: new Date().toISOString(),
                package: 'Vibe Party Set',
                package_price: '32000',
                guests: '10',
                event_date: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
                event_time: '18:00',
                occasion: 'Birthday Party',
                full_name: 'Samuel T.',
                phone: '+251 912 345678',
                email: 'samuel@example.com',
                delivery_type: 'Delivery',
                delivery_address: 'Bole, Addis Ababa',
                allergies: 'None',
                special_requests: 'Extra wasabi please',
                status: 'pending'
            },
            {
                order_id: 'ORD-' + Date.now() + '-002',
                order_date: new Date(Date.now() - 2 * 86400000).toISOString(),
                package: 'Celebration Feast',
                package_price: '65000',
                guests: '20',
                event_date: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
                event_time: '19:30',
                occasion: 'Wedding',
                full_name: 'Mekdes A.',
                phone: '+251 911 223344',
                email: 'mekdes@example.com',
                delivery_type: 'Delivery',
                delivery_address: 'Piassa, Addis Ababa',
                allergies: 'No shellfish',
                special_requests: 'Please include serving platters',
                status: 'confirmed'
            },
            {
                order_id: 'ORD-' + Date.now() + '-003',
                order_date: new Date(Date.now() - 5 * 86400000).toISOString(),
                package: 'Ultimate Sushi Experience',
                package_price: '105000',
                guests: '30',
                event_date: new Date(Date.now() + 21 * 86400000).toISOString().split('T')[0],
                event_time: '20:00',
                occasion: 'Corporate Event',
                full_name: 'Henok D.',
                phone: '+251 922 334455',
                email: 'henok@example.com',
                delivery_type: 'Pickup',
                delivery_address: '',
                allergies: 'Gluten-free options needed',
                special_requests: 'Provide chopsticks for 35 people',
                status: 'pending'
            }
        ];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(sampleOrders));
    }
}

// Get all orders
function getAllOrders() {
    initOrders();
    const orders = localStorage.getItem(STORAGE_KEY);
    return orders ? JSON.parse(orders) : [];
}

// Save orders to storage
function saveOrders(orders) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
}

// Add new order
function addOrder(orderData) {
    const orders = getAllOrders();
    const newOrder = {
        order_id: 'ORD-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
        order_date: new Date().toISOString(),
        status: 'pending',
        ...orderData
    };
    orders.unshift(newOrder); // Add to beginning
    saveOrders(orders);
    return newOrder;
}

// Get order by ID
function getOrderById(orderId) {
    const orders = getAllOrders();
    return orders.find(o => o.order_id === orderId);
}

// Update order status
function updateOrderStatusById(orderId, newStatus) {
    const orders = getAllOrders();
    const orderIndex = orders.findIndex(o => o.order_id === orderId);
    if (orderIndex !== -1) {
        orders[orderIndex].status = newStatus;
        saveOrders(orders);
        return true;
    }
    return false;
}

// Update full order
function updateOrder(orderId, updatedData) {
    const orders = getAllOrders();
    const orderIndex = orders.findIndex(o => o.order_id === orderId);
    if (orderIndex !== -1) {
        orders[orderIndex] = { ...orders[orderIndex], ...updatedData };
        saveOrders(orders);
        return true;
    }
    return false;
}

// Delete order
function deleteOrderById(orderId) {
    const orders = getAllOrders();
    const filtered = orders.filter(o => o.order_id !== orderId);
    saveOrders(filtered);
    return filtered.length !== orders.length;
}

// Get orders by status
function getOrdersByStatus(status) {
    const orders = getAllOrders();
    return orders.filter(o => o.status === status);
}

// Get order statistics
function getOrderStats() {
    const orders = getAllOrders();
    return {
        total: orders.length,
        pending: orders.filter(o => o.status === 'pending').length,
        confirmed: orders.filter(o => o.status === 'confirmed').length,
        completed: orders.filter(o => o.status === 'completed').length,
        cancelled: orders.filter(o => o.status === 'cancelled').length
    };
}

// Export orders to JSON
function exportOrdersToJSON() {
    return JSON.stringify(getAllOrders(), null, 2);
}

// Clear all orders (use with caution)
function clearAllOrders() {
    localStorage.removeItem(STORAGE_KEY);
    initOrders();
}

// Auto-save order from form (to be called from order.html)
function saveOrderFromForm(formData) {
    const order = {
        order_date: new Date().toISOString(),
        package: formData.package,
        package_price: formData.package_price,
        guests: formData.guests,
        event_date: formData.event_date,
        event_time: formData.event_time,
        occasion: formData.occasion || '',
        full_name: formData.full_name,
        phone: formData.phone,
        email: formData.email,
        delivery_type: formData.delivery_type,
        delivery_address: formData.delivery_address || '',
        allergies: formData.allergies,
        special_requests: formData.special_requests || '',
        status: 'pending'
    };
    return addOrder(order);
}

// Initialize on load
initOrders();
