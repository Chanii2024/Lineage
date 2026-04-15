import React from 'react';
import NutritionVisuals from './NutritionVisuals';

const MealCard = ({ meal, onSwap, onToggleLock, featured = false, isAccessible = false, isDeficient = false }) => {
    return (
        <article
            className={`meal-card glass rounded-[2.5rem] transition-all duration-700 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] group/card flex flex-col justify-between h-full bg-white/5 overflow-hidden border-white/10 ${meal.isLocked ? 'border-accent/40 shadow-[0_0_40px_-10px_rgba(139,168,136,0.2)]' : ''} ${featured ? 'md:col-span-2 lg:col-span-2' : ''}`}
        >
            {/* Visual Header */}
            <div className={`relative overflow-hidden ${isAccessible ? 'h-1/3' : 'h-1/2'} ${featured ? 'md:h-[60%]' : ''}`}>
                <img
                    src={meal.image}
                    alt={meal.name}
                    className={`w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover/card:scale-110 ${meal.isLocked || isAccessible ? 'opacity-100' : 'opacity-90'}`}
                />
                {!isAccessible && <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />}

                <div className={`absolute left-6 flex justify-between items-center w-[calc(100%-3rem)] ${isAccessible ? 'bottom-4' : 'top-6'}`}>
                    <span className={`uppercase tracking-[0.4em] font-black px-4 py-1.5 rounded-lg ${isAccessible
                        ? 'bg-[#06C167] text-white text-[11px]'
                        : 'glass bg-black/20 text-white text-[9px]'
                        }`}>
                        {meal.category || 'General'}
                    </span>
                    <button
                        onClick={() => onToggleLock(meal)}
                        className={`${isAccessible ? 'bg-white/10 text-white p-4 ring-1 ring-white/20' : 'glass p-2 bg-black/20 text-white/50 hover:text-white'} rounded-full transition-all duration-500 border-white/30 backdrop-blur-lg ${meal.isLocked ? (isAccessible ? 'bg-[#06C167] text-white shadow-lg' : 'bg-accent text-white scale-110 shadow-lg shadow-accent/20') : 'hover:scale-110'
                            }`}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className={isAccessible ? "h-6 w-6" : "h-4 w-4"} fill={meal.isLocked ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={isAccessible ? 3 : 2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </button>
                </div>
            </div>

            <div className={`p-8 pt-10 space-y-6 flex-grow flex flex-col justify-between ${isAccessible ? 'bg-[#1F1F1F]' : 'pt-0 -mt-8 relative z-10'}`}>
                <div className="space-y-4">
                    <div className="flex justify-between items-start gap-4">
                        <div className="space-y-2">
                            <NutritionVisuals nutrition={meal.nutrition} isDeficient={isDeficient} isAccessible={isAccessible} />
                            <h3 className={`${isAccessible ? 'text-4xl font-sans font-bold text-white' : 'text-3xl font-serif italic text-text-main'} leading-tight group-hover/card:text-accent transition-colors duration-500`}>
                                {meal.name}
                            </h3>
                        </div>
                        {!isAccessible && <span className="text-[10px] tracking-[0.2em] font-bold text-accent px-3 py-1 bg-accent/10 rounded-full shrink-0">
                            {meal.priority} pts
                        </span>}
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {meal.ingredients?.slice(0, 3).map((ing, idx) => (
                            <span
                                key={idx}
                                className={`${isAccessible
                                    ? 'text-xs font-bold bg-[#333] text-[#06C167] px-4 py-1.5 rounded-lg'
                                    : 'text-[10px] text-text-main/40 border border-text-main/10 px-2.5 py-1 uppercase tracking-widest rounded-lg'
                                    }`}
                            >
                                {ing}
                            </span>
                        ))}
                    </div>

                    <div className="pt-4 pb-2">
                        <p className={`${isAccessible ? 'text-lg font-bold text-white/50 leading-relaxed' : 'text-[11px] font-sans text-text-main/50 leading-relaxed italic'} line-clamp-3`}>
                            {meal.description || "Intelligence protocol pending for this record. Vitality metrics are within acceptable historical norms."}
                        </p>
                    </div>
                </div>

                <div className="pt-8 border-t border-white/5 flex items-center justify-between">
                    <div className="flex flex-col">
                        <span className={`${isAccessible ? 'text-[10px] font-bold text-white/30' : 'text-[8px] text-text-main/30'} uppercase tracking-[0.2em]`}>Record Tracker</span>
                        <span className={`${isAccessible ? 'text-lg font-bold text-white' : 'text-[11px] font-medium text-text-main/60'}`}>
                            {meal.last_made ? new Date(meal.last_made).toLocaleDateString() : 'Initial Record'}
                        </span>
                    </div>

                    <button
                        onClick={() => onSwap(meal)}
                        className={`group/btn flex items-center space-x-4 transition-all duration-500 ${isAccessible ? 'px-8 py-3.5 bg-[#06C167] text-white rounded-lg shadow-lg' : ''}`}
                    >
                        <span className={`${isAccessible ? 'text-xs font-black' : 'text-[10px]'} uppercase tracking-[0.4em] group-hover/btn:tracking-[0.6em]`}>
                            {isAccessible ? 'SWAP' : 'Orchestrate'}
                        </span>
                        <svg xmlns="http://www.w3.org/2000/svg" className={`${isAccessible ? 'h-5 w-5' : 'h-3 w-3'} transform group-hover/btn:translate-x-2 transition-transform`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={isAccessible ? 3 : 2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </button>
                </div>
            </div>
        </article>
    );
};

export default MealCard;

