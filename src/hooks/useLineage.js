import { useState, useEffect, useMemo } from "react";

import { database } from "../firebase";
import { ref, onValue, update } from "firebase/database";

import imgVegan from "../assets/cuisine-vegan-vegetarian.jpg";
import imgSeafood from "../assets/cuisine-seafood.jpg";
import imgItalian from "../assets/cuisine-italian.jpg";
import imgSignature from "../assets/cuisine-signature-dishes.jpg";

const MOCK_MEALS = [
    {
        id: "1",
        name: "Slow-Roasted Heirloom Carrots",
        image: imgVegan,
        ingredients: ["Heirloom Carrots", "Wild Thyme", "Whipped Feta", "Pistachio Crumbles"],
        last_made: Date.now() - (1000 * 60 * 60 * 24 * 5),
        category: "Botanical",
        type: "Main",
        isLocked: true,
        nutrition: { fiber: true, minerals: true },
        description: "An ancestral record of Root Vitality. The whipped feta provides a cultural bridge to high-protein botanical structures.",
        mood: "light"
    },
    {
        id: "2",
        name: "Wild-Caught Seabass in Parchment",
        image: imgSeafood,
        ingredients: ["Seabass", "Meyer Lemon", "Samphire", "Dill Emulsion"],
        last_made: Date.now() - (1000 * 60 * 60 * 24 * 12),
        category: "Marine",
        type: "Main",
        isLocked: false,
        nutrition: { protein: true, minerals: true },
        description: "Precision steaming preserves the integrity of Omega records. Essential for cognitive maintenance in the Lineage.",
        mood: "quick"
    },
    {
        id: "3",
        name: "Antique Grain Risotto",
        image: imgItalian,
        ingredients: ["Farro", "Porcini Mushrooms", "Black Truffle Oil", "24-Month Sfoglia"],
        last_made: Date.now() - (1000 * 60 * 60 * 24 * 2),
        category: "Earth",
        type: "Main",
        isLocked: false,
        nutrition: { fiber: true, fats: true },
        description: "Slow-processed antique grains provide sustained energy release. A cornerstone of historical endurance protocols.",
        mood: "hearty"
    },
    {
        id: "4",
        name: "Braised Short Rib 'Heritage'",
        image: imgSignature,
        ingredients: ["Beef Short Rib", "Red Wine Reduction", "Parsnip Purée", "Bone Marrow"],
        last_made: Date.now() - (1000 * 60 * 60 * 24 * 20),
        category: "Estate",
        type: "Main",
        isLocked: true,
        nutrition: { protein: true, fats: true },
        description: "The peak of the Estate's culinary preservation. High-density protein records integrated with deep-tissue collagen support.",
        mood: "hearty"
    },
    {
        id: "5",
        name: "Sparkling Lavender Nectar",
        image: imgVegan,
        ingredients: ["Lavender Essence", "Raw Honey", "Carbonated Spring Water"],
        category: "Botanical",
        type: "Drink",
        mood: "light",
        description: "A calming infusion designed for neurotransmitter stabilization."
    },
    {
        id: "6",
        name: "Bone Marrow Toast",
        image: imgSignature,
        ingredients: ["Sourdough", "Roasted Marrow", "Parsley Salad"],
        category: "Estate",
        type: "Add-on",
        mood: "hearty",
        description: "High-density lipid support for ancestral endurance."
    }
];

