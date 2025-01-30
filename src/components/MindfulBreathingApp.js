import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import inhaleSound from '../assets/inhale.mp3';
import exhaleSound from '../assets/exhale.mp3';
import holdSound from '../assets/hold.mp3';
import { useAuth } from '../context/AuthContext';

const translations = {
    en: {
        title: "Mindful Breathing",
        inhale: "Inhale",
        hold: "Hold",
        exhale: "Exhale",
        start: "Begin Journey",
        stop: "Pause Journey",
        reset: "New Journey",
        boxBreathing: "Box Breathing",
        boxBreathingDesc: "Equal duration for inhale, hold, exhale, and hold. Reduces stress and improves focus.",
        technique478: "4-7-8 Technique",
        technique478Desc: "Inhale for 4, hold for 7, exhale for 8. Reduces anxiety and aids sleep.",
        deepBreathing: "Deep Breathing",
        deepBreathingDesc: "Slow, deep breaths. Reduces stress and promotes relaxation.",
        selectTechnique: "Choose Your Path",
        rounds: "Cycles",
        currentRound: "Current Cycle",
        completed: "Journey Complete",
        estimatedTime: "Estimated time",
        minutes: "min",
        breathingQuiz: "Breathing Assessment",
        question: "Question",
        of: "of",
        yourRecommendation: "Your Personalized Path",
        howToPractice: "How to practice:",
        startExercise: "Begin Your Journey",
        retakeQuiz: "Reassess Your Needs",
        takeQuiz: "Assess Your Needs",
        btn_cerrar: "Log Out",
        alternateNostril: "Alternate Nostril Breathing",
        alternateNostrilDesc: "Balances the left and right hemispheres of the brain, promoting calmness and mental clarity.",
        bellowsBreath: "Bellows Breath (Bhastrika)",
        bellowsBreathDesc: "Energizing breath that increases alertness and primes your body for exercise.",
        lionsBreath: "Lion's Breath",
        lionsBreathDesc: "Releases tension in the face and chest, and alleviates stress.",
        close: "Close",
        settings: "Settings",
        lightMode: "Light Mode",
        darkMode: "Dark Mode",
        info: "Technique Info",
        skipQuiz: "Skip Quiz",
        alternateNostrilInhaleLeft: "Inhale through left nostril",
        alternateNostrilInhaleRight: "Inhale through right nostril",
        alternateNostrilExhaleLeft: "Exhale through left nostril",
        alternateNostrilExhaleRight: "Exhale through right nostril",
        alternateNostrilHold: "Hold your breath",
        left: "Left",
        right: "Right",
        next: "Next",
        restart: "Restart",
        mute: "Mute",
        unmute: "Unmute"
    },
    es: {
        title: "Respiración Consciente",
        inhale: "Inhalar",
        hold: "Mantener",
        exhale: "Exhalar",
        start: "Comenzar Viaje",
        stop: "Pausar Viaje",
        reset: "Nuevo Viaje",
        boxBreathing: "Respiración Cuadrada",
        boxBreathingDesc: "Duración igual para inhalar, mantener, exhalar y mantener. Reduce el estrés y mejora la concentración.",
        technique478: "Técnica 4-7-8",
        technique478Desc: "Inhalar por 4, mantener por 7, exhalar por 8. Reduce la ansiedad y ayuda a dormir.",
        deepBreathing: "Respiración Profunda",
        deepBreathingDesc: "Respiraciones lentas y profundas. Reduce el estrés y promueve la relajación.",
        selectTechnique: "Elige Tu Camino",
        rounds: "Ciclos",
        currentRound: "Ciclo Actual",
        completed: "Viaje Completado",
        estimatedTime: "Tiempo estimado",
        minutes: "min",
        breathingQuiz: "Prueba de Respiración",
        question: "Pregunta",
        of: "de",
        yourRecommendation: "Tu Camino Personalizado",
        howToPractice: "Cómo practicar:",
        startExercise: "Comienza Tu Viaje",
        retakeQuiz: "Volver a Realizar Prueba",
        takeQuiz: "Realizar Prueba",
        btn_cerrar: "Cerrar Sesión",
        alternateNostril: "Respiración Alterna por Fosas Nasales",
        alternateNostrilDesc: "Equilibra los hemisferios izquierdo y derecho del cerebro, promoviendo la calma y la claridad mental.",
        bellowsBreath: "Respiración de Fuelle (Bhastrika)",
        bellowsBreathDesc: "Respiración energizante que aumenta el estado de alerta y prepara tu cuerpo para el ejercicio.",
        lionsBreath: "Respiración del León",
        lionsBreathDesc: "Libera la tensión en la cara y el pecho, y alivia el estrés.",
        close: "Cerrar",
        settings: "Configuración",
        lightMode: "Modo Claro",
        darkMode: "Modo Oscuro",
        info: "Información de la Técnica",
        skipQuiz: "Saltar Prueba",
        alternateNostrilInhaleLeft: "Inhala por la fosa nasal izquierda",
        alternateNostrilInhaleRight: "Inhala por la fosa nasal derecha",
        alternateNostrilExhaleLeft: "Exhala por la fosa nasal izquierda",
        alternateNostrilExhaleRight: "Exhala por la fosa nasal derecha",
        alternateNostrilHold: "Mantén la respiración",
        left: "Izquierda",
        right: "Derecha",
        next: "Siguiente",
        restart: "Reiniciar",
        mute: "Silenciar",
        unmute: "Activar sonido"
    }
};

const breathingTechniques = {
    boxBreathing: { inhale: 4, hold1: 4, exhale: 4, hold2: 4 },
    technique478: { inhale: 4, hold1: 7, exhale: 8, hold2: 0 },
    deepBreathing: { inhale: 5, hold1: 0, exhale: 5, hold2: 0 },
    alternateNostril: { inhale: 4, hold1: 4, exhale: 4, hold2: 0 },
    bellowsBreath: { inhale: 1, hold1: 0, exhale: 1, hold2: 0 },
    lionsBreath: { inhale: 4, hold1: 0, exhale: 2, hold2: 0 },
};

