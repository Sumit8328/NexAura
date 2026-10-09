import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Boxes, 
  Search, 
  Filter, 
  ArrowDownLeft, 
  ArrowUpRight, 
  Clock, 
  History, 
  X, 
  Check, 
  AlertTriangle,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  Building,
  Info,
  ChevronRight
} from 'lucide-react';
import Card from '../components/common/Card';
import StatCard from '../components/common/StatCard';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import Modal from '../components/common/Modal';
import Drawer from '../components/common/Drawer';
import DataDisclaimerBanner from '../components/common/DataDisclaimerBanner';
import LoadingScreen from '../components/common/LoadingScreen';
import { inventoryService } from '../services/inventoryService';
import { useToast } from '../context/ToastContext';

export const Inventory = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const { success, error, info } = useToast();

  const [items, setItems] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  // Modals & Drawers
  const [selectedItem, setSelectedItem] = useState(null);
  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);
  const [activeItemForAction, setActiveItemForAction] = useState(null);

  // Form states
  const [receiptForm, setReceiptForm] = useState({ quantity: '', authorizedBy: 'Lt. Cdr. Vance', reason: 'Direct inbound train replenishment', storageBay: 'Bay B-4' });
  const [issueForm, setIssueForm] = useState({ quantity: '', authorizedBy: 'Lt. Cdr. Vance', recipient: 'Task Force Obsidian Patrol', reason: 'Sortie preparation and perimeter defense' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reactive filtering
  useEffect(() => {
    const handler = setTimeout(() => {
      loadInventory();
    }, 150);
    return () => clearTimeout(handler);
  }, [search, selectedCategory, selectedLocation, selectedStatus]);

  const loadInventory = async () => {
    try {
      setLoading(true);
      const res = await inventoryService.getInventory({
        search,
        category: selectedCategory,
        location: selectedLocation,
        status: selectedStatus
      });
      setItems(res.data || []);
      const txRes = await inventoryService.getTransactions();
      setTransactions(txRes.data || []);
    } catch (err) {
      error('Failed to load inventory', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadInventory();
  };

  const clearAllFilters = () => {
    setSearch('');
    setSelectedCategory('All');
    setSelectedLocation('All');
    setSelectedStatus('All');
    setSearchParams({});
  };

  const openItemDetail = (item) => {
    setSelectedItem(item);
    setIsDetailDrawerOpen(true);
  };

  const openReceiptModal = (item) => {
    setActiveItemForAction(item);
    setReceiptForm({ 
      quantity: '', 
      authorizedBy: 'Lt. Cdr. Vance', 
      reason: 'Inbound resupply transfer', 
      storageBay: 'Main Depot Bay 1' 
    });
    setIsReceiptModalOpen(true);
  };

  const openIssueModal = (item) => {
    setActiveItemForAction(item);
    setIssueForm({ 
      quantity: '', 
      authorizedBy: 'Lt. Cdr. Vance', 
      recipient: '1st Mechanized Division', 
      reason: 'Field patrol resupply' 
    });
    setIsIssueModalOpen(true);
  };

  const handleRecordReceipt = async (e) => {
    if (e) e.preventDefault();
    if (!activeItemForAction) return;

    try {
      setIsSubmitting(true);
      const res = await inventoryService.recordStockReceipt({
        itemId: activeItemForAction.id,
        quantity: receiptForm.quantity,
        authorizedBy: receiptForm.authorizedBy,
        reason: receiptForm.reason,
        storageBay: receiptForm.storageBay
      });

      success('Stock Receipt Recorded', `Added ${Number(receiptForm.quantity).toLocaleString()} ${activeItemForAction.unit} to ${activeItemForAction.name}.`);
      setIsReceiptModalOpen(false);
      loadInventory();
      if (selectedItem?.id === activeItemForAction.id) {
        setSelectedItem(res.item);
      }
    } catch (err) {
      error('Stock Receipt Failed', err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRecordIssue = async (e) => {
    if (e) e.preventDefault();
    if (!activeItemForAction) return;

    try {
      setIsSubmitting(true);
      const res = await inventoryService.recordStockIssue({
        itemId: activeItemForAction.id,
        quantity: issueForm.quantity,
        authorizedBy: issueForm.authorizedBy,
        recipient: issueForm.recipient,
        reason: issueForm.reason
      });

      success('Stock Issue Recorded', `Issued ${Number(issueForm.quantity).toLocaleString()} ${activeItemForAction.unit} to ${issueForm.recipient}.`);
      setIsIssueModalOpen(false);
      loadInventory();
      if (selectedItem?.id === activeItemForAction.id) {
        setSelectedItem(res.item);
      }
    } catch (err) {
      error('Stock Issue Failed', err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Compute stats across current items
  const stats = {
    totalStockSKUs: items.length,
    criticalCount: items.filter(i => i.status === 'Critical').length,
    lowCount: items.filter(i => i.status === 'Low').length,
    optimalCount: items.filter(i => i.status === 'Optimal').length,
    excessCount: items.filter(i => i.status === 'Excess').length,
  };

  const categoryPills = [
    { label: 'All', value: 'All' },
    { label: 'Fuel (JP-8)', value: 'Fuel' },
    { label: 'Field Rations', value: 'Rations' },
    { label: 'Trauma Kits', value: 'Medical' },
    { label: 'Potable Water', value: 'Water' },
    { label: 'Energy Cells', value: 'Batteries' },
    { label: 'Armored Spares', value: 'Spares' }
  ];

  return (
    <div className="space-y-6">
      {/* Banner */}
      <DataDisclaimerBanner 
        mode="prototype"
        customText="Operational Forward Stockpile Ledger. Inbound receipts and outbound issues directly recompute stock coverage days and append timestamped transactions to the custody journal."
      />

      {/* KPI Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        <StatCard
          title="Tracked Items"
          value={stats.totalStockSKUs}
          change="6 Strategic Depots"
          changeType="neutral"
          icon={Boxes}
          variant="cyan"
          subtitle="Showing active filter"
        />
        <StatCard
          title="Critical Shortage"
          value={stats.criticalCount}
          change="Under 4 Days Runway"
          changeType="critical"
          icon={AlertTriangle}
          variant="red"
          subtitle="Priority Resupply"
          onClick={() => setSelectedStatus(selectedStatus === 'Critical' ? 'All' : 'Critical')}
        />
        <StatCard
          title="Low Safety Buffer"
          value={stats.lowCount}
          change="At or Below Safety"
          changeType="decrease"
          icon={ShieldCheck}
          variant="amber"
          subtitle="Monitoring Burn"
          onClick={() => setSelectedStatus(selectedStatus === 'Low' ? 'All' : 'Low')}
        />
        <StatCard
          title="Optimal / Excess"
          value={stats.optimalCount + stats.excessCount}
          change="Stable Supply Line"
          changeType="increase"
          icon={Building}
          variant="emerald"
          subtitle="Coverage > 7 Days"
          onClick={() => setSelectedStatus(selectedStatus === 'Optimal' ? 'All' : 'Optimal')}
        />
      </div>

      {/* Filter and Search Cockpit */}
      <Card>
        <div className="space-y-4">
          {/* Top Bar: Search and Dropdowns */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Search bar with instant clear */}
            <form onSubmit={handleSearchSubmit} className="flex-1 max-w-md relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by SKU, commodity, or depot..."
                className="w-full bg-midnight-950 border border-midnight-700/80 rounded-lg pl-9 pr-16 py-2 text-xs font-mono text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  title="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </form>

            {/* Dropdown Filters */}
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
              {/* Location */}
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="bg-midnight-950 border border-midnight-700 rounded-lg px-2.5 py-2 text-slate-300 focus:outline-none focus:border-cyan-400"
              >
                <option value="All">All Depots</option>
                <option value="Sector-4 Forward Depot">Sector-4 Depot</option>
                <option value="Aurora Station Alpha">Aurora Station Alpha</option>
                <option value="Borealis Mountain Outpost">Borealis Outpost</option>
                <option value="Zenith Central Hub">Zenith Central Hub</option>
                <option value="Helios Coastal Base">Helios Base</option>
                <option value="Vanguard Perimeter Camp">Vanguard Camp</option>
              </select>

              {/* Status */}
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="bg-midnight-950 border border-midnight-700 rounded-lg px-2.5 py-2 text-slate-300 focus:outline-none focus:border-cyan-400"
              >
                <option value="All">All Statuses</option>
                <option value="Critical">Critical Shortage</option>
                <option value="Low">Low Stock</option>
                <option value="Optimal">Optimal</option>
                <option value="Excess">Excess Surplus</option>
              </select>

              {(search || selectedCategory !== 'All' || selectedLocation !== 'All' || selectedStatus !== 'All') && (
                <Button
                  variant="ghost"
                  size="sm"
                  icon={RotateCcw}
                  onClick={clearAllFilters}
                  className="text-xs text-slate-400 hover:text-white"
                >
                  Reset
                </Button>
              )}
            </div>
          </div>

          {/* Category Filter Pills Bar */}
          <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-midnight-800 text-xs font-mono">
            <span className="text-slate-400 text-[11px] mr-1 uppercase font-bold">Category:</span>
            {categoryPills.map(cat => (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className={`px-2.5 py-1 rounded-md transition-all ${
                  selectedCategory === cat.value
                    ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/50 shadow-[0_0_8px_rgba(0,240,255,0.2)]'
                    : 'bg-midnight-950/80 text-slate-400 hover:text-slate-200 border border-midnight-800'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Main Inventory Table */}
      <Card
        title="Forward Stockpile Records"
        subtitle={`${items.length} Tracked Commodities across active hubs`}
        icon={Boxes}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono border-collapse">
            <thead>
              <tr className="border-b border-midnight-700 bg-midnight-950/60 text-slate-400">
                <th className="py-3 px-3.5 font-bold uppercase tracking-wider">SKU & Item Name</th>
                <th className="py-3 px-3.5 font-bold uppercase tracking-wider">Depot Location</th>
                <th className="py-3 px-3.5 font-bold uppercase tracking-wider">Stock Level</th>
                <th className="py-3 px-3.5 font-bold uppercase tracking-wider">Daily Burn</th>
                <th className="py-3 px-3.5 font-bold uppercase tracking-wider">Runway / Coverage</th>
                <th className="py-3 px-3.5 font-bold uppercase tracking-wider">Condition</th>
                <th className="py-3 px-3.5 font-bold uppercase tracking-wider">Status</th>
                <th className="py-3 px-3.5 font-bold uppercase tracking-wider text-right">Quick Directives</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-midnight-800">
              {items.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-2 max-w-sm mx-auto">
                      <Boxes className="w-8 h-8 text-slate-600 mb-1" />
                      <p className="font-semibold text-slate-300 font-mono text-sm">No Stockpile Records Found</p>
                      <p className="text-xs text-slate-400 font-sans">No items matched the selected query in KARTAVYA forward stockpiles.</p>
                      <button 
                        onClick={clearAllFilters}
                        className="mt-2 text-xs font-mono text-cyan-400 hover:text-cyan-300 underline"
                      >
                        Reset All Filters
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                items.map((item) => {
                  const statusVariant = 
                    item.status === 'Critical' ? 'red' :
                    item.status === 'Low' ? 'amber' :
                    item.status === 'Excess' ? 'purple' : 'emerald';

                  return (
                    <tr 
                      key={item.id}
                      className="hover:bg-midnight-850/60 transition-colors group cursor-pointer"
                      onClick={() => openItemDetail(item)}
                    >
                      <td className="py-3.5 px-3.5">
                        <div className="font-bold text-white group-hover:text-cyan-400 transition-colors font-sans text-sm">
                          {item.name}
                        </div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                          <span className="text-cyan-400 font-mono font-bold">{item.sku}</span>
                          <span>•</span>
                          <span>{item.category}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-3.5 text-slate-300">
                        {item.location}
                      </td>

                      <td className="py-3.5 px-3.5">
                        <div className="font-bold text-white text-sm">
                          {item.currentStock.toLocaleString()} <span className="text-slate-400 text-xs font-normal">{item.unit}</span>
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          Safety: {item.safetyStock.toLocaleString()} {item.unit}
                        </div>
                      </td>

                      <td className="py-3.5 px-3.5 text-slate-300">
                        {item.avgDailyConsumption.toLocaleString()} {item.unit}/day
                      </td>

                      <td className="py-3.5 px-3.5">
                        <div className={`font-bold font-mono ${
                          item.stockCoverageDays < 4 ? 'text-rose-400' :
                          item.stockCoverageDays < 6 ? 'text-amber-400' : 'text-emerald-400'
                        }`}>
                          {item.stockCoverageDays} Days
                        </div>
                        <div className="w-24 bg-midnight-950 rounded-full h-1.5 mt-1 overflow-hidden border border-midnight-800">
                          <div 
                            className={`h-full rounded-full transition-all ${
                              item.stockCoverageDays < 4 ? 'bg-rose-500 shadow-[0_0_6px_#f43f5e]' :
                              item.stockCoverageDays < 6 ? 'bg-amber-400 shadow-[0_0_6px_#f59e0b]' : 'bg-emerald-400 shadow-[0_0_6px_#10b981]'
                            }`}
                            style={{ width: `${Math.min(100, (item.stockCoverageDays / 15) * 100)}%` }}
                          />
                        </div>
                      </td>

                      <td className="py-3.5 px-3.5 text-slate-300">
                        <span className="inline-flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                          {item.condition}
                        </span>
                      </td>

                      <td className="py-3.5 px-3.5">
                        <Badge variant={statusVariant} size="sm" dot={item.status === 'Critical'}>
                          {item.status}
                        </Badge>
                      </td>

                      <td className="py-3.5 px-3.5 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => openReceiptModal(item)}
                            className="px-2.5 py-1 rounded bg-midnight-800 hover:bg-emerald-950/80 text-emerald-400 border border-midnight-700 hover:border-emerald-500/50 transition-colors text-xs inline-flex items-center gap-1 font-semibold shadow-sm"
                            title="Record Inbound Receipt"
                          >
                            <ArrowDownLeft className="w-3.5 h-3.5" />
                            <span>Receipt</span>
                          </button>
                          <button
                            onClick={() => openIssueModal(item)}
                            className="px-2.5 py-1 rounded bg-midnight-800 hover:bg-rose-950/80 text-rose-300 border border-midnight-700 hover:border-rose-500/50 transition-colors text-xs inline-flex items-center gap-1 font-semibold shadow-sm"
                            title="Record Outbound Issue"
                          >
                            <ArrowUpRight className="w-3.5 h-3.5" />
                            <span>Issue</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Transaction History Feed */}
      <Card
        title="Recent Ledger Transactions"
        subtitle="Immutable local custody changes & receipts"
        icon={History}
      >
        <div className="space-y-2.5">
          {transactions.slice(0, 5).map(tx => (
            <div 
              key={tx.id}
              className="p-3 rounded-lg bg-midnight-850/50 border border-midnight-750 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs font-mono"
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${
                  tx.type === 'Receipt' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                }`}>
                  {tx.type === 'Receipt' ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm font-sans">{tx.itemName}</span>
                    <Badge variant={tx.type === 'Receipt' ? 'emerald' : 'red'} size="sm">
                      {tx.type}
                    </Badge>
                  </div>
                  <p className="text-slate-400 text-[11px] mt-0.5">
                    {tx.location} • Authorized: {tx.authorizedBy}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <div className={`font-bold text-sm ${tx.type === 'Receipt' ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {tx.type === 'Receipt' ? '+' : '-'}{tx.quantity.toLocaleString()} {tx.unit}
                </div>
                <div className="text-[10px] text-slate-500">
                  {new Date(tx.timestamp).toLocaleString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Item Detail Drawer */}
      <Drawer
        isOpen={isDetailDrawerOpen}
        onClose={() => setIsDetailDrawerOpen(false)}
        title={selectedItem?.name || 'Stockpile Record'}
        subtitle={`${selectedItem?.sku} • ${selectedItem?.location}`}
      >
        {selectedItem && (
          <div className="space-y-6 text-xs font-mono">
            {/* Quick action buttons in drawer */}
            <div className="flex items-center gap-2">
              <Button
                variant="primary"
                size="sm"
                className="flex-1"
                icon={ArrowDownLeft}
                onClick={() => { setIsDetailDrawerOpen(false); openReceiptModal(selectedItem); }}
              >
                Record Receipt
              </Button>
              <Button
                variant="danger"
                size="sm"
                className="flex-1"
                icon={ArrowUpRight}
                onClick={() => { setIsDetailDrawerOpen(false); openIssueModal(selectedItem); }}
              >
                Record Issue
              </Button>
            </div>

            {/* Metric Highlights */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-midnight-950 border border-midnight-800">
                <span className="text-slate-400 text-[10px] uppercase block">Current Stock</span>
                <span className="text-xl font-bold text-white">{selectedItem.currentStock.toLocaleString()} {selectedItem.unit}</span>
              </div>
              <div className="p-3 rounded-lg bg-midnight-950 border border-midnight-800">
                <span className="text-slate-400 text-[10px] uppercase block">Runway</span>
                <span className={`text-xl font-bold ${
                  selectedItem.stockCoverageDays < 4 ? 'text-rose-400' : 'text-emerald-400'
                }`}>{selectedItem.stockCoverageDays} Days</span>
              </div>
            </div>

            {/* Key Parameters */}
            <div className="p-3.5 rounded-lg bg-midnight-950 border border-midnight-800 space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400">Safety Threshold:</span>
                <span className="text-white font-bold">{selectedItem.safetyStock.toLocaleString()} {selectedItem.unit}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Reorder Threshold:</span>
                <span className="text-white">{selectedItem.reorderLevel.toLocaleString()} {selectedItem.unit}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Max Depot Capacity:</span>
                <span className="text-white">{selectedItem.maxCapacity.toLocaleString()} {selectedItem.unit}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Daily Consumption:</span>
                <span className="text-cyan-400">{selectedItem.avgDailyConsumption.toLocaleString()} {selectedItem.unit}/day</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Condition:</span>
                <span className="text-white">{selectedItem.condition}</span>
              </div>
            </div>

            {/* Notes */}
            <div className="p-3.5 rounded-lg bg-midnight-950/80 border border-midnight-800">
              <span className="text-slate-400 text-[10px] uppercase font-bold block mb-1">Operational Notes:</span>
              <p className="text-slate-300 font-sans text-xs leading-relaxed">{selectedItem.notes}</p>
            </div>

            {/* History of this item */}
            <div>
              <span className="text-slate-400 text-[11px] font-bold uppercase tracking-wider block mb-2">Item Custody History:</span>
              <div className="space-y-2">
                {transactions
                  .filter(t => t.itemId === selectedItem.id)
                  .map(tx => (
                    <div key={tx.id} className="p-2.5 rounded bg-midnight-950 border border-midnight-800 text-[11px]">
                      <div className="flex items-center justify-between">
                        <span className={`font-bold ${tx.type === 'Receipt' ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {tx.type} • {tx.quantity.toLocaleString()} {tx.unit}
                        </span>
                        <span className="text-slate-500">{new Date(tx.timestamp).toLocaleDateString()}</span>
                      </div>
                      <p className="text-slate-300 text-[10px] mt-1">{tx.reason}</p>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}
      </Drawer>

      {/* Record Stock Receipt Modal */}
      <Modal
        isOpen={isReceiptModalOpen}
        onClose={() => setIsReceiptModalOpen(false)}
        title="Record Stock Receipt"
        subtitle={`Inbound replenishment for ${activeItemForAction?.name}`}
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setIsReceiptModalOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="primary" 
              size="sm" 
              isLoading={isSubmitting}
              onClick={handleRecordReceipt}
              icon={ArrowDownLeft}
            >
              Confirm Receipt
            </Button>
          </>
        }
      >
        <form onSubmit={handleRecordReceipt} className="space-y-4 text-xs font-mono">
          <div className="p-2.5 rounded bg-midnight-950 border border-midnight-800 text-[11px] text-slate-300 flex justify-between">
            <span>Current Depot Stock:</span>
            <span className="font-bold text-white">{activeItemForAction?.currentStock.toLocaleString()} {activeItemForAction?.unit}</span>
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1">Receipt Quantity ({activeItemForAction?.unit}) *</label>
            <input
              type="number"
              step="any"
              min="1"
              required
              value={receiptForm.quantity}
              onChange={(e) => setReceiptForm({ ...receiptForm, quantity: e.target.value })}
              placeholder={`Enter quantity in ${activeItemForAction?.unit}...`}
              className="w-full bg-midnight-950 border border-midnight-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-400 text-sm"
            />
            {/* Quick Preset Buttons for testing */}
            <div className="flex items-center gap-1.5 mt-2">
              <span className="text-[10px] text-slate-400">Quick Fill:</span>
              {[500, 1000, 5000, 10000].map(amt => (
                <button
                  type="button"
                  key={amt}
                  onClick={() => setReceiptForm({ ...receiptForm, quantity: String(amt) })}
                  className="px-2 py-0.5 rounded bg-midnight-850 hover:bg-midnight-800 border border-midnight-700 text-[10px] text-cyan-300 transition-colors"
                >
                  +{amt.toLocaleString()}
                </button>
              ))}
            </div>
          </div>

          {/* Resulting Stock Preview */}
          {Number(receiptForm.quantity) > 0 && activeItemForAction && (
            <div className="p-2.5 rounded bg-emerald-950/20 border border-emerald-500/30 text-emerald-300 text-[11px] flex justify-between">
              <span>Projected Post-Receipt Stock:</span>
              <span className="font-bold">
                {(activeItemForAction.currentStock + Number(receiptForm.quantity)).toLocaleString()} {activeItemForAction.unit}
              </span>
            </div>
          )}

          <div>
            <label className="block text-slate-300 font-bold mb-1">Authorizing Officer / Lead *</label>
            <input
              type="text"
              required
              value={receiptForm.authorizedBy}
              onChange={(e) => setReceiptForm({ ...receiptForm, authorizedBy: e.target.value })}
              className="w-full bg-midnight-950 border border-midnight-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1">Storage Bay / Tank Designation</label>
            <input
              type="text"
              value={receiptForm.storageBay}
              onChange={(e) => setReceiptForm({ ...receiptForm, storageBay: e.target.value })}
              className="w-full bg-midnight-950 border border-midnight-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1">Receipt Reason / Waybill Ref *</label>
            <textarea
              rows="2"
              required
              value={receiptForm.reason}
              onChange={(e) => setReceiptForm({ ...receiptForm, reason: e.target.value })}
              className="w-full bg-midnight-950 border border-midnight-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
            />
          </div>
        </form>
      </Modal>

      {/* Record Stock Issue Modal */}
      <Modal
        isOpen={isIssueModalOpen}
        onClose={() => setIsIssueModalOpen(false)}
        title="Record Stock Issue"
        subtitle={`Outbound issue from ${activeItemForAction?.name}`}
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setIsIssueModalOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="danger" 
              size="sm" 
              isLoading={isSubmitting}
              onClick={handleRecordIssue}
              icon={ArrowUpRight}
            >
              Authorize Issue
            </Button>
          </>
        }
      >
        <form onSubmit={handleRecordIssue} className="space-y-4 text-xs font-mono">
          <div className="p-2.5 rounded bg-midnight-950 border border-midnight-800 text-[11px] text-slate-300 flex justify-between">
            <span>Available Depot Stock:</span>
            <span className="font-bold text-white">{activeItemForAction?.currentStock.toLocaleString()} {activeItemForAction?.unit}</span>
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1">Issue Quantity ({activeItemForAction?.unit}) *</label>
            <input
              type="number"
              step="any"
              min="1"
              max={activeItemForAction?.currentStock}
              required
              value={issueForm.quantity}
              onChange={(e) => setIssueForm({ ...issueForm, quantity: e.target.value })}
              placeholder={`Max ${activeItemForAction?.currentStock.toLocaleString()} ${activeItemForAction?.unit}...`}
              className="w-full bg-midnight-950 border border-midnight-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-400 text-sm"
            />
            {/* Quick Preset Buttons for testing */}
            <div className="flex items-center gap-1.5 mt-2">
              <span className="text-[10px] text-slate-400">Quick Fill:</span>
              {[250, 500, 1000, 2500].map(amt => (
                <button
                  type="button"
                  key={amt}
                  disabled={amt > (activeItemForAction?.currentStock || 0)}
                  onClick={() => setIssueForm({ ...issueForm, quantity: String(amt) })}
                  className="px-2 py-0.5 rounded bg-midnight-850 hover:bg-midnight-800 border border-midnight-700 text-[10px] text-rose-300 disabled:opacity-30 transition-colors"
                >
                  -{amt.toLocaleString()}
                </button>
              ))}
            </div>
          </div>

          {/* Resulting Stock Preview */}
          {Number(issueForm.quantity) > 0 && activeItemForAction && (
            <div className={`p-2.5 rounded border text-[11px] flex justify-between ${
              (activeItemForAction.currentStock - Number(issueForm.quantity)) < activeItemForAction.safetyStock
                ? 'bg-rose-950/20 border-rose-500/30 text-rose-300'
                : 'bg-midnight-950 border-midnight-800 text-slate-300'
            }`}>
              <span>Projected Post-Issue Stock:</span>
              <span className="font-bold">
                {Math.max(0, activeItemForAction.currentStock - Number(issueForm.quantity)).toLocaleString()} {activeItemForAction.unit}
                {(activeItemForAction.currentStock - Number(issueForm.quantity)) < activeItemForAction.safetyStock && (
                  <span className="text-rose-400 ml-1.5">(Below Safety Buffer)</span>
                )}
              </span>
            </div>
          )}

          <div>
            <label className="block text-slate-300 font-bold mb-1">Recipient Unit / Echelon *</label>
            <input
              type="text"
              required
              value={issueForm.recipient}
              onChange={(e) => setIssueForm({ ...issueForm, recipient: e.target.value })}
              className="w-full bg-midnight-950 border border-midnight-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1">Authorizing Commander *</label>
            <input
              type="text"
              required
              value={issueForm.authorizedBy}
              onChange={(e) => setIssueForm({ ...issueForm, authorizedBy: e.target.value })}
              className="w-full bg-midnight-950 border border-midnight-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1">Issue Mission Rationale *</label>
            <textarea
              rows="2"
              required
              value={issueForm.reason}
              onChange={(e) => setIssueForm({ ...issueForm, reason: e.target.value })}
              className="w-full bg-midnight-950 border border-midnight-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Inventory;