export const useLineage = () => {
    const [meals, setMeals] = useState([]);
    const [leftovers, setLeftovers] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const calculatePriority = (lastMade) => {
        if (!lastMade) return 100;
        const now = Date.now();
        const diffInDays = (now - lastMade) / (1000 * 60 * 60 * 24);
        return Math.floor(diffInDays * 10);
    };

    const getDeficiencies = (meals, now) => {
        const categories = ["Botanical", "Marine", "Earth", "Estate"];
        const threeDays = 1000 * 60 * 60 * 24 * 3;

        return categories.filter(cat => {
            const catMeals = meals.filter(m => m.category === cat && m.type === "Main");
            if (catMeals.length === 0) return false;
            const hasRecent = catMeals.some(m => m.last_made > now - threeDays);
            return !hasRecent;
        });
    };


    useEffect(() => {
        const processedMock = MOCK_MEALS.map(meal => ({
            ...meal,
            priority: meal.type === "Main" ? calculatePriority(meal.last_made) : 0
        })).sort((a, b) => (b.priority || 0) - (a.priority || 0));

        if (!database) {
            setTimeout(() => {
                setMeals(processedMock);
                setLoading(false);
            }, 0);
            return;
        }

        const statusRef = ref(database, "mealStatus");
        const ordersRef = ref(database, "orders");

        // Failsafe: Continue with local data if Firebase is slow
        const failsafe = setTimeout(() => {
            setMeals(processedMock);
            setLoading(false);
        }, 5000);

        const unsubStatus = onValue(statusRef, (snapshot) => {
            clearTimeout(failsafe);
            const statusData = snapshot.val() || {};
            const enrichedMeals = MOCK_MEALS.map(meal => {
                const status = statusData[meal.id] || {};
                const last_made = status.last_made || meal.last_made;
                const isLocked = status.isLocked !== undefined ? status.isLocked : meal.isLocked;

                return {
                    ...meal,
                    last_made,
                    isLocked,
                    priority: meal.type === "Main" ? calculatePriority(last_made) : 0
                };
            }).sort((a, b) => b.priority - a.priority);

            setMeals(enrichedMeals);
            setLoading(false);
        }, (err) => {
            console.error("Lineage: Meal Status Error:", err);
            clearTimeout(failsafe);
            setError("Synchronization protocol interrupted (Status).");
            setMeals(processedMock);
            setLoading(false);
        });

        const unsubOrders = onValue(ordersRef, (snapshot) => {
            clearTimeout(failsafe);
            const data = snapshot.val();
            if (data) {
                const ordersList = Object.entries(data).map(([key, value]) => ({
                    id: key,
                    ...value
                })).sort((a, b) => (a.scheduledAt || 0) - (b.scheduledAt || 0));
                setOrders(ordersList);
            } else {
                setOrders([]);
            }
            setLoading(false);
        }, (err) => {
            console.error("Lineage: Orders Listener Error:", err);
            clearTimeout(failsafe);
            setError("Synchronization protocol interrupted (Orders).");
        });

        return () => {
            clearTimeout(failsafe);
            unsubStatus();
            unsubOrders();
        };
    }, []); // Removed loading dependency to prevent infinite loop


    const updateMeal = async (mealId, updates) => {
        try {
            if (!database) {
                setMeals(prev => prev.map(m => m.id === mealId ? { ...m, ...updates } : m));
                return;
            }
            await update(ref(database, `mealStatus/${mealId}`), updates);
        } catch (err) {
            console.error("Lineage: Update failed", err);
            setError("Update protocol failed.");
            throw err;
        }
    };

    const addOrder = async (orderData) => {
        try {
            if (!database) {
                setOrders(prev => [...prev, { id: Date.now().toString(), ...orderData }]);
                return;
            }
            const newOrderRef = ref(database, `orders/${Date.now()}`);
            await update(newOrderRef, orderData);
            if (orderData.mealId) {
                await updateMeal(orderData.mealId, { isLocked: true });
            }
        } catch (err) {
            console.error("Lineage: Add order failed", err);
            setError("Schedule protocol failed.");
            throw err;
        }
    };

    const removeOrder = async (orderId) => {
        try {
            if (!database) {
                setOrders(prev => prev.filter(o => o.id !== orderId));
                return;
            }
            await update(ref(database, `orders/${orderId}`), null);
        } catch (err) {
            console.error("Lineage: Remove order failed", err);
            setError("Removal protocol failed.");
        }
    };

    const addLeftover = (mealId) => {
        setLeftovers(prev => [...prev, { mealId, timestamp: Date.now() }]);
    };

    const recommendedMeals = useMemo(() => meals.filter(m => m.type === "Main").slice(0, 3), [meals]);
    const [now] = useState(() => Date.now());
    const memoizedDeficiencies = useMemo(() => {
        return getDeficiencies(meals, now);
    }, [meals, now]);




    return {
        meals,
        orders,
        recommendedMeals,
        deficiencies: memoizedDeficiencies,
        leftovers,
        addLeftover,
        addOrder,
        removeOrder,
        loading,
        error,
        updateMeal,
        clearError: () => setError(null)
    };
};


