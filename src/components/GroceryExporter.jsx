import React from 'react';
import { Share2 } from 'lucide-react';

const GroceryExporter = ({ meals = [], isAccessible = false }) => {
    const exportToWhatsApp = () => {
        // Filter next 3 days of 'Locked' or 'Top Priority' meals
        const selectedMeals = meals
            .filter(m => m.isLocked || m.priority > 50)
            .slice(0, 3);

        if (selectedMeals.length === 0) {
            alert("No significant records to export. Lock some dishes first.");
            return;
        }

        const ingredients = Array.from(new Set(selectedMeals.flatMap(m => m.ingredients)));

        const dateStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        const recordTitle = `📋 LINEAGE GROCERY RECORD [${dateStr}]\n\n`;
        const mealList = selectedMeals.map(m => `▫️ ${m.name}`).join('\n');
        const ingredientList = ingredients.map(i => `- ${i}`).join('\n');

        const text = encodeURIComponent(`${recordTitle}INTELLIGENCE STACK:\n${mealList}\n\nCONSOLIDATED INGREDIENTS:\n${ingredientList}\n\nMaintain the Protocol.`);
        window.open(`https://wa.me/?text=${text}`, '_blank');
    };

    return (
        <button
            onClick={exportToWhatsApp}
            className={`flex items-center space-x-4 px-8 py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] transition-all group ${isAccessible
                    ? 'bg-[#06C167] text-white shadow-xl shadow-[#06C167]/20 border-0'
                    : 'bg-text-main text-white shadow-2xl hover:scale-105 active:scale-95'
                }`}
        >
            <Share2 className={isAccessible ? "w-5 h-5" : "w-4 h-4"} />
            <span>{isAccessible ? 'SHARE TO WHATSAPP' : 'Export Logistics'}</span>
        </button>
    );
};

export default GroceryExporter;
