import { motion } from "framer-motion";
import { ShipWheel } from "lucide-react";

export default function Ship(){

    return(

        <motion.div

            animate={{
                y:[0,-8,0],
                rotate:[0,1,-1,0]
            }}

            transition={{
                duration:5,
                repeat:Infinity
            }}

            className="
            absolute
            bottom-40
            right-24"

        >

            <ShipWheel
                size={90}
                className="text-yellow-300 drop-shadow-2xl"
            />

        </motion.div>

    );

}