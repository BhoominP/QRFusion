import { motion } from "framer-motion";

export default function Waves() {

    return (

        <motion.div

            animate={{
                x: [-50,0,-50]
            }}

            transition={{
                duration:10,
                repeat:Infinity,
                ease:"easeInOut"
            }}

            className="
            absolute
            bottom-0
            w-[200%]
            h-44"

        >

            <svg
                viewBox="0 0 1440 320"
                className="w-full h-full"
            >

                <path

                    fill="#0f3d91"

                    d="M0,160L60,170C120,180,240,200,360,192C480,184,600,148,720,149.3C840,151,960,191,1080,197.3C1200,203,1320,173,1380,157.3L1440,141L1440,320L0,320Z"

                />

            </svg>

        </motion.div>

    );

}