const questions = [
    {
        question: {
            en: "How's your stress level?",
            es: "¿Cómo está tu nivel de estrés?"
        },
        explanation: {
            en: "Consider your overall feeling of tension and ability to cope.",
            es: "Considera tu sensación general de tensión y capacidad para afrontar situaciones."
        },
        option1: { en: "Low stress", es: "Estrés bajo" },
        option2: { en: "Moderate stress", es: "Estrés moderado" },
        option3: { en: "High stress", es: "Estrés alto" }
    },
    {
        question: {
            en: "How well are you sleeping?",
            es: "¿Qué tan bien estás durmiendo?"
        },
        explanation: {
            en: "Think about your sleep quality and how rested you feel.",
            es: "Piensa en la calidad de tu sueño y qué tan descansado te sientes."
        },
        option1: { en: "Sleeping well", es: "Durmiendo bien" },
        option2: { en: "Average sleep", es: "Sueño promedio" },
        option3: { en: "Poor sleep", es: "Sueño deficiente" }
    },
    {
        question: {
            en: "How often do you feel anxious?",
            es: "¿Con qué frecuencia te sientes ansioso?"
        },
        explanation: {
            en: "Consider feelings of worry or unease in your daily life.",
            es: "Considera sentimientos de preocupación o malestar en tu vida diaria."
        },
        option1: { en: "Rarely anxious", es: "Raramente ansioso" },
        option2: { en: "Sometimes anxious", es: "A veces ansioso" },
        option3: { en: "Often anxious", es: "Frecuentemente ansioso" }
    },
    {
        question: {
            en: "How's your ability to focus?",
            es: "¿Cómo es tu capacidad para concentrarte?"
        },
        explanation: {
            en: "Reflect on your concentration during daily tasks.",
            es: "Reflexiona sobre tu concentración durante las tareas diarias."
        },
        option1: { en: "Good focus", es: "Buena concentración" },
        option2: { en: "Moderate focus", es: "Concentración moderada" },
        option3: { en: "Poor focus", es: "Concentración deficiente" }
    },
    {
        question: {
            en: "How often do you practice relaxation?",
            es: "¿Con qué frecuencia practicas la relajación?"
        },
        explanation: {
            en: "Think about intentional relaxation or mindfulness activities.",
            es: "Piensa en actividades intencionales de relajación o atención plena."
        },
        option1: { en: "Regularly", es: "Regularmente" },
        option2: { en: "Occasionally", es: "Ocasionalmente" },
        option3: { en: "Rarely/Never", es: "Raramente/Nunca" }
    },
    {
        question: {
            en: "How's your energy level?",
            es: "¿Cómo está tu nivel de energía?"
        },
        explanation: {
            en: "Consider your overall feeling of vitality and alertness.",
            es: "Considera tu sensación general de vitalidad y estado de alerta."
        },
        option1: { en: "High energy", es: "Energa alta" },
        option2: { en: "Moderate energy", es: "Energía moderada" },
        option3: { en: "Low energy", es: "Energía baja" }
    },
    {
        question: {
            en: "How balanced do you feel?",
            es: "¿Qué tan equilibrado te sientes?"
        },
        explanation: {
            en: "Think about your mental and emotional balance.",
            es: "Piensa en tu equilibrio mental y emocional."
        },
        option1: { en: "Very balanced", es: "Muy equilibrado" },
        option2: { en: "Somewhat balanced", es: "Algo equilibrado" },
        option3: { en: "Unbalanced", es: "Desequilibrado" }
    },
    {
        question: {
            en: "¿Qué tan tenso te sientes físicamente?",
            es: "¿Qué tan tenso te sientes físicamente?"
        },
        explanation: {
            en: "Consider any physical tension, especially in your face and chest.",
            es: "Considera cualquier tensión física, especialmente en tu cara y pecho."
        },
        option1: { en: "Relaxed", es: "Relajado" },
        option2: { en: "Somewhat tense", es: "Algo tenso" },
        option3: { en: "Very tense", es: "Muy tenso" }
    }
];

