import { motion } from "framer-motion";

export default function Clouds() {

    const clouds = [
        { top: 60, left: -200, scale: 1 },
        { top: 180, left: -500, scale: 0.8 },
        { top: 120, left: -900, scale: 1.3 }
    ];

    return (

        <>
            {clouds.map((cloud, index) => (

                <motion.div
                    key={index}

                    initial={{
                        x: cloud.left
                    }}

                    animate={{
                        x: window.innerWidth + 400
                    }}

                    transition={{
                        duration: 45 + index * 10,
                        repeat: Infinity,
                        ease: "linear"
                    }}

                    className="absolute opacity-60"
                    style={{
                        top: cloud.top,
                        scale: cloud.scale
                    }}
                >

                    <div className="w-48 h-16 bg-white rounded-full"/>

                </motion.div>

            ))}
        </>

    );

}