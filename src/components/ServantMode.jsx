import React, { useState, useEffect, useRef } from 'react';
import { CheckCircle2, Circle, Clock, ChefHat, ClipboardList, Mic, MicOff } from 'lucide-react';
import gsap from 'gsap';

const PrepSection = ({ title, items, icon: Icon, isAccessible, checkedItems, toggleItem }) => {
    return (
        <section className={`space-y-8 ${isAccessible ? 'accessible-mode' : ''}`}>
            <div className="flex items-center space-x-4 border-b border-text-main/5 pb-6">
                <div className="bg-accent/10 p-3 rounded-2xl">
                    <Icon className="text-accent w-6 h-6" />
                </div>
                <h3 className="text-3xl font-serif italic text-text-main">{title}</h3>
            </div>

            <div className="space-y-6">
                {items.map(meal => (
                    <div
                        key={meal.id}
                        className={`p-10 rounded-[2rem] transition-all duration-500 ${isAccessible ? 'bg-[#1F1F1F] shadow-2xl border border-white/5' : 'glass bg-white/10 border-white/10'
                            } ${checkedItems[meal.id] ? 'opacity-30 scale-[0.98]' : ''}`}
                    >
                        <div className="flex justify-between items-start gap-8">
                            <div className="space-y-6 flex-grow">
                                <div className="flex items-center space-x-4">
                                    <span className={`${isAccessible
                                        ? 'bg-[#06C167] text-white text-[11px] uppercase tracking-[0.4em] font-black px-4 py-1.5 rounded-lg'
                                        : 'bg-accent/10 text-accent text-[10px] uppercase tracking-[0.4em] font-black px-4 py-1.5 rounded-lg'}`}>
                                        Schedule {meal.priority}
                                    </span>
                                </div>
                                <h4 className={`${isAccessible ? 'text-5xl font-sans font-bold text-white' : 'text-4xl font-serif italic text-text-main'}`}>{meal.name}</h4>

                                <div className="space-y-3 pt-6 border-t border-white/10">
                                    <p className={`${isAccessible ? 'text-[12px] font-bold text-[#06C167]' : 'text-[10px] text-text-main/40 font-bold'} uppercase tracking-widest mb-4`}>Ingredients</p>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {meal.ingredients.map((ing, idx) => {
                                            const itemId = `${meal.id}-${idx}`;
                                            const isChecked = checkedItems[itemId];
                                            return (
                                                <button
                                                    key={idx}
                                                    onClick={() => toggleItem(itemId)}
                                                    className={`flex items-center space-x-4 p-4 rounded-xl transition-all text-left group ${isChecked ? 'checked' : ''} ${isAccessible
                                                        ? 'bg-[#2A2A2A] border border-white/5 hover:bg-[#333]'
                                                        : 'bg-white/20 border border-white/30 hover:bg-white/40'
                                                        }`}
                                                >
                                                    {isChecked ? (
                                                        <CheckCircle2 className="w-5 h-5 text-[#06C167] shrink-0" />
                                                    ) : (
                                                        <Circle className={`w-5 h-5 shrink-0 ${isAccessible ? 'text-white/20' : 'text-text-main/20'} group-hover:text-[#06C167]`} />
                                                    )}
                                                    <span className={`text-sm font-sans ${isChecked ? 'line-through text-white/20' : 'text-white'}`}>
                                                        {ing}
                                                    </span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => toggleItem(meal.id)}
                                className={`shrink-0 p-5 rounded-2xl transition-all ${checkedItems[meal.id] ? 'checked bg-[#06C167] text-white shadow-lg' : 'bg-white/5 text-white/20 hover:text-[#06C167]'
                                    }`}
                            >
                                {checkedItems[meal.id] ? <CheckCircle2 className="w-10 h-10" /> : <ChefHat className="w-10 h-10" />}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

const ServantMode = ({ meals, orders = [], isAccessible = false }) => {
    const todayOrders = orders.filter(o => o.day === 'Today');
    const tomorrowOrders = orders.filter(o => o.day === 'Tomorrow');

    const getOrderDetails = (orderList) => {
        return orderList.map(order => {
            const meal = meals.find(m => m.id === order.mealId) || {};
            return {
                ...meal,
                id: order.id,
                name: `${order.mealName} (${order.slot})`,
                isOrder: true
            };
        });
    };

    const activeOrderItems = getOrderDetails(todayOrders);
    const vanguardOrderItems = getOrderDetails(tomorrowOrders);

    const todayMeals = activeOrderItems.length > 0 ? activeOrderItems : meals.slice(0, 1);
    const tomorrowMeals = vanguardOrderItems.length > 0 ? vanguardOrderItems : meals.slice(1, 3);
    const [checkedItems, setCheckedItems] = useState({});
    const [isListening, setIsListening] = useState(false);
    const recognitionRef = useRef(null);
    const servantRef = useRef(null);

    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = true;
            recognitionRef.current.interimResults = false;

            recognitionRef.current.onresult = (event) => {
                const command = event.results[event.results.length - 1][0].transcript.toLowerCase();
                if (command.includes('next step')) {
                    const unchecked = servantRef.current?.querySelectorAll('button:not(.checked)');
                    if (unchecked && unchecked.length > 0) {
                        unchecked[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
                        gsap.fromTo(unchecked[0], { x: -10 }, { x: 0, duration: 0.5, ease: "elastic.out" });
                    }
                }
                if (command.includes('mark done')) {
                    const firstUnchecked = servantRef.current?.querySelector('button:not(.checked)');
                    if (firstUnchecked) firstUnchecked.click();
                }
            };

            recognitionRef.current.onstart = () => setIsListening(true);
            recognitionRef.current.onend = () => setIsListening(false);
        }

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.onend = null;
                recognitionRef.current.onstart = null;
                recognitionRef.current.onresult = null;
                recognitionRef.current.stop();
            }
        };
    }, []);

    const toggleListening = () => {
        if (isListening) {
            recognitionRef.current?.stop();
        } else {
            recognitionRef.current?.start();
        }
    };

    const toggleItem = (id) => {
        setCheckedItems(prev => ({ ...prev, [id]: !prev[id] }));
    };

    return (
        <div ref={servantRef} className="relative space-y-20 pb-32 max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-5 duration-1000">
            <div className="fixed top-24 right-12 z-[110] flex flex-col items-center space-y-4">
                <button
                    onClick={toggleListening}
                    className={`p-6 rounded-full transition-all duration-500 shadow-3xl ${isListening
                        ? (isAccessible ? 'bg-[#06C167] text-white animate-pulse' : 'bg-accent text-white animate-pulse')
                        : (isAccessible ? 'bg-[#1F1F1F] text-white/20' : 'bg-white/10 text-text-main/20')
                        }`}
                >
                    {isListening ? <Mic className="w-8 h-8" /> : <MicOff className="w-8 h-8" />}
                </button>
                <div className={`text-[8px] uppercase tracking-[0.3em] font-black ${isListening ? 'text-accent' : 'text-text-main/20'}`}>
                    {isListening ? 'Voice Active' : 'Voice Off'}
                </div>
            </div>

            <header className="space-y-6 text-center">
                <span className={`${isAccessible ? 'text-[#06C167] font-black text-[14px]' : 'text-accent font-bold text-[10px]'} uppercase tracking-[0.8em]`}>Operational Console</span>
                <h2 className={`${isAccessible ? 'text-8xl font-sans font-bold text-white' : 'text-6xl font-serif italic text-text-main'}`}>Servant Mode</h2>
                <div className="flex flex-col items-center space-y-2">
                    <p className={`${isAccessible ? 'text-2xl font-bold text-white/30' : 'text-sm text-text-main/40 font-sans tracking-wide'}`}>Precision Checklist</p>
                    <p className="text-[9px] uppercase tracking-widest text-accent/60 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-accent rounded-full animate-ping" />
                        Say "Next Step" or "Mark Done"
                    </p>
                </div>
            </header>

            <PrepSection title="Active Tasks" items={todayMeals} icon={Clock} isAccessible={isAccessible} checkedItems={checkedItems} toggleItem={toggleItem} />
            <PrepSection title="Vanguard Schedule" items={tomorrowMeals} icon={ClipboardList} isAccessible={isAccessible} checkedItems={checkedItems} toggleItem={toggleItem} />

            <div className={`${isAccessible ? 'bg-[#1F1F1F] p-20 shadow-3xl overflow-hidden' : 'glass p-10 bg-text-main text-white/90 shadow-2xl'} rounded-[4rem] text-center space-y-6`}>
                <ChefHat className={`w-24 h-24 mx-auto mb-8 ${isAccessible ? 'text-[#06C167]' : 'text-accent'}`} />
                <h3 className={`${isAccessible ? 'text-6xl font-sans font-bold text-white' : 'text-2xl font-serif italic'}`}>Integrity Protocol</h3>
                <p className={`${isAccessible ? 'text-2xl font-bold text-white/30 leading-relaxed' : 'text-xs font-sans text-white/50 leading-relaxed max-w-sm mx-auto tracking-wide'}`}>
                    Follow all designated swaps. Precision is required for Lineage maintenance.
                </p>
            </div>
        </div>
    );
};

export default ServantMode;
