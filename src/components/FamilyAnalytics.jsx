import React, { useMemo, useState } from 'react';


import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, Cell, Tooltip } from 'recharts';

const FamilyAnalytics = ({ meals, isAccessible = false }) => {
    // Process categories for Radar Chart
    const categoryDistribution = useMemo(() => {
        const counts = meals.reduce((acc, meal) => {
            const cat = meal.category || 'General';
            acc[cat] = (acc[cat] || 0) + 1;
            return acc;
        }, {});

        return Object.entries(counts).map(([name, value]) => ({
            name,
            value,
            fullMark: meals.length
        }));
    }, [meals]);

    const [now] = useState(() => Date.now());

    // Process dormant categories (new calculation based on user's edit)
    const dormantCategories = useMemo(() => {
        const dayDuration = 1000 * 60 * 60 * 24;
        // First, get all unique categories from meals
        const allCategories = [...new Set(meals.map(m => m.category || 'General'))];

        const result = allCategories.filter(cat => {
            const catMeals = meals.filter(m => (m.category || 'General') === cat && m.type === "Main");
            if (catMeals.length === 0) return false; // If no 'Main' meals in category, it's not dormant by this definition

            const lastMadeForCat = catMeals.map(m => m.last_made || 0);
            const mostRecent = Math.max(...lastMadeForCat);
            const diff = now - mostRecent;
            return diff > (dayDuration * 3);
        });
        return result;
    }, [meals, now]);


    // Process ignored groups (Heatmap-style grid)
    const ignoredGroups = useMemo(() => {
        // Find meals not made in the last 14 days
        const threshold = now - (1000 * 60 * 60 * 24 * 14);
        return meals.filter(m => m.last_made < threshold || !m.last_made);
    }, [meals, now]);


    return (
        <div className="space-y-12 pb-20 animate-in fade-in duration-1000">
            <header className="space-y-6">
                <span className={`${isAccessible ? 'text-[#06C167] font-black text-[14px]' : 'text-accent font-bold text-[10px]'} uppercase tracking-[0.5em]`}>Health Intel</span>
                <h2 className={`${isAccessible ? 'text-7xl font-sans font-bold text-white' : 'text-5xl font-serif italic text-text-main'}`}>Analytics</h2>
            </header>


            <div className="grid lg:grid-cols-2 gap-12">
                {/* Radar: Nutrition Balance */}
                <div className={`${isAccessible ? 'bg-[#1F1F1F] p-12 shadow-2xl border border-white/5' : 'glass p-10 bg-white/5 border-white/10'} rounded-[3rem] space-y-10`}>
                    <div>
                        <h3 className={`${isAccessible ? 'text-4xl font-bold text-white' : 'text-2xl font-serif italic text-text-main'}`}>Distribution</h3>
                        <p className={`${isAccessible ? 'text-xl font-bold text-white/30' : 'text-[10px] uppercase tracking-widest text-text-main/40'} mt-2`}>Culinary Monitor</p>
                    </div>

                    {isAccessible ? (
                        <div className="space-y-4">
                            {categoryDistribution.map(cat => (
                                <div key={cat.name} className="flex justify-between items-center bg-[#181818] p-8 rounded-2xl border border-white/5 shadow-inner">
                                    <span className="text-xl font-black text-white uppercase tracking-wider">{cat.name}</span>
                                    <div className="flex items-center space-x-6">
                                        <div className="w-32 h-2.5 bg-white/10 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-[#06C167]"
                                                style={{ width: `${(cat.value / meals.length) * 100}%` }}
                                            />
                                        </div>
                                        <span className="text-3xl font-black text-[#06C167]">{cat.value}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="h-[400px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={categoryDistribution}>
                                    <PolarGrid stroke="rgba(45, 52, 54, 0.1)" />
                                    <PolarAngleAxis
                                        dataKey="name"
                                        tick={{ fill: 'rgba(45, 52, 54, 0.4)', fontSize: 10, letterSpacing: '0.1em' }}
                                    />
                                    <Radar
                                        name="Cuisine Distribution"
                                        dataKey="value"
                                        stroke="#8BA888"
                                        fill="#8BA888"
                                        fillOpacity={0.3}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'rgba(232, 235, 228, 0.9)',
                                            border: 'none',
                                            borderRadius: '12px',
                                            fontSize: '11px',
                                            fontFamily: 'Inter',
                                            boxShadow: '0 20px 40px -10px rgba(0,0,0,0.1)'
                                        }}
                                    />
                                </RadarChart>
                            </ResponsiveContainer>
                        </div>
                    )}
                </div>

                {/* Gaps: Attention Required */}
                <div className={`${isAccessible ? 'bg-[#1F1F1F] p-12 shadow-2xl border border-white/5' : 'glass p-10 bg-black/5 border-white/5'} rounded-[3rem] space-y-10`}>
                    <div>
                        <h3 className={`${isAccessible ? 'text-4xl font-bold text-white' : 'text-2xl font-serif italic text-text-main'}`}>Gaps</h3>
                        <p className={`${isAccessible ? 'text-xl font-bold text-white/30' : 'text-[10px] uppercase tracking-widest text-text-main/40'} mt-2`}>Dormant Records</p>
                    </div>

                    <div className="space-y-6">
                        {ignoredGroups.length > 0 ? (
                            <div className={`grid gap-6 ${isAccessible ? 'grid-cols-1' : 'grid-cols-2 sm:grid-cols-3'}`}>
                                {ignoredGroups.map(meal => (
                                    <div key={meal.id} className={`${isAccessible ? 'bg-[#181818] p-8 border border-white/5' : 'bg-white/40 p-5 border border-white/20'} rounded-2xl space-y-3`}>
                                        <span className={`${isAccessible ? 'text-sm font-bold text-[#06C167]' : 'text-[8px] text-accent font-bold uppercase tracking-widest'}`}>{meal.category}</span>
                                        <p className={`${isAccessible ? 'text-2xl font-black text-white' : 'text-xs font-sans font-medium text-text-main'} leading-tight`}>{meal.name}</p>
                                        <p className={`${isAccessible ? 'text-[12px] font-bold text-white/20' : 'text-[8px] text-text-main/30'} uppercase`}>{Math.floor((now - (meal.last_made || 0)) / (1000 * 60 * 60 * 24))} Days Dormant</p>

                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="py-20 text-center opacity-30 italic font-serif">
                                All culinary lines are currently vibrant.
                            </div>
                        )}

                        <div className={`${isAccessible ? 'mt-10 p-12 bg-[#06C167] text-[#121212] border-0' : 'mt-8 p-6 bg-accent/5 border border-accent/10'} rounded-3xl`}>
                            <h4 className={`${isAccessible ? 'text-xs font-black mb-4 uppercase tracking-[0.3em] opacity-40' : 'text-[10px] font-bold mb-3 uppercase tracking-widest text-accent'}`}>Intelligence Insight</h4>
                            <p className={`${isAccessible ? 'text-2xl font-bold italic' : 'text-xs text-text-main/60 italic leading-relaxed'}`}>
                                "{ignoredGroups.length > 0
                                    ? `Record leans towards ${categoryDistribution[0]?.name}. Re-introduce '${ignoredGroups[0]?.name}'.`
                                    : "Equilibrium achieved."}"
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FamilyAnalytics;
