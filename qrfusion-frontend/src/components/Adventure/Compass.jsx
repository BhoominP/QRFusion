import { motion } from "framer-motion";
import { Compass } from "lucide-react";

export default function CompassBackground(){

    return(

        <motion.div

            animate={{
                rotate:360
            }}

            transition={{
                duration:40,
                repeat:Infinity,
                ease:"linear"
            }}

            className="
            absolute
            left-16
            bottom-24
            opacity-10"

        >

            <Compass size={220}/>

        </motion.div>

    );

}