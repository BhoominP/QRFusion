import { motion } from "framer-motion";

export default function Sparkles() {

    const stars = Array.from({ length: 50 });

    return (

        <>

            {stars.map((_, index)=>(

                <motion.div

                    key={index}

                    animate={{
                        opacity:[0.2,1,0.2],
                        scale:[1,1.6,1]
                    }}

                    transition={{
                        duration:2+Math.random()*3,
                        repeat:Infinity
                    }}

                    className="absolute bg-yellow-200 rounded-full"

                    style={{
                        width:4,
                        height:4,
                        left:Math.random()*100+"%",
                        top:Math.random()*100+"%"
                    }}

                />

            ))}

        </>

    );

}