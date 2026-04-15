import React, { useState, useEffect, useRef } from 'react';
import { Clock, Calendar, X, ChevronDown, ChevronUp, ShoppingBag } from 'lucide-react';
import gsap from 'gsap';

const OrderSidebar = ({ orders = [], removeOrder, isAccessible = false }) => {
    const [isOpen, setIsOpen] = useState(false);
    const drawerRef = useRef(null);
    const contentRef = useRef(null);

    useEffect(() => {
        if (isOpen) {
            gsap.to(contentRef.current, { height: 'auto', opacity: 1, duration: 0.6, ease: "expo.out" });
        } else {
            gsap.to(contentRef.current, { height: 0, opacity: 0, duration: 0.4, ease: "power2.inOut" });
        }
    }, [isOpen]);

    return (
        <div
            ref={drawerRef}
            className="fixed top-0 left-0 right-0 z-[120] flex flex-col items-center pointer-events-none"
        >
            {/* Minimal Trigger Icon (Visible when closed) */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="mt-4 pointer-events-auto p-3 bg-[#1E1E1E] border border-white/10 rounded-full shadow-2xl hover:bg-accent/20 hover:border-accent/40 transition-all group relative active:scale-95"
                >
                    <ShoppingBag size={18} className="text-accent group-hover:scale-110 transition-transform" />
                    {orders.length > 0 && (
                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent text-[#1E1E1E] text-[10px] font-black rounded-full flex items-center justify-center shadow-[0_0_10px_#8BA888] animate-pulse">
                            {orders.length}
                        </span>
                    )}
                </button>
            )}

            {/* Main Drawer Glass (Fully hidden when closed) */}
            <div className={`w-full max-w-4xl bg-[#1E1E1E]/95 backdrop-blur-2xl border-x border-b border-white/10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] pointer-events-auto transition-all duration-700 overflow-hidden ${isOpen ? 'translate-y-0 opacity-100 rounded-b-[2.5rem]' : '-translate-y-full opacity-0 pointer-events-none'
                }`}>

                {/* Collapsible Content */}
                <div ref={contentRef} className="px-8 py-10 overflow-hidden">
                    <div className="flex justify-between items-start mb-8">
                        <div className="space-y-1">
                            <span className="text-[10px] font-sans tracking-[0.4em] text-accent font-black uppercase">Vanguard Schedule</span>
                            <h2 className="text-4xl font-serif text-white italic">Protocol Requests</h2>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="p-3 rounded-full bg-white/5 hover:bg-accent/20 hover:text-accent text-white/40 transition-all"
                        >
                            <ChevronUp size={20} />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-6">
                        {orders.length === 0 ? (
                            <div className="col-span-full py-12 text-center opacity-30 italic font-serif text-white/50 text-xl">
                                The queue is currently silent.
                            </div>
                        ) : (
                            orders.map(order => (
                                <div
                                    key={order.id}
                                    className="p-5 rounded-2xl bg-white/5 border border-white/5 group relative hover:bg-white/10 transition-all hover:-translate-y-1"
                                >
                                    <button
                                        onClick={() => removeOrder(order.id)}
                                        className="absolute top-3 right-3 p-1 text-white/20 hover:text-rose transition-colors opacity-0 group-hover:opacity-100"
                                    >
                                        <X size={14} />
                                    </button>
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className={`w-2 h-2 rounded-full ${order.day === 'Today' ? 'bg-accent shadow-[0_0_12px_rgba(139,168,136,0.6)]' : 'bg-white/20'}`} />
                                        <span className="text-[10px] font-sans tracking-widest text-white/40 uppercase font-bold">
                                            {order.day} • {order.slot}
                                        </span>
                                    </div>
                                    <h3 className="text-lg font-serif text-white leading-tight">{order.mealName}</h3>
                                </div>
                            ))
                        )}
                    </div>

                    <button
                        onClick={() => setIsOpen(false)}
                        className="w-full py-3 flex items-center justify-center gap-2 text-[10px] uppercase tracking-[0.3em] font-black text-white/40 hover:text-white transition-colors border-t border-white/5"
                    >
                        <span>Minimize Records</span>
                        <ChevronUp size={12} />
                    </button>
                </div>
            </div>

            {/* Subtle Overlay when open */}
            {isOpen && (
                <div
                    onClick={() => setIsOpen(false)}
                    className="fixed inset-0 bg-black/40 backdrop-blur-[4px] -z-10 pointer-events-auto animate-in fade-in duration-500"
                />
            )}
        </div>
    );
};

export default OrderSidebar;