const getRecommendation = (score, language) => {
    const recommendations = {
        en: {
            lowScore: {
                technique: "Deep Breathing",
                description: "Slow, deep breaths to reduce stress and promote relaxation.",
                color: "bg-green-500",
                icon: "🌿",
                detailedExplanation: "Your responses suggest you're managing stress well, but there's always room for improvement. Deep breathing can help maintain and enhance your current well-being. It activates your body's relaxation response, reducing stress and promoting calm. Regular practice can improve overall stress resilience and emotional regulation.",
                steps: [
                    "Find a comfortable sitting position",
                    "Breathe in slowly through your nose for 4 seconds",
                    "Hold your breath for 4 seconds",
                    "Exhale slowly through your mouth for 6 seconds",
                    "Repeat for 5-10 minutes"
                ]
            },
            mediumScore: {
                technique: "Box Breathing",
                description: "Equal duration for inhale, hold, exhale, and hold. Reduces stress and improves focus.",
                color: "bg-yellow-500",
                icon: "🔲",
                detailedExplanation: "Your responses indicate moderate levels of stress and potential challenges with focus. Box breathing is ideal as it combines deep breathing benefits with a structured pattern to improve concentration. It's effective for managing acute stress and enhancing mental clarity. Regular practice can help you better handle daily stressors and improve cognitive performance.",
                steps: [
                    "Sit upright in a comfortable position",
                    "Exhale completely",
                    "Inhale through your nose for 4 counts",
                    "Hold your breath for 4 counts",
                    "Exhale through your mouth for 4 counts",
                    "Hold your breath for 4 counts",
                    "Repeat for 4-5 minutes"
                ]
            },
            highScore: {
                technique: "4-7-8 Technique",
                description: "Inhale for 4, hold for 7, exhale for 8. Reduces anxiety and aids sleep.",
                color: "bg-red-500",
                icon: "🕰️",
                detailedExplanation: "Your responses suggest higher levels of stress, potential sleep issues, and frequent anxiety. The 4-7-8 technique is particularly beneficial as it's designed to quickly calm the nervous system and promote relaxation. This method can be especially helpful for reducing anxiety before bed, potentially improving sleep quality. With regular practice, you may find it easier to manage stress, reduce anxious feelings, and develop a greater sense of calm.",
                steps: [
                    "Sit or lie down comfortably",
                    "Place the tip of your tongue behind your upper front teeth",
                    "Exhale completely through your mouth",
                    "Close your mouth and inhale through your nose for 4 counts",
                    "Hold your breath for 7 counts",
                    "Exhale completely through your mouth for 8 counts",
                    "Repeat for 4 full breaths"
                ]
            },
            lowEnergy: {
                technique: "Bellows Breath",
                description: "Energizing breath that increases alertness and primes your body for exercise.",
                color: "bg-yellow-500",
                icon: "⚡",
                detailedExplanation: "Your responses indicate lower energy levels. The Bellows Breath technique, also known as Bhastrika, is an energizing breathing exercise that can help increase your alertness and energy. It's particularly useful when you need a quick boost without resorting to caffeine.",
                steps: [
                    "Sit comfortably with a straight spine",
                    "Take a deep breath in",
                    "Start exhaling and inhaling rapidly through your nose, keeping your mouth closed",
                    "Your belly should expand with each inhalation and contract with each exhalation",
                    "Do this for 10 breaths, then take a deep breath and exhale slowly",
                    "Repeat for 3 rounds"
                ]
            },
            unbalanced: {
                technique: "Alternate Nostril Breathing",
                description: "Balances the left and right hemispheres of the brain, promoting calmness and mental clarity.",
                color: "bg-indigo-500",
                icon: "🧘",
                detailedExplanation: "Your responses suggest you might benefit from a balancing technique. Alternate Nostril Breathing helps to balance the left and right hemispheres of your brain, promoting a sense of calm and mental clarity. This technique is particularly useful for reducing stress and anxiety.",
                steps: [
                    "Sit comfortably with your spine straight",
                    "Place your left hand on your left knee",
                    "Bring your right hand up to your nose",
                    "Use your right thumb to close your right nostril",
                    "Inhale deeply through your left nostril",
                    "Close your left nostril with your ring finger",
                    "Open your right nostril and exhale",
                    "Inhale through the right nostril",
                    "Close the right nostril, open the left nostril and exhale",
                    "This is one cycle. Repeat for 5-10 cycles"
                ]
            },
            tense: {
                technique: "Lion's Breath",
                description: "Releases tension in the face and chest, and alleviates stress.",
                color: "bg-orange-500",
                icon: "🦁",
                detailedExplanation: "Your responses indicate physical tension, particularly in the face and chest areas. The Lion's Breath technique is excellent for releasing tension in these areas. It might feel a bit silly at first, but it's a powerful way to release stress and tension quickly.",
                steps: [
                    "Sit comfortably on your heels, or cross-legged if that's more comfortable",
                    "Place your hands on your knees, spreading your fingers wide",
                    "Take a deep breath in through your nose",
                    "Open your mouth wide, stick out your tongue, and stretch it down towards your chin",
                    "Exhale forcefully, making a 'ha' sound from your chest",
                    "While exhaling, gaze at the spot between your eyebrows or the tip of your nose",
                    "Inhale again through your nose, returning to a neutral face",
                    "Repeat 4-6 times"
                ]
            }
        },
        es: {
            lowScore: {
                technique: "Respiración Profunda",
                description: "Respiraciones lentas y profundas para reducir el estrés y promover la relajación.",
                color: "bg-green-500",
                icon: "🌿",
                detailedExplanation: "Tus respuestas sugieren que estás manejando bien el estrés, pero siempre hay espacio para mejorar. La respiración profunda puede ayudar a mantener y mejorar tu bienestar actual. Activa la respuesta de relajación de tu cuerpo, reduciendo el estrés y promoviendo la calma. La práctica regular puede mejorar la resistencia general al estrés y la regulación emocional.",
                steps: [
                    "Encuentra una posición cómoda sentado",
                    "Inhala lentamente por la nariz durante 4 segundos",
                    "Mantén la respiración durante 4 segundos",
                    "Exhala lentamente por la boca durante 6 segundos",
                    "Repite durante 5-10 minutos"
                ]
            },
            mediumScore: {
                technique: "Respiración Cuadrada",
                description: "Duración igual para inhalar, mantener, exhalar y mantener. Reduce el estrés y mejora la concentración.",
                color: "bg-yellow-500",
                icon: "🔲",
                detailedExplanation: "Tus respuestas indican niveles moderados de estrés y posibles desafíos con la concentración. La respiración cuadrada es ideal ya que combina los beneficios de la respiración profunda con un patrón estructurado para mejorar la concentración. Es efectiva para manejar el estrés agudo y mejorar la claridad mental. La práctica regular puede ayudarte a manejar mejor los factores de estrés diarios y mejorar el rendimiento cognitivo.",
                steps: [
                    "Siéntate erguido en una posición cómoda",
                    "Exhala completamente",
                    "Inhala por la nariz durante 4 tiempos",
                    "Mantén la respiración durante 4 tiempos",
                    "Exhala por la boca durante 4 tiempos",
                    "Mantén la respiración durante 4 tiempos",
                    "Repite durante 4-5 minutos"
                ]
            },
            highScore: {
                technique: "Técnica 4-7-8",
                description: "Inhala por 4, mantén por 7, exhala por 8. Reduce la ansiedad y ayuda a dormir.",
                color: "bg-red-500",
                icon: "🕰️",
                detailedExplanation: "Tus respuestas sugieren niveles más altos de estrés, posibles problemas de sueño y ansiedad frecuente. La técnica 4-7-8 es particularmente beneficiosa ya que está diseñada para calmar rápidamente el sistema nervioso y promover la relajación. Este método puede ser especialmente útil para reducir la ansiedad antes de dormir, potencialmente mejorando la calidad del sueño. Con la práctica regular, es posible que te resulte más fácil manejar el estrés, reducir los sentimientos de ansiedad y desarrollar una mayor sensación de calma.",
                steps: [
                    "Siéntate o acuéstate cómodamente",
                    "Coloca la punta de la lengua detrás de los dientes frontales superiores",
                    "Exhala completamente por la boca",
                    "Cierra la boca e inhala por la nariz durante 4 tiempos",
                    "Mantén la respiración durante 7 tiempos",
                    "Exhala completamente por la boca durante 8 tiempos",
                    "Repite durante 4 respiraciones completas"
                ]
            },
            lowEnergy: {
                technique: "Respiración de Fuelle",
                description: "Respiración energizante que aumenta el estado de alerta y prepara tu cuerpo para el ejercicio.",
                color: "bg-yellow-500",
                icon: "⚡",
                detailedExplanation: "Tus respuestas indican niveles de energía más bajos. La técnica de Respiración de Fuelle, también conocida como Bhastrika, es un ejercicio de respiración energizante que puede ayudar a aumentar tu estado de alerta y energía. Es particularmente útil cuando necesitas un impulso rápido sin recurrir a la cafeína.",
                steps: [
                    "Siéntate cómodamente con la columna recta",
                    "Toma una respiración profunda",
                    "Comienza a exhalar e inhalar rápidamente por la nariz, manteniendo la boca cerrada",
                    "Tu vientre debe expandirse con cada inhalación y contraerse con cada exhalación",
                    "Haz esto durante 10 respiraciones, luego toma una respiración profunda y exhala lentamente",
                    "Repite durante 3 rondas"
                ]
            },
            unbalanced: {
                technique: "Respiración Alterna por Fosas Nasales",
                description: "Equilibra los hemisferios izquierdo y derecho del cerebro, promoviendo la calma y la claridad mental.",
                color: "bg-indigo-500",
                icon: "🧘",
                detailedExplanation: "Tus respuestas sugieren que podrías beneficiarte de una técnica de equilibrio. La Respiración Alterna por Fosas Nasales ayuda a equilibrar los hemisferios izquierdo y derecho de tu cerebro, promoviendo una sensación de calma y claridad mental. Esta técnica es particularmente útil para reducir el estrés y la ansiedad.",
                steps: [
                    "Siéntate cómodamente con la columna recta",
                    "Coloca tu mano izquierda sobre tu rodilla izquierda",
                    "Lleva tu mano derecha a tu nariz",
                    "Usa tu pulgar derecho para cerrar tu fosa nasal derecha",
                    "Inhala profundamente por tu fosa nasal izquierda",
                    "Cierra tu fosa nasal izquierda con tu dedo anular",
                    "Abre tu fosa nasal derecha y exhala",
                    "Inhala por la fosa nasal derecha",
                    "Cierra la fosa nasal derecha, abre la fosa nasal izquierda y exhala",
                    "Esto es un ciclo. Repite durante 5-10 ciclos"
                ]
            },
            tense: {
                technique: "Respiración del León",
                description: "Libera la tensión en la cara y el pecho, y alivia el estrés.",
                color: "bg-orange-500",
                icon: "🦁",
                detailedExplanation: "Tus respuestas indican tensión física, particularmente en las áreas de la cara y el pecho. La técnica de Respiración del León es excelente para liberar la tensión en estas áreas. Puede parecer un poco tonto al principio, pero es una forma poderosa de liberar el estrés y la tensión rápidamente.",
                steps: [
                    "Siéntate cómodamente sobre tus talones, o con las piernas cruzadas si es más cómodo",
                    "Coloca tus manos sobre tus rodillas, extendiendo los dedos",
                    "Toma una respiración profunda por la nariz",
                    "Abre la boca ampliamente, saca la lengua y estírala hacia tu barbilla",
                    "Exhala con fuerza, haciendo un sonido 'ha' desde tu pecho",
                    "Mientras exhalas, mira el punto entre tus cejas o la punta de tu nariz",
                    "Inhala de nuevo por la nariz, volviendo a una expresión neutral",
                    "Repite 4-6 veces"
                ]
            }
        }
    };


    if (score <= 7) {
        return recommendations[language].lowScore;
    } else if (score <= 11) {
        return recommendations[language].mediumScore;
    } else if (score <= 15) {
        return recommendations[language].highScore;
    } else if (score <= 19) {
        return recommendations[language].lowEnergy;
    } else if (score <= 23) {
        return recommendations[language].unbalanced;
    } else {
        return recommendations[language].tense;
    }
};

