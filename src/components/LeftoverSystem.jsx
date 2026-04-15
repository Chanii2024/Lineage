import React from 'react';
import { Utensils, Check, X } from 'lucide-react';

export const LeftoverPrompt = ({ meal, onConfirm, onCancel, isAccessible = false }) => {
    if (!meal) return null;

    return (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-8 bg-background/80 backdrop-blur-md animate-in fade-in duration-500">
            <div className={`max-w-md w-full rounded-[3rem] p-12 space-y-8 text-center shadow-3xl ${isAccessible ? 'bg-[#1F1F1F] border border-white/10' : 'glass bg-white/90'
                }`}>
                <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center ${isAccessible ? 'bg-[#06C167]/10 text-[#06C167]' : 'bg-accent/10 text-accent'
                    }`}>
                    <Utensils className="w-10 h-10" />
                </div>

                <div className="space-y-3">
                    <h3 className={`${isAccessible ? 'text-4xl font-bold text-white' : 'text-2xl font-serif italic text-text-main'}`}>
                        Protocol Concluded
                    </h3>
                    <p className={`${isAccessible ? 'text-lg font-bold text-white/40' : 'text-xs uppercase tracking-widest text-text-main/40'}`}>
                        Are there leftovers from '{meal.name}'?
                    </p>
                </div>

                <div className="flex gap-4">
                    <button
                        onClick={onCancel}
                        className={`flex-1 py-4 rounded-2xl font-bold uppercase tracking-widest text-[10px] transition-all ${isAccessible ? 'bg-white/5 text-white/40 hover:bg-white/10' : 'bg-text-main/5 text-text-main/40 hover:bg-text-main/10'
                            }`}
                    >
                        No
                    </button>
                    <button
                        onClick={onConfirm}
                        className={`flex-1 py-4 rounded-2xl font-bold uppercase tracking-widest text-[10px] transition-all flex items-center justify-center space-x-3 ${isAccessible ? 'bg-[#06C167] text-white' : 'bg-accent text-white shadow-xl'
                            }`}
                    >
                        <span>Yes, Store</span>
                        <Check className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export const QuickLunchBadge = ({ leftovers = [], meals = [], isAccessible = false }) => {
    if (leftovers.length === 0) return null;

    // Only show leftovers from within the last 24 hours
    const activeLeftovers = leftovers.filter(l => (Date.now() - l.timestamp) < (1000 * 60 * 60 * 24));

    if (activeLeftovers.length === 0) return null;

    return (
        <div className="flex flex-wrap gap-4 mt-8 animate-in slide-in-from-top-4 duration-1000">
            {activeLeftovers.map((l, idx) => {
                const meal = meals.find(m => m.id === l.mealId);
                if (!meal) return null;

                return (
                    <div key={idx} className={`flex items-center space-x-4 px-6 py-3 rounded-2xl border ${isAccessible
                            ? 'bg-[#181818] border-[#06C167]/30 text-[#06C167]'
                            : 'bg-accent/5 border-accent/20 text-accent'
                        }`}>
                        <Utensils className="w-4 h-4" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Quick Lunch: {meal.name}</span>
                        <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${isAccessible ? 'bg-[#06C167]' : 'bg-accent'}`} />
                    </div>
                );
            })}
        </div>
    );
};
