import { INITIAL_INVENTORY, INITIAL_TRANSACTIONS } from '../data/prototypeData';
import { apiClient } from './apiClient';
import { auditService } from './auditService';
import { syncService } from './syncService';

const INVENTORY_STORAGE_KEY = 'kartavya_inventory';
const TRANSACTIONS_STORAGE_KEY = 'kartavya_transactions';

const getLocalInventory = () => {
  const stored = localStorage.getItem(INVENTORY_STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(INVENTORY_STORAGE_KEY, JSON.stringify(INITIAL_INVENTORY));
    return [...INITIAL_INVENTORY];
  }
  return JSON.parse(stored);
};

const getLocalTransactions = () => {
  const stored = localStorage.getItem(TRANSACTIONS_STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(TRANSACTIONS_STORAGE_KEY, JSON.stringify(INITIAL_TRANSACTIONS));
    return [...INITIAL_TRANSACTIONS];
  }
  return JSON.parse(stored);
};

const saveLocalInventory = (items) => {
  localStorage.setItem(INVENTORY_STORAGE_KEY, JSON.stringify(items));
};

const saveLocalTransactions = (txs) => {
  localStorage.setItem(TRANSACTIONS_STORAGE_KEY, JSON.stringify(txs));
};

export const inventoryService = {
  getInventory: async (filters = {}) => {
    const res = await apiClient.get('/inventory', filters);
    if (!res || res.isFallback) {
      let items = getLocalInventory();

      if (filters.search) {
        const q = filters.search.toLowerCase();
        items = items.filter(i => 
          i.name.toLowerCase().includes(q) ||
          i.sku.toLowerCase().includes(q) ||
          i.location.toLowerCase().includes(q) ||
          i.category.toLowerCase().includes(q)
        );
      }

      if (filters.category && filters.category !== 'All') {
        items = items.filter(i => i.category.toLowerCase().includes(filters.category.toLowerCase()));
      }

      if (filters.location && filters.location !== 'All') {
        items = items.filter(i => i.location === filters.location);
      }

      if (filters.status && filters.status !== 'All') {
        items = items.filter(i => i.status.toLowerCase() === filters.status.toLowerCase());
      }

      return {
        data: items,
        isPrototypeData: true,
        source: 'Local Prototype Storage Engine'
      };
    }
    return res;
  },

  getItemById: async (id) => {
    const res = await apiClient.get(`/inventory/${id}`);
    if (!res || res.isFallback) {
      const items = getLocalInventory();
      const item = items.find(i => i.id === id);
      if (!item) throw new Error(`Inventory item ${id} not found.`);
      return { data: item, isPrototypeData: true };
    }
    return res;
  },

  recordStockReceipt: async ({ itemId, quantity, authorizedBy, reason, storageBay = 'Bay 1' }) => {
    const parsedQty = Number(quantity);
    if (!parsedQty || parsedQty <= 0) {
      throw new Error('Receipt quantity must be a positive number greater than 0.');
    }
    if (!authorizedBy || !authorizedBy.trim()) {
      throw new Error('Authorized personnel name is required for custody trail.');
    }
    if (!reason || !reason.trim()) {
      throw new Error('Receipt purpose / origin reference is required.');
    }

    const res = await apiClient.post(`/inventory/${itemId}/receipt`, { quantity: parsedQty, authorizedBy, reason, storageBay });
    if (!res || res.isFallback) {
      const items = getLocalInventory();
      const index = items.findIndex(i => i.id === itemId);
      if (index === -1) throw new Error(`Item ${itemId} not found.`);

      const item = items[index];
      const prevStock = item.currentStock;
      const newStock = prevStock + parsedQty;

      // Recalculate coverage days
      const newCoverage = Number((newStock / item.avgDailyConsumption).toFixed(1));
      let newStatus = 'Optimal';
      if (newStock < item.safetyStock * 0.7) newStatus = 'Critical';
      else if (newStock <= item.safetyStock) newStatus = 'Low';
      else if (newStock > item.reorderLevel * 2) newStatus = 'Excess';

      const updatedItem = {
        ...item,
        currentStock: newStock,
        stockCoverageDays: newCoverage,
        status: newStatus,
        lastRestocked: new Date().toISOString()
      };

      items[index] = updatedItem;
      saveLocalInventory(items);

      // Record transaction
      const txs = getLocalTransactions();
      const newTx = {
        id: `TX-${Date.now().toString().slice(-4)}`,
        timestamp: new Date().toISOString(),
        type: 'Receipt',
        itemId: item.id,
        itemName: item.name,
        quantity: parsedQty,
        unit: item.unit,
        location: item.location,
        recipient: storageBay,
        authorizedBy,
        reason
      };
      txs.unshift(newTx);
      saveLocalTransactions(txs);

      // Record audit
      await auditService.logAction({
        actor: authorizedBy,
        action: 'Stock Received (Inbound)',
        entityType: 'Inventory Item',
        entityId: item.id,
        previousValue: `${prevStock.toLocaleString()} ${item.unit}`,
        updatedValue: `${newStock.toLocaleString()} ${item.unit} (+${parsedQty.toLocaleString()})`,
        reason
      });

      syncService.enqueueAction({
        type: 'INVENTORY_RECEIPT',
        payload: { itemId, quantity: parsedQty, authorizedBy, reason }
      });

      return { success: true, item: updatedItem, transaction: newTx };
    }
    return res;
  },

  recordStockIssue: async ({ itemId, quantity, authorizedBy, recipient, reason }) => {
    const parsedQty = Number(quantity);
    if (!parsedQty || parsedQty <= 0) {
      throw new Error('Issue quantity must be a positive number greater than 0.');
    }
    if (!recipient || !recipient.trim()) {
      throw new Error('Recipient echelon or unit designation is required.');
    }
    if (!authorizedBy || !authorizedBy.trim()) {
      throw new Error('Authorizing officer is required.');
    }
    if (!reason || !reason.trim()) {
      throw new Error('Issue mission rationale is required.');
    }

    const res = await apiClient.post(`/inventory/${itemId}/issue`, { quantity: parsedQty, authorizedBy, recipient, reason });
    if (!res || res.isFallback) {
      const items = getLocalInventory();
      const index = items.findIndex(i => i.id === itemId);
      if (index === -1) throw new Error(`Item ${itemId} not found.`);

      const item = items[index];
      if (item.currentStock < parsedQty) {
        throw new Error(`Insufficient stock. Current inventory is ${item.currentStock.toLocaleString()} ${item.unit}, cannot issue ${parsedQty.toLocaleString()} ${item.unit}.`);
      }

      const prevStock = item.currentStock;
      const newStock = prevStock - parsedQty;
      const newCoverage = Number((newStock / item.avgDailyConsumption).toFixed(1));

      let newStatus = 'Optimal';
      if (newStock < item.safetyStock * 0.7) newStatus = 'Critical';
      else if (newStock <= item.safetyStock) newStatus = 'Low';
      else if (newStock > item.reorderLevel * 2) newStatus = 'Excess';

      const updatedItem = {
        ...item,
        currentStock: newStock,
        stockCoverageDays: newCoverage,
        status: newStatus
      };

      items[index] = updatedItem;
      saveLocalInventory(items);

      // Record transaction
      const txs = getLocalTransactions();
      const newTx = {
        id: `TX-${Date.now().toString().slice(-4)}`,
        timestamp: new Date().toISOString(),
        type: 'Issue',
        itemId: item.id,
        itemName: item.name,
        quantity: parsedQty,
        unit: item.unit,
        location: item.location,
        recipient,
        authorizedBy,
        reason
      };
      txs.unshift(newTx);
      saveLocalTransactions(txs);

      // Record audit
      await auditService.logAction({
        actor: authorizedBy,
        action: 'Stock Issued (Outbound)',
        entityType: 'Inventory Item',
        entityId: item.id,
        previousValue: `${prevStock.toLocaleString()} ${item.unit}`,
        updatedValue: `${newStock.toLocaleString()} ${item.unit} (-${parsedQty.toLocaleString()})`,
        reason: `${reason} (Recipient: ${recipient})`
      });

      syncService.enqueueAction({
        type: 'INVENTORY_ISSUE',
        payload: { itemId, quantity: parsedQty, recipient, authorizedBy, reason }
      });

      return { success: true, item: updatedItem, transaction: newTx };
    }
    return res;
  },

  getTransactions: async (itemId = null) => {
    const res = await apiClient.get('/inventory/transactions', { itemId });
    if (!res || res.isFallback) {
      let txs = getLocalTransactions();
      if (itemId) {
        txs = txs.filter(t => t.itemId === itemId);
      }
      return { data: txs, isPrototypeData: true };
    }
    return res;
  },

  resetDefaults: () => {
    localStorage.setItem(INVENTORY_STORAGE_KEY, JSON.stringify(INITIAL_INVENTORY));
    localStorage.setItem(TRANSACTIONS_STORAGE_KEY, JSON.stringify(INITIAL_TRANSACTIONS));
  }
};
