import React, { useState, useMemo } from 'react';
import { Transaction, Contact, TransactionType, ContactType } from '../types';
import { Clock, ShoppingBag, X, Calendar, AlignLeft, Filter, ChevronDown, Check } from 'lucide-react';

interface HistoryProps {
  transactions: Transaction[];
  contacts: Contact[];
}

const History: React.FC<HistoryProps> = ({ transactions, contacts }) => {
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const [filterType, setFilterType] = useState<'ALL' | ContactType>('ALL');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  const getContact = (id: string) => contacts.find(c => c.id === id);
  const getContactName = (id: string) => getContact(id)?.name || 'Unknown';
  const getContactPhone = (id: string) => getContact(id)?.phone;

  // Filter transactions based on dropdown selection
  const filteredTransactions = useMemo(() => {
    if (filterType === 'ALL') return transactions;
    return transactions.filter(tx => {
        const contact = getContact(tx.contactId);
        return contact?.type === filterType;
    });
  }, [transactions, contacts, filterType]);

  // Group by date
  const groupedTransactions: Record<string, Transaction[]> = {};
  filteredTransactions.forEach(tx => {
    const dateKey = new Date(tx.date).toLocaleDateString(undefined, {
        weekday: 'short', 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric'
    });
    if (!groupedTransactions[dateKey]) groupedTransactions[dateKey] = [];
    groupedTransactions[dateKey].push(tx);
  });

  const getFilterLabel = (type: 'ALL' | ContactType) => {
      switch(type) {
          case 'ALL': return 'All History';
          case ContactType.CUSTOMER: return 'Customers Only';
          case ContactType.SUPPLIER: return 'Suppliers Only';
      }
  };

  return (
    <div className="pt-2 animate-fade-in space-y-6 pb-24">
        
        {/* Header Row with Filter */}
        <div className="flex items-center justify-between relative z-20">
            <h2 className="text-lg font-bold flex items-center gap-2">
                <Clock size={20} className="text-purple-400" />
                Recent Activity
            </h2>

            {/* Filter Dropdown */}
            <div className="relative">
                {/* Backdrop for click-outside */}
                {isFilterOpen && (
                    <div className="fixed inset-0 z-10" onClick={() => setIsFilterOpen(false)}></div>
                )}
                
                <button
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium border transition-all relative z-20 ${
                        isFilterOpen 
                        ? 'bg-white/10 border-purple-500/50 text-white shadow-[0_0_15px_rgba(168,85,247,0.3)]' 
                        : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:text-white'
                    }`}
                >
                    <Filter size={14} />
                    <span>{filterType === 'ALL' ? 'Filter' : (filterType === ContactType.CUSTOMER ? 'Customers' : 'Suppliers')}</span>
                    <ChevronDown size={12} className={`transition-transform duration-300 ${isFilterOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                <div className={`absolute right-0 top-full mt-2 w-48 bg-[#1e0b36]/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl overflow-hidden z-30 transition-all duration-200 origin-top-right ${isFilterOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'}`}>
                    <div className="p-1 space-y-1">
                        {[
                            { value: 'ALL', label: 'All History' },
                            { value: ContactType.CUSTOMER, label: 'Customers Only' },
                            { value: ContactType.SUPPLIER, label: 'Suppliers Only' }
                        ].map((option) => (
                            <button
                                key={option.value}
                                onClick={() => {
                                    setFilterType(option.value as any);
                                    setIsFilterOpen(false);
                                }}
                                className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-medium transition-all flex items-center justify-between ${filterType === option.value ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/40' : 'text-white/70 hover:bg-white/10 hover:text-white'}`}
                            >
                                <span>{option.label}</span>
                                {filterType === option.value && <Check size={12} className="animate-fade-in" />}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>

        {/* Filter Status Indicator */}
        {filterType !== 'ALL' && (
            <div className="flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-lg animate-fade-in">
                <div className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse"></div>
                <p className="text-xs text-purple-200">
                    Showing <span className="font-bold text-white">{filteredTransactions.length}</span> transactions for {filterType === ContactType.CUSTOMER ? 'Customers' : 'Suppliers'}
                </p>
                <button 
                    onClick={() => setFilterType('ALL')}
                    className="ml-auto p-1 hover:bg-white/10 rounded-full transition-colors"
                >
                    <X size={12} className="text-white/50" />
                </button>
            </div>
        )}

        {Object.keys(groupedTransactions).length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 opacity-50 space-y-4 animate-fade-in">
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center">
                    <Clock size={32} className="text-white/30" />
                </div>
                <div className="text-center">
                    <p className="text-white font-medium">No history available</p>
                    <p className="text-xs text-white/50 mt-1">Try changing the filter or adding transactions</p>
                </div>
            </div>
        ) : (
            Object.keys(groupedTransactions).map((date, index) => (
                <div key={date} className="space-y-2 animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                    <h3 className="text-xs text-purple-300/50 uppercase font-semibold pl-2 sticky top-0 bg-[#1a0b2e]/95 backdrop-blur-sm py-2 z-10 border-b border-white/5">{date}</h3>
                    <div className="bg-white/5 border border-white/5 rounded-2xl overflow-hidden">
                        {groupedTransactions[date].map((tx, idx) => (
                            <div 
                                key={tx.id} 
                                onClick={() => setSelectedTx(tx)}
                                className={`p-4 flex justify-between items-center cursor-pointer hover:bg-white/10 active:bg-white/20 transition-colors ${idx !== groupedTransactions[date].length - 1 ? 'border-b border-white/5' : ''}`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${tx.type === TransactionType.CREDIT_GIVEN ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]' : 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]'}`}></div>
                                    <div>
                                        <p className="font-medium text-white">{getContactName(tx.contactId)}</p>
                                        <div className="flex flex-col">
                                            <p className="text-xs text-white/40 truncate max-w-[150px]">{tx.description || (tx.type === TransactionType.CREDIT_GIVEN ? 'Credit Given' : 'Payment Received')}</p>
                                            {tx.items && tx.items.length > 0 && (
                                                <span className="flex items-center gap-1 text-[10px] text-purple-300/80 mt-0.5">
                                                    <ShoppingBag size={8} /> {tx.items.length} items
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className={`font-bold font-mono whitespace-nowrap ${tx.type === TransactionType.CREDIT_GIVEN ? 'text-red-400' : 'text-green-400'}`}>
                                    {tx.type === TransactionType.CREDIT_GIVEN ? '-' : '+'} <span className="text-xs">Rs.</span> {tx.amount.toLocaleString()}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))
        )}

        {/* Transaction Detail Modal */}
        {selectedTx && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedTx(null)}></div>
                
                <div className="bg-[#1e1035] border border-white/20 w-full max-w-sm rounded-3xl overflow-hidden relative z-10 shadow-2xl animate-fade-in-up">
                    {/* Header */}
                    <div className={`p-6 ${selectedTx.type === TransactionType.CREDIT_GIVEN ? 'bg-gradient-to-r from-red-900/40 to-red-800/20' : 'bg-gradient-to-r from-green-900/40 to-green-800/20'} border-b border-white/10`}>
                         <div className="flex justify-between items-start mb-4">
                            <h3 className="text-lg font-bold text-white">Transaction Details</h3>
                            <button onClick={() => setSelectedTx(null)} className="p-1 hover:bg-white/10 rounded-full transition-colors">
                                <X size={20} className="text-white/70" />
                            </button>
                         </div>
                         
                         <div className="text-center py-2">
                             <p className="text-sm text-white/50 uppercase tracking-widest mb-1">Amount</p>
                             <h2 className={`text-4xl font-bold ${selectedTx.type === TransactionType.CREDIT_GIVEN ? 'text-red-400' : 'text-green-400'}`}>
                                Rs. {selectedTx.amount.toLocaleString()}
                             </h2>
                             <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium mt-2 border ${
                                 selectedTx.type === TransactionType.CREDIT_GIVEN 
                                    ? 'bg-red-500/20 border-red-500/30 text-red-200' 
                                    : 'bg-green-500/20 border-green-500/30 text-green-200'
                             }`}>
                                {selectedTx.type === TransactionType.CREDIT_GIVEN ? 'You Gave Credit' : 'Payment Received'}
                             </div>
                         </div>
                    </div>

                    {/* Body */}
                    <div className="p-6 space-y-5">
                        
                        {/* Contact Info */}
                        <div className="flex items-center gap-4 p-3 bg-white/5 rounded-xl border border-white/5">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500 flex items-center justify-center font-bold text-white">
                                {getContactName(selectedTx.contactId).charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <p className="text-xs text-white/40 uppercase">Contact</p>
                                <p className="font-semibold text-white">{getContactName(selectedTx.contactId)}</p>
                                {getContactPhone(selectedTx.contactId) && (
                                    <p className="text-xs text-white/50">{getContactPhone(selectedTx.contactId)}</p>
                                )}
                            </div>
                        </div>

                        {/* Date */}
                        <div className="flex gap-3">
                             <div className="w-10 flex flex-col items-center pt-1">
                                <Calendar size={20} className="text-purple-300/50" />
                             </div>
                             <div>
                                 <p className="text-xs text-purple-300 uppercase font-semibold">Date</p>
                                 <p className="text-white/80">
                                     {new Date(selectedTx.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                 </p>
                                 <p className="text-xs text-white/40 mt-0.5">
                                     Created: {selectedTx.createdAt ? new Date(selectedTx.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'N/A'}
                                 </p>
                             </div>
                        </div>

                        {/* Description */}
                        <div className="flex gap-3">
                             <div className="w-10 flex flex-col items-center pt-1">
                                <AlignLeft size={20} className="text-purple-300/50" />
                             </div>
                             <div>
                                 <p className="text-xs text-purple-300 uppercase font-semibold">Description</p>
                                 <p className="text-white/80 italic">
                                     "{selectedTx.description || 'No description provided'}"
                                 </p>
                             </div>
                        </div>

                        {/* Items */}
                        {selectedTx.items && selectedTx.items.length > 0 && (
                            <div className="flex gap-3">
                                <div className="w-10 flex flex-col items-center pt-1">
                                   <ShoppingBag size={20} className="text-purple-300/50" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs text-purple-300 uppercase font-semibold mb-2">Items</p>
                                    <div className="space-y-2">
                                        {selectedTx.items.map((item, i) => (
                                            <div key={i} className="flex justify-between items-center bg-white/5 px-3 py-2 rounded-lg border border-white/5 text-sm">
                                                <span>{item.name}</span>
                                                <span className="text-white/40 text-xs">x{item.quantity}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                        
                        {/* Transaction ID */}
                        <div className="pt-4 mt-4 border-t border-white/5 text-center">
                            <p className="text-[10px] text-white/20 font-mono">ID: {selectedTx.id}</p>
                        </div>

                    </div>
                </div>
            </div>
        )}
    </div>
  );
};

export default History;