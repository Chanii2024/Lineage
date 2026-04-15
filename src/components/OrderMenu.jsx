import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Search, Plus, Calendar, Clock, X, Check } from 'lucide-react';
import gsap from 'gsap';

const OrderMenu = ({ meals, addOrder, isAccessible = false }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');
    const [selectedMeal, setSelectedMeal] = useState(null);
    const [orderTime, setOrderTime] = useState({ day: 'Today', slot: 'Dinner' });
    const gridRef = useRef(null);

    const categories = ['All', 'Main', 'Drink', 'Add-on'];

    const filteredMeals = useMemo(() => {
        return meals.filter(meal => {
            const matchesSearch = meal.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                meal.ingredients?.some(ing => ing.toLowerCase().includes(searchQuery.toLowerCase()));
            const matchesCat = activeCategory === 'All' || meal.type === activeCategory;
            return matchesSearch && matchesCat;
        });
    }, [meals, searchQuery, activeCategory]);

    useEffect(() => {
        if (gridRef.current) {
            gsap.fromTo(gridRef.current.children,
                { opacity: 0, y: 30 },
                { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: "power3.out" }
            );
        }
    }, [filteredMeals]);

    const handleHandoff = (meal) => {
        setSelectedMeal(meal);
    };


    const confirmOrder = async () => {
        if (!selectedMeal) return;

        const orderData = {
            mealId: selectedMeal.id,
            mealName: selectedMeal.name,
            day: orderTime.day,
            slot: orderTime.slot,
            scheduledAt: Date.now(),
            type: selectedMeal.type
        };

        try {
            await addOrder(orderData);

            // GSAP Flight Animation
            const flyer = document.createElement('div');
            flyer.className = 'fixed w-16 h-16 bg-accent rounded-full z-[150] flex items-center justify-center pointer-events-none';
            flyer.innerHTML = '<div class="text-white text-[10px] font-black uppercase tracking-widest">SENT</div>';
            document.body.appendChild(flyer);

            gsap.fromTo(flyer,
                { x: window.innerWidth / 2 - 32, y: window.innerHeight / 2 - 32, scale: 0, opacity: 1 },
                {
                    x: window.innerWidth - 100,
                    y: 100,
                    scale: 1,
                    opacity: 0,
                    duration: 1,
                    ease: "expo.inOut",
                    onComplete: () => flyer.remove()
                }
            );

            setSelectedMeal(null);
        } catch (err) {
            console.error("Order failed:", err);
            // Error is handled via structured error in useLineage/App
        }
    };


    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Search & Filter Header */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative w-full md:max-w-md group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-main/30 group-focus-within:text-accent transition-colors" size={20} />
                    <input
                        type="text"
                        placeholder="Search Intelligence Records..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:border-accent/50 transition-all font-sans text-lg italic"
                    />
                </div>

                <div className="flex gap-2 p-1 bg-white/5 rounded-2xl border border-white/5 overflow-x-auto no-scrollbar whitespace-nowrap">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-6 py-2 rounded-xl text-sm font-sans tracking-widest uppercase transition-all ${activeCategory === cat ? (isAccessible ? 'bg-white text-black' : 'bg-accent text-white shadow-lg') : 'text-text-main/40 hover:bg-white/5'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

            </div>

            {/* Menu Grid */}
            <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMeals.map(meal => (
                    <article
                        key={meal.id}
                        className="glass p-6 rounded-[2rem] flex flex-col gap-4 group hover:shadow-2xl transition-all duration-500 border-white/5 relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                        <div className="flex justify-between items-start relative z-10">
                            <div className="space-y-1">
                                <span className="text-[10px] font-sans tracking-[0.2em] text-accent/60 uppercase">{meal.type}</span>
                                <h3 className="text-xl font-serif">{meal.name}</h3>
                            </div>
                            <button
                                onClick={() => handleHandoff(meal)}
                                className="p-3 bg-accent text-white rounded-full hover:scale-110 active:scale-95 transition-all shadow-lg shadow-accent/20"
                            >

                                <Plus size={20} />
                            </button>
                        </div>

                        <p className="text-sm text-text-main/50 font-sans italic line-clamp-2 leading-relaxed">
                            {meal.description}
                        </p>

                        <div className="pt-4 border-t border-white/5 flex flex-wrap gap-2 text-[11px] font-sans uppercase tracking-tighter text-text-main/30">
                            {meal.ingredients?.slice(0, 3).join(" • ")}
                        </div>
                    </article>
                ))}
            </div>

            {/* Scheduling Modal */}
            {selectedMeal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm">
                    <div className="glass-dark w-full max-w-md p-8 rounded-[3rem] border-white/10 shadow-2xl relative animate-in zoom-in duration-300">
                        <button
                            onClick={() => setSelectedMeal(null)}
                            className="absolute right-6 top-6 text-white/20 hover:text-white transition-colors"
                        >
                            <X size={24} />
                        </button>

                        <div className="space-y-8">
                            <div className="text-center space-y-2">
                                <span className="text-accent tracking-[0.3em] font-sans text-xs uppercase">Integrity Handoff</span>
                                <h2 className="text-3xl text-white">Schedule {selectedMeal.name}</h2>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-4">
                                    <label className="text-[10px] uppercase tracking-widest text-white/40 ml-2">Phase</label>
                                    {['Today', 'Tomorrow'].map(day => (
                                        <button
                                            key={day}
                                            onClick={() => setOrderTime(prev => ({ ...prev, day }))}
                                            className={`w-full py-4 rounded-2xl flex items-center justify-center gap-3 border transition-all ${orderTime.day === day
                                                ? 'bg-accent/20 border-accent text-accent'
                                                : 'bg-white/5 border-white/5 text-white/60 hover:bg-white/10'
                                                }`}
                                        >
                                            <Calendar size={18} />
                                            {day}
                                        </button>
                                    ))}
                                </div>
                                <div className="space-y-4">
                                    <label className="text-[10px] uppercase tracking-widest text-white/40 ml-2">Slot</label>
                                    {['Breakfast', 'Lunch', 'Dinner'].map(slot => (
                                        <button
                                            key={slot}
                                            onClick={() => setOrderTime(prev => ({ ...prev, slot }))}
                                            className={`w-full py-3 rounded-2xl flex items-center justify-center gap-3 border transition-all ${orderTime.slot === slot
                                                ? 'bg-[#EBB3B2]/20 border-[#EBB3B2] text-[#EBB3B2]'
                                                : 'bg-white/5 border-white/5 text-white/60 hover:bg-white/10'
                                                }`}
                                        >
                                            <Clock size={16} />
                                            {slot}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <button
                                onClick={confirmOrder}
                                className="w-full py-5 bg-accent text-white rounded-[2rem] font-sans text-lg tracking-[0.1em] uppercase shadow-2xl shadow-accent/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
                            >
                                <Check size={20} />
                                Add to Lineage
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderMenu;
