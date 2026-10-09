import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Boxes, 
  Search, 
  Filter, 
  Plus, 
  ArrowDownLeft, 
  ArrowUpRight, 
  History, 
  AlertTriangle, 
  Layers, 
  CheckCircle2, 
  RotateCcw,
  SlidersHorizontal,
  ChevronRight,
  Info
} from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import Modal from '../components/common/Modal';
import Drawer from '../components/common/Drawer';
import DataDisclaimerBanner from '../components/common/DataDisclaimerBanner';
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

  useEffect(() => {
    loadInventory();
  }, [selectedCategory, selectedLocation, selectedStatus]);

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

  const handleSearch = (e) => {
    e.preventDefault();
    loadInventory();
  };

  const openItemDetail = (item) => {
    setSelectedItem(item);
    setIsDetailDrawerOpen(true);
  };

  const openReceiptModal = (item) => {
    setActiveItemForAction(item);
    setReceiptForm({ quantity: '', authorizedBy: 'Lt. Cdr. Vance', reason: 'Inbound resupply transfer', storageBay: 'Main Depot Bay 1' });
    setIsReceiptModalOpen(true);
  };

  const openIssueModal = (item) => {
    setActiveItemForAction(item);
    setIssueForm({ quantity: '', authorizedBy: 'Lt. Cdr. Vance', recipient: '1st Mechanized Division', reason: 'Field patrol resupply' });
    setIsIssueModalOpen(true);
  };

  const handleRecordReceipt = async (e) => {
    e.preventDefault();
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
    e.preventDefault();
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

  const handleReset = () => {
    if (window.confirm('Reset inventory dataset to default prototype baseline?')) {
      inventoryService.resetDefaults();
      loadInventory();
      info('Reset Baseline', 'Inventory restored to initial demonstration values.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <DataDisclaimerBanner 
        mode="prototype"
        customText="Operational Stockpile Ledger. Real-time client-side transactions update immediately and stage to local persistence."
      />

      {/* Header Controls & Filter Strip */}
      <Card>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Search bar */}
          <form onSubmit={handleSearch} className="flex-1 max-w-md relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by SKU, commodity, or depot..."
              className="w-full bg-midnight-950 border border-midnight-700/80 rounded-lg pl-9 pr-24 py-2 text-xs font-mono text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50"
            />
            <Button 
              type="submit" 
              size="sm" 
              variant="outline" 
              className="absolute right-1.5 top-1/2 -translate-y-1/2 h-7 px-2.5 text-xs"
            >
              Filter
            </Button>
          </form>

          {/* Dropdown Filters */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
            {/* Category */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-midnight-950 border border-midnight-700 rounded-lg px-2.5 py-2 text-slate-300 focus:outline-none focus:border-cyan-400"
            >
              <option value="All">All Categories</option>
              <option value="Fuel">Fuel (JP-8 Synthetic)</option>
              <option value="Rations">Field Rations (MRE-X)</option>
              <option value="Medical">Trauma Medical Kits</option>
              <option value="Water">Potable Water</option>
              <option value="Batteries">Energy Cells</option>
              <option value="Spares">Armored Spares</option>
            </select>

            {/* Location */}
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="bg-midnight-950 border border-midnight-700 rounded-lg px-2.5 py-2 text-slate-300 focus:outline-none focus:border-cyan-400"
            >
              <option value="All">All Locations</option>
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
              <option value="Low">Low Buffer</option>
              <option value="Optimal">Optimal Runway</option>
              <option value="Excess">Excess Stock</option>
            </select>

            <Button
              variant="secondary"
              size="sm"
              icon={RotateCcw}
              onClick={handleReset}
              title="Reset inventory to original demonstration values"
            >
              Reset Baseline
            </Button>
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
                <th className="py-3 px-3.5 font-bold uppercase tracking-wider">Location</th>
                <th className="py-3 px-3.5 font-bold uppercase tracking-wider">Stock Level</th>
                <th className="py-3 px-3.5 font-bold uppercase tracking-wider">Daily Burn</th>
                <th className="py-3 px-3.5 font-bold uppercase tracking-wider">Runway / Coverage</th>
                <th className="py-3 px-3.5 font-bold uppercase tracking-wider">Condition</th>
                <th className="py-3 px-3.5 font-bold uppercase tracking-wider">Status</th>
                <th className="py-3 px-3.5 font-bold uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-midnight-800">
              {items.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-12 text-center text-slate-400">
                    No inventory items matched the selected filter criteria.
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
                        <div className="w-20 bg-midnight-950 rounded-full h-1 mt-1 overflow-hidden">
                          <div 
                            className={`h-full ${
                              item.stockCoverageDays < 4 ? 'bg-rose-500' :
                              item.stockCoverageDays < 6 ? 'bg-amber-400' : 'bg-emerald-400'
                            }`}
                            style={{ width: `${Math.min(100, (item.stockCoverageDays / 15) * 100)}%` }}
                          />
                        </div>
                      </td>

                      <td className="py-3.5 px-3.5 text-slate-300">
                        <span className="inline-flex items-center gap-1">
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
                            className="px-2 py-1 rounded bg-midnight-800 hover:bg-emerald-950 text-emerald-400 border border-midnight-700 hover:border-emerald-500/50 transition-colors text-[11px] inline-flex items-center gap-1 font-semibold"
                            title="Record Inbound Receipt"
                          >
                            <ArrowDownLeft className="w-3.5 h-3.5" />
                            <span>Receipt</span>
                          </button>
                          <button
                            onClick={() => openIssueModal(item)}
                            className="px-2 py-1 rounded bg-midnight-800 hover:bg-rose-950 text-rose-300 border border-midnight-700 hover:border-rose-500/50 transition-colors text-[11px] inline-flex items-center gap-1 font-semibold"
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
              <div className="flex items-start gap-3">
                <div className={`p-1.5 rounded border mt-0.5 ${
                  tx.type === 'Receipt' 
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
                    : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                }`}>
                  {tx.type === 'Receipt' ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">{tx.itemName}</span>
                    <Badge variant={tx.type === 'Receipt' ? 'emerald' : 'red'} size="sm">
                      {tx.type === 'Receipt' ? `+${tx.quantity.toLocaleString()} ${tx.unit}` : `-${tx.quantity.toLocaleString()} ${tx.unit}`}
                    </Badge>
                  </div>
                  <p className="text-slate-400 text-[11px] mt-0.5">
                    {tx.reason} • Authorized: {tx.authorizedBy}
                  </p>
                </div>
              </div>

              <div className="text-right text-[11px] text-slate-400 shrink-0">
                <div>{tx.location}</div>
                <div>{new Date(tx.timestamp).toLocaleString()}</div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Item Detail Drawer */}
      <Drawer
        isOpen={isDetailDrawerOpen}
        onClose={() => setIsDetailDrawerOpen(false)}
        title={selectedItem?.name}
        subtitle={`${selectedItem?.sku} • ${selectedItem?.location}`}
        badge={selectedItem && (
          <Badge 
            variant={selectedItem.status === 'Critical' ? 'red' : selectedItem.status === 'Low' ? 'amber' : 'emerald'}
            size="sm"
          >
            {selectedItem.status}
          </Badge>
        )}
        footer={
          selectedItem && (
            <div className="flex items-center gap-2 w-full">
              <Button
                variant="primary"
                size="sm"
                className="flex-1"
                icon={ArrowDownLeft}
                onClick={() => {
                  setIsDetailDrawerOpen(false);
                  openReceiptModal(selectedItem);
                }}
              >
                Record Receipt
              </Button>
              <Button
                variant="danger"
                size="sm"
                className="flex-1"
                icon={ArrowUpRight}
                onClick={() => {
                  setIsDetailDrawerOpen(false);
                  openIssueModal(selectedItem);
                }}
              >
                Record Issue
              </Button>
            </div>
          )
        }
      >
        {selectedItem && (
          <div className="space-y-5 text-xs font-mono">
            {/* Stock Level Card */}
            <div className="p-4 rounded-lg bg-midnight-950 border border-midnight-700">
              <span className="text-slate-400 uppercase text-[10px] font-bold">Current Depot Stock</span>
              <div className="text-2xl font-bold text-white mt-1">
                {selectedItem.currentStock.toLocaleString()} {selectedItem.unit}
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2 text-slate-300 text-[11px] pt-2 border-t border-midnight-800">
                <div>Safety Stock: <span className="text-white font-bold">{selectedItem.safetyStock.toLocaleString()} {selectedItem.unit}</span></div>
                <div>Reorder Point: <span className="text-white font-bold">{selectedItem.reorderLevel.toLocaleString()} {selectedItem.unit}</span></div>
                <div>Avg Daily Burn: <span className="text-white font-bold">{selectedItem.avgDailyConsumption.toLocaleString()} {selectedItem.unit}</span></div>
                <div>Coverage Runway: <span className="text-cyan-400 font-bold">{selectedItem.stockCoverageDays} Days</span></div>
              </div>
            </div>

            {/* Condition & Notes */}
            <div className="p-4 rounded-lg bg-midnight-850 border border-midnight-750 space-y-2">
              <div className="text-[10px] uppercase font-bold text-slate-400">Depot Telemetry Notes</div>
              <p className="text-slate-200 font-sans text-xs leading-relaxed">
                {selectedItem.notes}
              </p>
              <div className="pt-2 text-[11px] text-slate-400 flex items-center justify-between">
                <span>Condition: <span className="text-emerald-400">{selectedItem.condition}</span></span>
                <span>Max Capacity: {selectedItem.maxCapacity.toLocaleString()} {selectedItem.unit}</span>
              </div>
            </div>

            {/* Item Transaction History */}
            <div>
              <div className="text-[11px] uppercase font-bold text-slate-400 mb-2">Item Custody Trail</div>
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
          </div>

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
          </div>

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
            <label className="block text-slate-300 font-bold mb-1">Authorizing Officer *</label>
            <input
              type="text"
              required
              value={issueForm.authorizedBy}
              onChange={(e) => setIssueForm({ ...issueForm, authorizedBy: e.target.value })}
              className="w-full bg-midnight-950 border border-midnight-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1">Mission Rationale / Operational Purpose *</label>
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
