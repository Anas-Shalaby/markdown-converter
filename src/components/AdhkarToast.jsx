import React, { useEffect } from 'react';
import { toast } from 'react-hot-toast';

// Array of Islamic adhkar
const adhkar = [
    "سُبْحَانَ اللهِ وَبِحَمْدِهِ",
    "لا إله إلا الله وحده لا شريك له",
    "اللَّهُمَّ صَلِّ وَسَلِّمْ عَلَى نَبِيِّنَا مُحَمَّدٍ",
    "أستغفر الله",
    "سبحان الله والحمد لله ولا إله إلا الله والله أكبر",
    "لا حول ولا قوة إلا بالله",
    "اللهم إني أسألك العفو والعافية",
    "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ",
    "حَسْبِيَ اللَّهُ لَا إِلَهَ إِلَّا هُوَ عَلَيْهِ تَوَكَّلْتُ وَهُوَ رَبُّ الْعَرْشِ الْعَظِيمِ",
    "اللَّهُمَّ أَعِنِّي عَلَى ذِكْرِكَ وَشُكْرِكَ وَحُسْنِ عِبَادَتِكَ"
];

const AdhkarToast = () => {
    useEffect(() => {
        // Function to show a random dhikr
        const showDhikr = () => {
            const randomIndex = Math.floor(Math.random() * adhkar.length);
            toast(adhkar[randomIndex], {
                duration: 5000,
                icon: '📖',
                iconTheme: {
                    primary: '#1a365d',
                    secondary: '#ffffff',
                },
                ariaProps: {
                    role: 'status',
                    'aria-live': 'polite',
                },
                
                position: 'top-left',
                style: {
                    background: '#ffffff',
                    color: '#1a365d',
                    padding: '16px 24px',
                    borderRadius: '12px',
                    fontFamily: 'Arial',
                    fontSize: '18px',
                    direction: 'rtl',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                    border: '1px solid #e2e8f0',
                    minWidth: '300px',
                    textAlign: 'center',
                    lineHeight: '1.5'
                },
            });
        };

        // Show first dhikr immediately
        showDhikr();

        // Set interval to show dhikr every 5 minutes
        const interval = setInterval(showDhikr, 1 * 60 * 1000);

        // Cleanup interval on component unmount
        return () => clearInterval(interval);
    }, []);

    return null; // This component doesn't render anything
};

export default AdhkarToast;
