import { motion } from "framer-motion";

export default function Birds(){

    return(

        <motion.div

            animate={{
                x:["-20vw","120vw"]
            }}

            transition={{
                duration:18,
                repeat:Infinity,
                ease:"linear"
            }}

            className="
            absolute
            top-32
            text-black/30
            text-4xl"

        >

            🕊️ 🕊️ 🕊️

        </motion.div>

    );

}