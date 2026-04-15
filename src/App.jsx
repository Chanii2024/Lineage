import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { useLineage } from "./hooks/useLineage";
import MealCard from "./components/MealCard";
import SwapModal from "./components/SwapModal";
import FamilyAnalytics from "./components/FamilyAnalytics";
import ServantMode from "./components/ServantMode";
import OrderMenu from "./components/OrderMenu";
import OrderSidebar from "./components/OrderSidebar";
import { LeftoverPrompt, QuickLunchBadge } from "./components/LeftoverSystem";
import GroceryExporter from "./components/GroceryExporter";
import { BarChart3, LayoutDashboard, UtensilsCrossed, ShoppingBag, X, Check } from "lucide-react";

import "./App.css";

function App() {
  const {
    meals,
    orders,
    recommendedMeals,
    deficiencies,
    leftovers,
    addLeftover,
    addOrder,
    removeOrder,
    loading,
    error,
    updateMeal,
    clearError
  } = useLineage();
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [activeView, setActiveView] = useState('intelligence'); // intelligence, analytics, servant, orders
  const [isAccessible, setIsAccessible] = useState(false);
  const [showLeftoverPrompt, setShowLeftoverPrompt] = useState(false);
  const [pendingLeftoverMeal, setPendingLeftoverMeal] = useState(null);
  const [activeMood, setActiveMood] = useState('all'); // all, light, hearty, quick
  const dashboardRef = useRef(null);

  const filteredMeals = activeMood === 'all'
    ? meals
    : meals.filter(m => m.mood === activeMood);

  const moods = [
    { id: 'all', label: 'All Protocols' },
    { id: 'light', label: 'Light Vitality' },
    { id: 'hearty', label: 'Estate Hearty' },
    { id: 'quick', label: 'Quick Prep' }
  ];

  useEffect(() => {
    if (!loading && filteredMeals.length > 0 && activeView === 'intelligence') {
      const cards = dashboardRef.current?.querySelectorAll('.meal-card');
      if (cards) {
        gsap.fromTo(
          cards,
          { opacity: 0, y: 30, scale: 0.98 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            stagger: 0.1,
            ease: "expo.out",
            overwrite: true
          }
        );
      }
    }
  }, [loading, activeMood, activeView, filteredMeals]); // Fixed dependency array

  const handleSwapIngredient = async (oldIng, newIng) => {
    const updatedIngredients = selectedMeal.ingredients.map(ing =>
      ing === oldIng ? newIng : ing
    );
    try {
      await updateMeal(selectedMeal.id, { ingredients: updatedIngredients });
      setSelectedMeal(null);
    } catch (err) {
      console.error("Intelligence update failed:", err);
    }
  };

  const handleToggleLock = async (meal) => {
    try {
      await updateMeal(meal.id, { isLocked: !meal.isLocked });
    } catch (err) {
      console.error("Lock protocol failed:", err);
    }
  };

  const handleReplaceDish = async () => {
    const pool = meals.filter(m => m.id !== selectedMeal.id && !m.isLocked);
    if (pool.length === 0) {
      alert("No available candidates. Unlock other dishes.");
      return;
    }

    try {
      const cards = dashboardRef.current.querySelectorAll('.meal-card');
      await gsap.to(cards, { opacity: 0, scale: 0.9, duration: 0.4, stagger: 0.05, ease: "power2.in" });

      const targetMeal = selectedMeal;
      await updateMeal(selectedMeal.id, { last_made: Date.now() });

      setSelectedMeal(null);
      setPendingLeftoverMeal(targetMeal);
      setShowLeftoverPrompt(true);
    } catch (err) {
      console.error("Replacement protocol interrupted:", err);
    }
  };

  const handleConfirmLeftover = () => {
    addLeftover(pendingLeftoverMeal.id);
    setShowLeftoverPrompt(false);
    setPendingLeftoverMeal(null);
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-2 border-accent border-t-transparent rounded-full animate-spin" />
          <p className="text-accent uppercase tracking-[0.3em] text-[10px] font-bold">Synchronizing Lineage</p>
        </div>
      </main>
    );
  }

  return (
    <div className={`min-h-screen flex selection:bg-accent/30 selection:text-text-main ${isAccessible ? 'accessible-mode bg-white' : 'bg-background'}`}>
      <main className="flex-grow p-8 md:p-16 max-w-7xl mx-auto overflow-y-auto no-scrollbar pb-32">
        {/* Navigation Dock */}
        <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] glass px-8 py-4 rounded-[2.5rem] flex items-center space-x-12 shadow-2xl border-white/20 bg-white/20">
          <button
            onClick={() => setActiveView('intelligence')}
            className={`flex flex-col items-center space-y-1 transition-all group ${activeView === 'intelligence' ? 'text-accent scale-110' : 'text-text-main/30 hover:text-text-main/60'}`}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span className="text-[8px] uppercase tracking-widest font-bold">Intelligence</span>
          </button>

          <button
            onClick={() => setActiveView('orders')}
            className={`flex flex-col items-center space-y-1 transition-all group ${activeView === 'orders' ? 'text-accent scale-110' : 'text-text-main/30 hover:text-text-main/60'}`}
          >
            <ShoppingBag className="w-5 h-5" />
            <span className="text-[8px] uppercase tracking-widest font-bold">Menu</span>
          </button>

          <button
            onClick={() => setActiveView('analytics')}
            className={`flex flex-col items-center space-y-1 transition-all group ${activeView === 'analytics' ? 'text-accent scale-110' : 'text-text-main/30 hover:text-text-main/60'}`}
          >
            <BarChart3 className="w-5 h-5" />
            <span className="text-[8px] uppercase tracking-widest font-bold">Analytics</span>
          </button>

          <button
            onClick={() => setActiveView('servant')}
            className={`flex flex-col items-center space-y-1 transition-all group ${activeView === 'servant' ? 'text-accent scale-110' : 'text-text-main/30 hover:text-text-main/60'}`}
          >
            <UtensilsCrossed className="w-5 h-5" />
            <span className="text-[8px] uppercase tracking-widest font-bold">Servant</span>
          </button>
        </nav>

        <div className="space-y-12">
          {error && (
            <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[200] bg-red-500/10 border border-red-500/20 backdrop-blur-md px-6 py-3 rounded-2xl flex items-center space-x-4 animate-in slide-in-from-top-10">
              <span className="text-red-500 text-xs font-bold uppercase tracking-widest">{error}</span>
              <button onClick={clearError} className="text-red-500/50 hover:text-red-500">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
          {activeView === 'intelligence' && (
            <>
              <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-text-main/5 pb-10 animate-in fade-in duration-700">
                <div className="space-y-2">
                  <span className="text-accent uppercase tracking-[0.5em] text-[10px] font-bold">Intelligence Dashboard</span>
                  <h1 className="text-6xl font-serif italic text-text-main">Lineage</h1>
                </div>
                <div className="flex flex-col items-end gap-6">
                  <div className="flex items-stretch gap-4">
                    <div className="bg-text-main/5 px-6 py-4 rounded-2xl backdrop-blur-sm border border-text-main/10 shadow-sm">
                      <p className="text-[10px] uppercase tracking-widest text-text-main/40 mb-1">Active Recommendation</p>
                      <p className="font-serif italic text-lg text-text-main">
                        {recommendedMeals.length > 0 ? recommendedMeals[0].name : "Ready for Input"}
                      </p>
                    </div>
                    <button
                      onClick={() => setIsAccessible(!isAccessible)}
                      className={`flex items-center space-x-4 px-8 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] transition-all ${isAccessible
                        ? 'bg-[#06C167] text-white shadow-xl shadow-[#06C167]/20 border-0'
                        : 'bg-text-main/5 text-text-main/60 hover:bg-text-main/10 border border-text-main/10'
                        }`}
                    >
                      <span>{isAccessible ? 'Reading: High' : 'Reading: Std'}</span>
                      <div className={`w-2.5 h-2.5 rounded-full ${isAccessible ? 'bg-white animate-pulse' : 'bg-text-main/20'}`} />
                    </button>
                  </div>
                  <GroceryExporter meals={meals} isAccessible={isAccessible} />
                </div>
              </header>

              <div className="flex items-center justify-between pb-8">
                <div className="flex items-center space-x-4">
                  {moods.map(mood => (
                    <button
                      key={mood.id}
                      onClick={() => setActiveMood(mood.id)}
                      className={`px-6 py-2.5 rounded-full text-[9px] uppercase tracking-[0.2em] font-bold transition-all ${activeMood === mood.id
                        ? (isAccessible ? 'bg-white text-black' : 'bg-text-main text-white')
                        : (isAccessible ? 'bg-white/5 text-white/40 hover:bg-white/10' : 'bg-text-main/5 text-text-main/40 hover:bg-text-main/10')
                        }`}
                    >
                      {mood.label}
                    </button>
                  ))}
                </div>
                <QuickLunchBadge leftovers={leftovers} meals={meals} isAccessible={isAccessible} />
              </div>

              <section ref={dashboardRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 auto-rows-[minmax(300px,auto)]">
                {filteredMeals.map((meal, index) => (
                  <MealCard
                    key={meal.id}
                    meal={meal}
                    featured={index === 0 && activeMood === 'all'}
                    isAccessible={isAccessible}
                    isDeficient={deficiencies.includes(meal.category)}
                    onSwap={(m) => setSelectedMeal(m)}
                    onToggleLock={handleToggleLock}
                  />
                ))}

                {filteredMeals.length === 0 && (
                  <div className="col-span-full py-32 text-center glass rounded-[3rem]">
                    <p className="font-serif italic text-3xl text-text-main/40">The record is currently empty.</p>
                  </div>
                )}
              </section>
            </>
          )}

          {activeView === 'orders' && (
            <div className="animate-in slide-in-from-bottom-10 duration-700">
              <header className="pb-10 border-b border-text-main/5 mb-10">
                <span className="text-accent uppercase tracking-[0.5em] text-[10px] font-bold">Menu & Scheduling</span>
                <h1 className="text-6xl font-serif italic text-text-main">Family Records</h1>
              </header>
              <OrderMenu meals={meals} addOrder={addOrder} isAccessible={isAccessible} />
            </div>
          )}

          {activeView === 'analytics' && <FamilyAnalytics meals={meals} />}
          {activeView === 'servant' && <ServantMode meals={meals} orders={orders} isAccessible={isAccessible} />}
        </div>
      </main>

      {/* Top Drawer for Intelligence & Orders Views */}
      {(activeView === 'intelligence' || activeView === 'orders') && (
        <OrderSidebar orders={orders} removeOrder={removeOrder} isAccessible={isAccessible} />
      )}

      {selectedMeal && (
        <SwapModal
          meal={selectedMeal}
          onClose={() => setSelectedMeal(null)}
          onSwapIngredient={handleSwapIngredient}
          onReplaceDish={handleReplaceDish}
          nextRecommendations={meals.filter(m => m.id !== selectedMeal.id).slice(0, 1)}
        />
      )}

      {showLeftoverPrompt && (
        <LeftoverPrompt
          meal={pendingLeftoverMeal}
          onConfirm={handleConfirmLeftover}
          onCancel={() => setShowLeftoverPrompt(false)}
          isAccessible={isAccessible}
        />
      )}
    </div>
  );
}

export default App;
