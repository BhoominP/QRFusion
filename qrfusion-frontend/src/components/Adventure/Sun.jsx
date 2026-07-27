import { motion } from "framer-motion";

export default function Sun() {

    return (

        <motion.div

            animate={{
                scale:[1,1.05,1],
                opacity:[0.9,1,0.9]
            }}

            transition={{
                duration:6,
                repeat:Infinity
            }}

            className="
            absolute
            left-1/2
            top-24
            -translate-x-1/2
            w-72
            h-72
            rounded-full"

            style={{
                background:
                "radial-gradient(circle,#FFD65A 0%,#FFA640 45%,transparent 70%)",
                filter:"blur(8px)"
            }}

        />

    );

}