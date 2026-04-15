import { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";
import gsap from 'gsap';

const COMMON_ALTERNATIVES = {
    'Rice': ['Quinoa', 'Farro', 'Cauliflower Rice', 'Couscous'],
    'Beef Short Rib': ['Braised Lamb', 'Portobello Steaks', 'Oxtail'],
    'Heirloom Carrots': ['Roasted Parsnips', 'Butternut Squash', 'Baby Beets'],
    'Seabass': ['Halibut', 'King Oyster Mushroom', 'Salmon'],
    'Pistachio Crumbles': ['Toasted Hazelnuts', 'Pine Nuts', 'Sunflower Seeds']
};

const SwapModal = ({ meal, onClose, onSwapIngredient, onReplaceDish, nextRecommendations }) => {
    const [selectedIngredient, setSelectedIngredient] = useState(null);
    const [newIngredientValue, setNewIngredientValue] = useState('');
    const modalRef = useRef(null);
    const overlayRef = useRef(null);
    const optionsRef = useRef(null);

    useEffect(() => {
        const tl = gsap.timeline();
        tl.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3 })
            .fromTo(modalRef.current, { scale: 0.95, opacity: 0, y: 20 }, { scale: 1, opacity: 1, y: 0, duration: 0.4, ease: "power3.out" }, "-=0.2");
    }, []);

    useEffect(() => {
        if (selectedIngredient && optionsRef.current) {
            gsap.fromTo(optionsRef.current.children,
                { opacity: 0, x: -10 },
                { opacity: 1, x: 0, duration: 0.3, stagger: 0.05, ease: "power2.out" }
            );
        }
    }, [selectedIngredient]);

    const handleClose = () => {
        const tl = gsap.timeline({ onComplete: onClose });
        tl.to(modalRef.current, { scale: 0.95, opacity: 0, y: 20, duration: 0.3 })
            .to(overlayRef.current, { opacity: 0, duration: 0.2 }, "-=0.2");
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                ref={overlayRef}
                className="absolute inset-0 bg-background/80 backdrop-blur-xl"
                onClick={handleClose}
            />

            <div
                ref={modalRef}
                className="relative w-full max-w-4xl glass p-10 rounded-[3rem] shadow-4xl overflow-hidden"
            >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent/30 to-transparent" />

                <div className="space-y-10">
                    <header className="flex justify-between items-start">
                        <div>
                            <span className="text-[10px] uppercase tracking-[0.4em] text-accent font-bold">Orchestration Protocol</span>
                            <h2 className="text-4xl font-serif italic text-text-main mt-2">Refining {meal.name}</h2>
                        </div>
                        <button onClick={handleClose} className="p-2 hover:bg-accent/10 rounded-full transition-colors group">
                            <X className="h-6 w-6 text-text-main/20 group-hover:text-accent" />
                        </button>
                    </header>

                    <div className="grid md:grid-cols-2 gap-16">
                        {/* Ingredient Swap Section */}
                        <section className="space-y-6">
                            <h4 className="font-sans text-xs uppercase tracking-[0.2em] text-text-main/50 font-bold border-b border-text-main/5 pb-2">Select Component to Replace</h4>
                            <div className="flex flex-wrap gap-2">
                                {meal.ingredients?.map((ing, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => {
                                            setSelectedIngredient(ing);
                                            setNewIngredientValue(ing);
                                        }}
                                        className={`text-[10px] uppercase tracking-widest px-4 py-2 rounded-lg transition-all border ${selectedIngredient === ing
                                            ? 'bg-accent text-white border-accent shadow-lg shadow-accent/20'
                                            : 'bg-white/40 text-text-main/60 border-white/20 hover:border-accent/30'
                                            }`}
                                    >
                                        {ing}
                                    </button>
                                ))}
                            </div>

                            {selectedIngredient && (
                                <div className="space-y-6 pt-4 border-t border-text-main/5">
                                    <div className="space-y-3">
                                        <span className="text-[9px] uppercase tracking-widest text-text-main/40 font-bold">Intelligent Alternatives</span>
                                        <div ref={optionsRef} className="flex flex-wrap gap-2">
                                            {COMMON_ALTERNATIVES[selectedIngredient] ? (
                                                COMMON_ALTERNATIVES[selectedIngredient].map(alt => (
                                                    <button
                                                        key={alt}
                                                        onClick={() => setNewIngredientValue(alt)}
                                                        className={`text-[10px] px-3 py-1.5 rounded-md transition-all border ${newIngredientValue === alt
                                                            ? 'bg-text-main text-white border-text-main'
                                                            : 'bg-text-main/5 text-text-main/60 border-transparent hover:border-text-main/20'}`}
                                                    >
                                                        {alt}
                                                    </button>
                                                ))
                                            ) : (
                                                <p className="text-[10px] text-text-main/30 italic">No specific alternatives mapped for this element.</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <span className="text-[9px] uppercase tracking-widest text-text-main/40 font-bold">Custom Designation</span>
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value={newIngredientValue}
                                                onChange={(e) => setNewIngredientValue(e.target.value)}
                                                className="flex-grow bg-white/50 border border-text-main/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent/40 transition-colors backdrop-blur-sm"
                                                placeholder="Enter custom element..."
                                            />
                                            <button
                                                onClick={() => {
                                                    if (newIngredientValue.trim() && newIngredientValue !== selectedIngredient) {
                                                        onSwapIngredient(selectedIngredient, newIngredientValue);
                                                    }
                                                }}
                                                disabled={!newIngredientValue.trim() || newIngredientValue === selectedIngredient}
                                                className="bg-accent text-white px-6 rounded-xl hover:bg-accent/80 disabled:opacity-30 disabled:cursor-not-allowed transition-all font-sans text-[10px] uppercase tracking-widest font-bold shadow-lg shadow-accent/10"
                                            >
                                                Designate
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </section>


                        {/* Dish Replacement Section */}
                        <section className="space-y-6">
                            <h4 className="font-sans text-xs uppercase tracking-[0.2em] text-text-main/50 font-bold border-b border-text-main/5 pb-2">Intelligence Recommendation</h4>
                            <div className="bg-white/5 rounded-2xl p-6 space-y-4 border border-white/10">
                                <p className="text-xs text-text-main/60 italic leading-relaxed">
                                    The Priority Engine suggests replacing this dish with the next recommendation in the queue.
                                </p>
                                {nextRecommendations && nextRecommendations.length > 0 && (
                                    <div className="pt-2">
                                        <span className="text-[10px] text-accent uppercase tracking-widest block mb-2">Next in Line</span>
                                        <p className="text-lg font-serif italic text-text-main">{nextRecommendations[0].name}</p>
                                    </div>
                                )}
                                <button
                                    onClick={onReplaceDish}
                                    className="w-full bg-accent/10 border border-accent/20 text-accent font-sans text-xs uppercase tracking-widest py-4 rounded-xl hover:bg-accent/20 transition-all group flex items-center justify-center space-x-2"
                                >
                                    <span>Replace Entire Dish</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transform group-hover:rotate-90 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                                    </svg>
                                </button>
                            </div>
                        </section>
                    </div>
                </div>

                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-accent/5 rounded-full blur-3xl -z-10" />
            </div>
        </div>
    );
};

export default SwapModal;