const MindfulBreathingApp = () => {
    const [language, setLanguage] = useState('es');
    const [showQuiz, setShowQuiz] = useState(true);
    const [technique, setTechnique] = useState('boxBreathing');
    const [isActive, setIsActive] = useState(false);
    const [phase, setPhase] = useState('inhale');
    const [timeLeft, setTimeLeft] = useState(4);
    const [progress, setProgress] = useState(0);
    const [totalRounds, setTotalRounds] = useState(20);
    const [currentRound, setCurrentRound] = useState(1);
    const [showDescription, setShowDescription] = useState(true);
    const [isCompleted, setIsCompleted] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [score, setScore] = useState(0);
    const [recommendation, setRecommendation] = useState(null);
    const [currentNostril, setCurrentNostril] = useState('right');
    const [isMuted, setIsMuted] = useState(false);
    const [audioContext, setAudioContext] = useState(null);
    const [audioBuffers, setAudioBuffers] = useState({});
    const [currentAudio, setCurrentAudio] = useState(null);
    const [showInfoFor, setShowInfoFor] = useState(null);
    const [volume, setVolume] = useState(0.5);
    const [storedRecommendation, setStoredRecommendation] = useState(null);
    const [darkMode, setDarkMode] = useState(false);
    const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
    const [isInfoModalVisible, setIsInfoModalVisible] = useState(false);
    const [lastPlayedSound, setLastPlayedSound] = useState(null);

    const t = translations[language];
    const animationRef = useRef(null);

    const estimatedTime = useMemo(() => {
        const selectedTechnique = breathingTechniques[technique];
        const cycleTime = Object.values(selectedTechnique).reduce((a, b) => a + b, 0);
        const totalTime = cycleTime * totalRounds;
        return Math.ceil(totalTime / 60);
    }, [technique, totalRounds]);
    const getInstructions = () => {
        switch (technique) {
            case 'alternateNostril':
                const currentInstruction = phase === 'inhale'
                    ? t[`alternateNostrilInhale${currentNostril.charAt(0).toUpperCase() + currentNostril.slice(1)}`]
                    : phase === 'exhale'
                        ? t[`alternateNostrilExhale${(currentNostril === 'right' ? 'Left' : 'Right')}`]
                        : t.alternateNostrilHold;

                const nextPhase = phase === 'inhale' ? 'hold' : phase === 'hold' ? 'exhale' : 'inhale';
                const nextNostril = phase === 'exhale' ? (currentNostril === 'right' ? 'left' : 'right') : currentNostril;
                const nextInstruction = nextPhase === 'inhale'
                    ? t[`alternateNostrilInhale${nextNostril.charAt(0).toUpperCase() + nextNostril.slice(1)}`]
                    : nextPhase === 'exhale'
                        ? t[`alternateNostrilExhale${(nextNostril === 'right' ? 'Left' : 'Right')}`]
                        : t.alternateNostrilHold;

                return { current: currentInstruction, next: nextInstruction };
            case 'bellowsBreath':
                return { current: phase === 'inhale' ? t.inhale : t.exhale, next: phase === 'inhale' ? t.exhale : t.inhale };
            case 'lionsBreath':
                return { current: phase === 'inhale' ? t.inhale : t.exhale, next: phase === 'inhale' ? t.exhale : t.inhale };
            default:
                return { current: t[phase], next: t[phase === 'inhale' ? 'hold' : phase === 'hold' ? 'exhale' : 'inhale'] };
        }
    };

    useEffect(() => {
        const context = new (window.AudioContext || window.webkitAudioContext)();
        setAudioContext(context);

        const loadSound = async (url, name) => {
            const response = await fetch(url);
            const arrayBuffer = await response.arrayBuffer();
            const audioBuffer = await context.decodeAudioData(arrayBuffer);
            return audioBuffer;
        };

        Promise.all([
            loadSound(inhaleSound, 'inhale'),
            loadSound(exhaleSound, 'exhale'),
            loadSound(holdSound, 'hold')
        ]).then(buffers => {
            setAudioBuffers({
                inhale: buffers[0],
                exhale: buffers[1],
                hold: buffers[2]
            });
            const gainNode = context.createGain();
            gainNode.gain.setValueAtTime(0.5, context.currentTime);
            gainNode.connect(context.destination);
        }).catch(error => console.error('Error loading audio:', error));
    }, []);

    const playSound = (soundName) => {
        if (audioContext && audioBuffers[soundName] && !isMuted && soundName !== lastPlayedSound) {
            if (currentAudio) {
                currentAudio.stop();
            }
            const source = audioContext.createBufferSource();
            const gainNode = audioContext.createGain();
            source.buffer = audioBuffers[soundName];
            source.connect(gainNode);
            gainNode.connect(audioContext.destination);
            gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
            source.start();
            setCurrentAudio(source);
            setLastPlayedSound(soundName);
        }
    };

    const handleVolumeChange = (event) => {
        const newVolume = parseFloat(event.target.value);
        setVolume(newVolume);
        if (audioContext) {
            const gainNode = audioContext.createGain();
            gainNode.gain.setValueAtTime(newVolume, audioContext.currentTime);
        }
    };

    const toggleMute = () => {
        setIsMuted(!isMuted);
    };

    useEffect(() => {
        let animationFrameId;
        let startTime;
        let phaseChangeTimeout;

        const animate = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const elapsedTime = timestamp - startTime;
            const totalTime = breathingTechniques[technique][phase] * 1000;

            if (elapsedTime < totalTime) {
                setTimeLeft(Math.ceil((totalTime - elapsedTime) / 1000));
                setProgress(elapsedTime / totalTime);
                animationFrameId = requestAnimationFrame(animate);
            } else {
                const phases = ['inhale', 'hold1', 'exhale', 'hold2'];
                const currentPhaseIndex = phases.indexOf(phase);
                const nextPhaseIndex = (currentPhaseIndex + 1) % phases.length;
                const nextPhase = phases[nextPhaseIndex];

                if (phaseChangeTimeout) {
                    clearTimeout(phaseChangeTimeout);
                }

                phaseChangeTimeout = setTimeout(() => {
                    setPhase(nextPhase);
                    if (nextPhase !== phase) {
                        playSound(nextPhase.includes('hold') ? 'hold' : nextPhase);
                    }

                    if (nextPhase === 'inhale' && phase === 'hold2') {
                        if (currentRound < totalRounds) {
                            setCurrentRound(prev => prev + 1);
                        } else {
                            setIsCompleted(true);
                            setIsActive(false);
                            return;
                        }
                    }

                    setTimeLeft(breathingTechniques[technique][nextPhase]);
                    if (technique === 'alternateNostril' && nextPhase === 'inhale') {
                        setCurrentNostril(prev => prev === 'right' ? 'left' : 'right');
                    }

                    startTime = null;
                    animationFrameId = requestAnimationFrame(animate);
                }, 50);
            }
        };

        if (isActive && !isCompleted) {
            playSound(phase.includes('hold') ? 'hold' : phase);
            animationFrameId = requestAnimationFrame(animate);
        }

        return () => {
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
            }
            if (phaseChangeTimeout) {
                clearTimeout(phaseChangeTimeout);
            }
            if (currentAudio) {
                currentAudio.stop();
            }
        };
    }, [isActive, phase, technique, currentRound, totalRounds, isCompleted, currentNostril, isMuted]);

    const toggleActive = () => {
        if (audioContext && audioContext.state === 'suspended') {
            audioContext.resume();
        }
        if (isCompleted) {
            resetExercise();
        } else {
            setIsActive(!isActive);
            if (!isActive) {
                setPhase('inhale');
                setTimeLeft(breathingTechniques[technique].inhale);
                setProgress(0);
                setShowDescription(false);
            }
        }
    };

    const resetExercise = () => {
        setIsActive(false);
        setIsCompleted(false);
        setCurrentRound(1);
        setPhase('inhale');
        setTimeLeft(breathingTechniques[technique].inhale);
        setProgress(0);
        setShowDescription(true);
        if (currentAudio) {
            currentAudio.stop();
        }
    };

    const getCircleStyle = () => {
        let scale, opacity;
        switch (phase) {
            case 'inhale':
                scale = 0.8 + (progress * 0.2);
                opacity = 0.3 + (progress * 0.4);
                break;
            case 'exhale':
                scale = 1 - (progress * 0.2);
                opacity = 0.7 - (progress * 0.4);
                break;
            case 'hold1':
                scale = 1;
                opacity = 0.7;
                break;
            case 'hold2':
                scale = 0.8;
                opacity = 0.3;
                break;
            default:
                scale = 0.8;
                opacity = 0.3;
        }
        return {
            transform: `scale(${scale})`,
            opacity: opacity,
        };
    };

    const handleAnswer = (value) => {
        const newScore = score + value;
        setScore(newScore);
        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
        } else {
            const newRecommendation = getRecommendation(newScore, language);
            setRecommendation(newRecommendation);
            setStoredRecommendation(newRecommendation);
            setTechnique(getTechniqueFromRecommendation(newRecommendation.technique));
        }
    };

    const getTechniqueFromRecommendation = (recommendedTechnique) => {
        switch (recommendedTechnique) {
            case "Deep Breathing":
            case "Respiración Profunda":
                return "deepBreathing";
            case "Box Breathing":
            case "Respiración Cuadrada":
                return "boxBreathing";
            case "4-7-8 Technique":
            case "Técnica 4-7-8":
                return "technique478";
            case "Bellows Breath":
            case "Respiración de Fuelle":
                return "bellowsBreath";
            case "Alternate Nostril Breathing":
            case "Respiración Alterna por Fosas Nasales":
                return "alternateNostril";
            case "Lion's Breath":
            case "Respiración del León":
                return "lionsBreath";
            default:
                return "boxBreathing";
        }
    };

    const startRecommendedExercise = () => {
        setShowQuiz(false);
        resetExercise();
        setIsActive(true);
        setPhase('inhale');
        setTimeLeft(breathingTechniques[technique].inhale);
        setProgress(0);
        setShowDescription(false);
    };

    const handleRestart = () => {
        setCurrentQuestion(0);
        setScore(0);
        setRecommendation(null);
        setShowQuiz(true);
    };

    const AnswerButton = ({ color, label, onClick }) => (
        <button
            onClick={onClick}
            className={`w-full h-24 px-4 rounded-full text-white transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-opacity-50 flex items-center justify-center ${color === 'light'
                    ? 'bg-blue-300 hover:bg-blue-400 focus:ring-blue-200'
                    : color === 'medium'
                        ? 'bg-blue-500 hover:bg-blue-600 focus:ring-blue-400'
                        : 'bg-blue-700 hover:bg-blue-800 focus:ring-blue-600'
                }`}
        >
            <span className="text-center text-sm">{label}</span>
        </button>
    );

    const renderQuiz = () => (
        <div
            className={`flex min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gradient-to-br from-blue-50 to-blue-100 text-gray-800'} font-sans`}
            onClick={closeSideMenu}
        >
            {/* Main Content */}
            <div className="flex-1 p-4">
                <div className="flex flex-col items-center justify-center min-h-screen">
                    <div className="flex items-center justify-center w-full mb-8">
                        <h1 className={`text-4xl font-light ${darkMode ? 'text-white' : 'text-blue-800'}`}>{t.title}</h1>
                        <button
                            onClick={() => setIsSideMenuOpen(true)}
                            aria-label="settings"
                            className={`ml-4 p-2 rounded-full ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} hover:bg-opacity-80 transition-colors duration-300`}
                        >
                            ⚙️
                        </button>
                    </div>

                    <div className={`w-full max-w-md ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg overflow-hidden`}>
                        <div className={`${darkMode ? 'bg-blue-600' : 'bg-blue-500'} p-6 text-white`}>
                            <h2 className="text-xl font-bold">{t.breathingQuiz}</h2>
                            <p className="mt-1 text-sm">{t.question} {currentQuestion + 1} {t.of} {questions.length}</p>
                        </div>
                        <div className="p-6">
                            <p className={`text-lg mb-2 font-medium text-center ${darkMode ? 'text-white' : 'text-gray-800'}`}>{questions[currentQuestion].question[language]}</p>
                            <p className={`text-sm mb-6 text-center ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{questions[currentQuestion].explanation[language]}</p>
                            <div className="grid grid-cols-3 gap-4 mb-6">
                                <AnswerButton
                                    color="light"
                                    label={questions[currentQuestion].option1[language]}
                                    onClick={() => handleAnswer(1)}
                                />
                                <AnswerButton
                                    color="medium"
                                    label={questions[currentQuestion].option2[language]}
                                    onClick={() => handleAnswer(2)}
                                />
                                <AnswerButton
                                    color="dark"
                                    label={questions[currentQuestion].option3[language]}
                                    onClick={() => handleAnswer(3)}
                                />
                            </div>
                        </div>
                        <div className="px-6 pb-6">
                            <div className={`w-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full h-2 overflow-hidden`}>
                                <div
                                    className={`${darkMode ? 'bg-blue-500' : 'bg-blue-600'} h-2 rounded-full transition-all duration-300 ease-in-out`}
                                    style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={() => {
                            setShowQuiz(false);
                            setTechnique('boxBreathing');
                        }}
                        className={`mt-6 px-6 py-2 rounded-full ${darkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'
                            } hover:bg-blue-600 transition-colors duration-300`}
                    >
                        {t.skipQuiz}
                    </button>
                </div>
            </div>

            {/* Right Side Menu */}
            <div className={`fixed inset-y-0 right-0 transform ${isSideMenuOpen ? 'translate-x-0' : 'translate-x-full'} ${darkMode ? 'bg-gray-800' : 'bg-white'} w-64 transition duration-300 ease-in-out z-30 side-menu`}>
                <div className="p-6 flex flex-col h-full">
                    <h2 className={`text-2xl font-semibold mb-6 ${darkMode ? 'text-white' : 'text-gray-800'}`}>{t.settings}</h2>
                    <div className="space-y-4 flex-grow">
                        <button
                            onClick={() => setLanguage(lang => lang === 'en' ? 'es' : 'en')}
                            className={`w-full px-4 py-2 rounded-full text-sm transition-colors duration-300 ${darkMode ? 'bg-blue-700 hover:bg-blue-600 text-white' : 'bg-blue-300 hover:bg-blue-400 text-gray-800'
                                }`}
                        >
                            {language === 'en' ? 'Español' : 'English'}
                        </button>
                        <button
                            onClick={toggleDarkMode}
                            className={`w-full px-4 py-2 rounded-full text-sm transition-colors duration-300 ${darkMode ? 'bg-blue-500 hover:bg-blue-400 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white'
                                }`}
                        >
                            {darkMode ? t.lightMode : t.darkMode}
                        </button>
                        <button
                            onClick={() => {
                                setShowInfoFor(technique);
                                setIsInfoModalVisible(true);
                            }}
                            className={`w-full px-4 py-2 rounded-full text-sm transition-colors duration-300 ${darkMode ? 'bg-blue-300 hover:bg-blue-200 text-gray-800' : 'bg-blue-700 hover:bg-blue-800 text-white'
                                }`}
                        >
                            {t.info}
                        </button>
                        <div className="flex items-center justify-between">
                            <button
                                onClick={toggleMute}
                                className={`p-2 rounded-full transition-colors duration-300 ${darkMode
                                        ? 'bg-blue-800 hover:bg-blue-700 text-white'
                                        : 'bg-blue-500 hover:bg-blue-600 text-gray-800'
                                    }`}
                            >
                                {isMuted ? '🔇' : '🔊'}
                            </button>
                            <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.01"
                                value={volume}
                                onChange={handleVolumeChange}
                                className="w-24 appearance-none bg-gray-200 h-2 rounded-full"
                                style={{
                                    background: `linear-gradient(to right, ${getVolumeColor(volume)} 0%, ${getVolumeColor(volume)} ${volume * 100}%, #e5e7eb ${volume * 100}%, #e5e7eb 100%)`,
                                }}
                            />
                        </div>
                    </div>
                    <button
                        onClick={handleRestart}
                        className={`w-full mt-auto px-4 py-2 rounded-full text-sm transition-colors duration-300 ${darkMode ? 'bg-blue-300 hover:bg-blue-200 text-gray-800' : 'bg-blue-700 hover:bg-blue-800 text-white'
                            }`}
                    >
                        {t.takeQuiz}
                    </button>
                    <button
                        onClick={logout}
                        className={`w-full mt-4 px-4 py-2 rounded-full text-sm transition-colors duration-300 ${darkMode ? 'bg-red-600 hover:bg-red-700' : 'bg-red-500 hover:bg-red-600'
                            } text-white`}
                    >                        
                        {t.btn_cerrar}
                    </button>
                </div>
            </div>
        </div>
    );

    const renderRecommendation = () => (
        <div className={`flex flex-col items-center justify-center min-h-screen p-4 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gradient-to-br from-sky-50 to-indigo-100 text-gray-800'} font-sans`}>
            <h1 className="text-4xl font-light mb-8">{t.title}</h1>

            <div className="mb-4 flex items-center">
                <button
                    onClick={() => setLanguage(lang => lang === 'en' ? 'es' : 'en')}
                    className={`${darkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-600'} px-3 py-1 rounded-full text-sm hover:bg-gray-100 transition-colors duration-300 mr-2`}
                >
                    {language === 'en' ? 'Español' : 'English'}
                </button>
                <button
                    onClick={toggleDarkMode}
                    className={`${darkMode ? 'bg-yellow-400 text-gray-900' : 'bg-gray-800 text-white'} p-2 rounded-full hover:opacity-90 transition-opacity duration-300`}
                >
                    {darkMode ? '☀️' : ''}
                </button>
            </div>

            <div className={`w-full max-w-md ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg overflow-hidden`}>
                <div className={`${recommendation.color} p-6 text-white`}>
                    <h2 className="text-2xl font-bold">{t.yourRecommendation}</h2>
                    <span className="text-4xl">{recommendation.icon}</span>
                </div>
                <div className="p-6">
                    <h3 className={`text-xl font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>{recommendation.technique}</h3>
                    <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-4`}>{recommendation.description}</p>
                    <p className={`${darkMode ? 'text-gray-300' : 'text-gray-800'} mb-4 text-sm`}>{recommendation.detailedExplanation}</p>
                    <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-100'} p-4 rounded-lg mb-6`}>
                        <h4 className={`font-semibold mb-2 text-sm ${darkMode ? 'text-white' : 'text-gray-800'}`}>{t.howToPractice}</h4>
                        <ol className={`list-decimal list-inside text-sm ${darkMode ? 'text-gray-300' : 'text-gray-800'}`}>
                            {recommendation.steps.map((step, index) => (
                                <li key={index} className="mb-1">{step}</li>
                            ))}
                        </ol>
                    </div>
                    <button
                        className={`w-full ${recommendation.color} text-white font-bold py-3 px-6 rounded-full hover:opacity-90 transition-opacity duration-300`}
                        onClick={startRecommendedExercise}
                    >
                        {t.startExercise}
                    </button>
                    <button
                        className={`mt-4 w-full ${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-800'} transition-colors duration-300 underline`}
                        onClick={handleRestart}
                    >
                        {t.retakeQuiz}
                    </button>
                </div>
            </div>
        </div>
    );

    const closeInfoModal = useCallback(() => {
        setShowInfoFor(null);
        setIsInfoModalVisible(false);
    }, []);

    const InfoModal = useCallback(({ technique, onClose, isVisible }) => {
        const techniqueInfo = storedRecommendation || getRecommendation(score, language);

        if (!isVisible) return null;

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
                <div className={`${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} p-6 rounded-lg max-w-md max-h-[80vh] overflow-y-auto relative`} onClick={e => e.stopPropagation()}>
                    <h3 className={`text-xl font-semibold mb-2 ${darkMode ? 'text-blue-300' : 'text-blue-800'}`}>{t[technique]}</h3>
                    <p className={`${darkMode ? 'text-blue-300' : 'text-blue-600'} mb-4`}>{techniqueInfo.description}</p>
                    <p className={`${darkMode ? 'text-gray-300' : 'text-gray-800'} mb-4 text-sm`}>{techniqueInfo.detailedExplanation}</p>
                    <div className={`${darkMode ? 'bg-gray-700' : 'bg-blue-100'} p-4 rounded-lg mb-6`}>
                        <h4 className={`font-semibold mb-2 text-sm ${darkMode ? 'text-white' : 'text-gray-800'}`}>{t.howToPractice}</h4>
                        <ol className={`list-decimal list-inside text-sm ${darkMode ? 'text-gray-300' : 'text-gray-800'}`}>
                            {techniqueInfo.steps.map((step, index) => (
                                <li key={index} className="mb-1">{step}</li>
                            ))}
                        </ol>
                    </div>
                    <button
                        onClick={onClose}
                        className={`w-full ${darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white font-bold py-2 px-4 rounded transition-colors duration-300`}
                    >
                        {t.close}
                    </button>
                </div>
            </div>
        );
    }, [darkMode, storedRecommendation, score, language, t]);

    const closeSideMenu = (e) => {
        if (isSideMenuOpen && !e.target.closest('.side-menu') && !e.target.closest('button[aria-label="settings"]')) {
            setIsSideMenuOpen(false);
        }
    };

    const restartExercise = () => {
        setCurrentRound(1);
        setPhase('inhale');
        setTimeLeft(breathingTechniques[technique].inhale);
        setProgress(0);
        setIsActive(false);
        setIsCompleted(false);
    };

    const renderBreathingExercise = () => (
        <div
            className={`flex min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gradient-to-br from-blue-50 to-blue-100 text-gray-800'} font-sans`}
            onClick={closeSideMenu}
        >
            {/* Main Content */}
            <div className="flex-1 p-4">
                <div className="flex flex-col items-center justify-center min-h-screen">
                    <div className="flex items-center justify-center w-full mb-8">
                        <h1 className={`text-4xl font-light ${darkMode ? 'text-white' : 'text-blue-800'}`}>{t.title}</h1>
                        <button
                            onClick={() => setIsSideMenuOpen(true)}
                            aria-label="settings"
                            className={`ml-4 p-2 rounded-full ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} hover:bg-opacity-80 transition-colors duration-300`}
                        >
                            ⚙️
                        </button>
                    </div>

                    <div className="relative mb-4">
                        <select
                            value={technique}
                            onChange={(e) => setTechnique(e.target.value)}
                            className={`appearance-none w-full px-4 py-2 pr-8 rounded-full border ${darkMode
                                    ? 'border-gray-600 bg-gray-800 text-white'
                                    : 'border-blue-200 bg-white/50 text-gray-800'
                                } text-base cursor-pointer`}
                        >
                            {Object.keys(breathingTechniques).map((tech) => (
                                <option key={tech} value={tech}>{t[tech]}</option>
                            ))}
                        </select>
                        <div className={`pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 ${darkMode ? 'text-white' : 'text-gray-700'
                            }`}>
                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                            </svg>
                        </div>
                    </div>

                    <div className="flex items-center mb-4">
                        <label htmlFor="rounds" className={`mr-2 ${darkMode ? 'text-white' : 'text-blue-800'}`}>{t.rounds}:</label>
                        <input
                            id="rounds"
                            type="number"
                            value={totalRounds}
                            onChange={(e) => setTotalRounds(Math.max(1, parseInt(e.target.value)))}
                            className={`w-16 p-1 rounded border ${darkMode
                                    ? 'bg-gray-700 border-gray-600 text-white [&::-webkit-inner-spin-button]:bg-gray-700 [&::-webkit-inner-spin-button]:hover:bg-gray-600 [&::-webkit-inner-spin-button]:text-white'
                                    : 'bg-white border-blue-200 text-gray-800 [&::-webkit-inner-spin-button]:text-gray-800'
                                } text-center [&::-webkit-inner-spin-button]:opacity-100`}
                            min="1"
                        />
                        <span className={`ml-4 text-sm ${darkMode ? 'text-gray-300' : 'text-blue-700'}`}>
                            {t.estimatedTime}: {estimatedTime} {t.minutes}
                        </span>
                    </div>

                    {showDescription && (
                        <div className={`mb-4 p-4 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-blue-100 border-blue-200'} border rounded-lg max-w-md text-center`}>
                            <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-blue-800'}`}>{t[`${technique}Desc`]}</p>
                        </div>
                    )}

                    {technique === 'alternateNostril' ? (
                        <div className="w-64 h-64 rounded-full flex flex-col items-center justify-center mb-8 bg-blue-500 shadow-lg relative overflow-hidden">
                            <div className="absolute inset-0 bg-blue-400 rounded-full transition-all duration-100 ease-linear" style={getCircleStyle()} />
                            <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
                                <div className="text-6xl font-light text-white">{isCompleted ? '✓' : timeLeft}</div>
                                {!isCompleted && (
                                    <div className="text-base text-white mt-2">
                                        {t.currentRound}: {currentRound}/{totalRounds}
                                    </div>
                                )}
                            </div>
                            <div className={`absolute left-0 top-1/2 transform -translate-y-1/2 w-8 h-8 ${phase.includes('hold') ||
                                    (phase === 'inhale' && currentNostril === 'right') ||
                                    (phase === 'exhale' && currentNostril === 'left')
                                    ? 'bg-gray-400'
                                    : 'bg-white'
                                } rounded-full`} />
                            <div className={`absolute right-0 top-1/2 transform -translate-y-1/2 w-8 h-8 ${phase.includes('hold') ||
                                    (phase === 'inhale' && currentNostril === 'left') ||
                                    (phase === 'exhale' && currentNostril === 'right')
                                    ? 'bg-gray-400'
                                    : 'bg-white'
                                } rounded-full`} />
                        </div>
                    ) : (
                        <div className="w-64 h-64 rounded-full flex flex-col items-center justify-center mb-8 bg-blue-500 shadow-lg relative overflow-hidden">
                            <div className="absolute inset-0 bg-blue-400 rounded-full transition-all duration-100 ease-linear" style={getCircleStyle()} />
                            <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
                                <div className="text-6xl font-light text-white">{isCompleted ? '✓' : timeLeft}</div>
                                {!isCompleted && (
                                    <div className="text-base text-white mt-2">
                                        {t.currentRound}: {currentRound}/{totalRounds}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    <div className="flex justify-center items-center w-64 mb-8 space-x-4">
                        {technique === 'alternateNostril' ? (
                            <span className={`text-lg font-semibold text-center ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                                {getInstructions().current}
                            </span>
                        ) : (
                            ['inhale', 'hold', 'exhale'].map((p) => (
                                <span
                                    key={p}
                                    className={`text-lg ${phase.includes(p) ? (darkMode ? 'text-blue-300 font-semibold' : 'text-blue-500 font-semibold') : (darkMode ? 'text-gray-500' : 'text-blue-300')} transition-all duration-300`}
                                >
                                    {t[p]}
                                </span>
                            ))
                        )}
                    </div>

                    {technique === 'alternateNostril' && (
                        <div className={`mb-4 p-4 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-blue-100 border-blue-200'} border rounded-lg max-w-md text-center`}>
                            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-blue-600'}`}>
                                {t.next}: {getInstructions().next}
                            </p>
                        </div>
                    )}

                    <div className="flex space-x-4">
                        <button
                            onClick={toggleActive}
                            className={`px-6 py-3 rounded-full text-base font-medium text-white transition-colors duration-300 ${isActive ? 'bg-red-500' : (isCompleted ? 'bg-green-500' : 'bg-blue-500')
                                }`}
                        >
                            {isCompleted ? t.reset : (isActive ? t.stop : t.start)}
                        </button>

                        {!isActive && !isCompleted && (
                            <button
                                onClick={restartExercise}
                                className={`px-6 py-3 rounded-full text-base font-medium text-white transition-colors duration-300 bg-yellow-500 hover:bg-yellow-600`}
                            >
                                {t.restart}
                            </button>
                        )}
                    </div>

                    <InfoModal
                        technique={showInfoFor}
                        onClose={closeInfoModal}
                        isVisible={isInfoModalVisible}
                    />
                </div>
            </div>

            {/* Right Side Menu */}
            <div className={`fixed inset-y-0 right-0 transform ${isSideMenuOpen ? 'translate-x-0' : 'translate-x-full'} ${darkMode ? 'bg-gray-800' : 'bg-white'} w-64 transition duration-300 ease-in-out z-30 side-menu`}>
                <div className="p-6 flex flex-col h-full">
                    <h2 className={`text-2xl font-semibold mb-6 ${darkMode ? 'text-white' : 'text-gray-800'}`}>{t.settings}</h2>
                    <div className="space-y-4 flex-grow">
                        <button
                            onClick={() => setLanguage(lang => lang === 'en' ? 'es' : 'en')}
                            className={`w-full px-4 py-2 rounded-full text-sm transition-colors duration-300 ${darkMode ? 'bg-blue-700 hover:bg-blue-600 text-white' : 'bg-blue-300 hover:bg-blue-400 text-gray-800'
                                }`}
                        >
                            {language === 'en' ? 'Español' : 'English'}
                        </button>
                        <button
                            onClick={toggleDarkMode}
                            className={`w-full px-4 py-2 rounded-full text-sm transition-colors duration-300 ${darkMode ? 'bg-blue-500 hover:bg-blue-400 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white'
                                }`}
                        >
                            {darkMode ? t.lightMode : t.darkMode}
                        </button>
                        <button
                            onClick={() => {
                                setShowInfoFor(technique);
                                setIsInfoModalVisible(true);
                            }}
                            className={`w-full px-4 py-2 rounded-full text-sm transition-colors duration-300 ${darkMode ? 'bg-blue-300 hover:bg-blue-200 text-gray-800' : 'bg-blue-700 hover:bg-blue-800 text-white'
                                }`}
                        >
                            {t.info}
                        </button>
                        <div className="flex items-center justify-between">
                            <button
                                onClick={toggleMute}
                                className={`p-2 rounded-full transition-colors duration-300 ${darkMode
                                        ? 'bg-blue-800 hover:bg-blue-700 text-white'
                                        : 'bg-blue-500 hover:bg-blue-600 text-gray-800'
                                    }`}
                            >
                                {isMuted ? '🔇' : '🔊'}
                            </button>
                            <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.01"
                                value={volume}
                                onChange={handleVolumeChange}
                                className="w-24 appearance-none bg-gray-200 h-2 rounded-full"
                                style={{
                                    background: `linear-gradient(to right, ${getVolumeColor(volume)} 0%, ${getVolumeColor(volume)} ${volume * 100}%, #e5e7eb ${volume * 100}%, #e5e7eb 100%)`,
                                }}
                            />
                        </div>
                    </div>
                    <button
                        onClick={handleRestart}
                        className={`w-full mt-auto px-4 py-2 rounded-full text-sm transition-colors duration-300 ${darkMode ? 'bg-blue-300 hover:bg-blue-200 text-gray-800' : 'bg-blue-700 hover:bg-blue-800 text-white'
                            }`}
                    >
                        {t.takeQuiz}
                    </button>
                    <button
                        onClick={logout}
                        className={`w-full mt-4 px-4 py-2 rounded-full text-sm transition-colors duration-300 ${darkMode ? 'bg-red-600 hover:bg-red-700' : 'bg-red-500 hover:bg-red-600'
                            } text-white`}
                    >                        
                        {t.btn_cerrar}
                    </button>
                </div>
            </div>
        </div>
    );

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [darkMode]);

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
    };

    const getVolumeColor = (volume) => {
        const hue = 210; // Blue hue
        const saturation = 100;
        const lightness = 70 - (volume * 65); // Starts even darker and changes more dramatically
        return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    };

    const { logout } = useAuth();

    return (
        <div>
            {showQuiz ? (
                recommendation ? renderRecommendation() : renderQuiz()
            ) : (
                renderBreathingExercise()
            )}
           
        </div>
    );
};

export default MindfulBreathingApp;