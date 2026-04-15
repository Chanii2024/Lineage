import React, { useEffect, useRef } from 'react';
import { Leaf, Droplets, Zap, CircleDot } from 'lucide-react';
import gsap from 'gsap';

const NutritionIcon = ({ trait, label, nutrition, isDeficient, isAccessible }) => {
    if (!nutrition[trait]) return null;
    const Icon = { fiber: Leaf, minerals: Droplets, protein: Zap, fats: CircleDot }[trait];

    return (
        <div className={`nutrition-icon relative group flex items-center justify-center ${isDeficient ? 'text-[#EBB3B2]' : (isAccessible ? 'text-white/40' : 'text-text-main/20')
            }`}>
            <Icon className={isAccessible ? "w-7 h-7" : "w-5 h-5"} />
            <span className={`absolute -top-12 left-0 scale-0 group-hover:scale-100 transition-all duration-300 bg-text-main text-white rounded-xl uppercase tracking-[0.2em] font-black shadow-2xl z-[50] pointer-events-none whitespace-nowrap ${isAccessible ? 'text-sm px-5 py-2.5' : 'text-[10px] px-4 py-2'
                }`}>
                {label}
                <div className="absolute bottom-[-4px] left-4 w-2 h-2 bg-text-main rotate-45" />
            </span>
        </div>
    );
};

const NutritionVisuals = ({ nutrition = {}, isDeficient = false, isAccessible = false }) => {

    const containerRef = useRef(null);

    useEffect(() => {
        if (isDeficient && !isAccessible) {
            const icons = containerRef.current?.querySelectorAll('.nutrition-icon');
            if (icons && icons.length > 0) {
                gsap.to(icons, {
                    scale: 1.15,
                    opacity: 0.8,
                    duration: 1.5,
                    repeat: -1,
                    yoyo: true,
                    ease: "sine.inOut"
                });
            }
        } else {
            const icons = containerRef.current?.querySelectorAll('.nutrition-icon');
            if (icons && icons.length > 0) {
                gsap.killTweensOf(icons);
            }
        }
    }, [isDeficient, isAccessible]);

    return (
        <div ref={containerRef} className="flex items-center space-x-6 pb-2">
            <NutritionIcon trait="fiber" label="Fiber Sustain" nutrition={nutrition} isDeficient={isDeficient} isAccessible={isAccessible} />
            <NutritionIcon trait="minerals" label="Mineral Balance" nutrition={nutrition} isDeficient={isDeficient} isAccessible={isAccessible} />
            <NutritionIcon trait="protein" label="Protein Vanguard" nutrition={nutrition} isDeficient={isDeficient} isAccessible={isAccessible} />
            <NutritionIcon trait="fats" label="Omegas" nutrition={nutrition} isDeficient={isDeficient} isAccessible={isAccessible} />
        </div>
    );
};


export default NutritionVisuals;
