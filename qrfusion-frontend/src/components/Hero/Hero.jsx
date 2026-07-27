import { motion } from "framer-motion";

export default function Hero() {
  return (

    <section
      className="
      h-screen
      flex
      flex-col
      justify-center
      items-center
      text-center
      px-10"
    >

      <motion.h1

        initial={{ opacity:0, y:40 }}
        animate={{ opacity:1, y:0 }}
        transition={{ duration:1 }}

        className="
        text-7xl
        text-white
        font-bold"
      >

        Navigate Your
        <br/>
        QR Journey

      </motion.h1>

      <motion.p

        initial={{ opacity:0 }}
        animate={{ opacity:1 }}
        transition={{ delay:0.5 }}

        className="
        text-xl
        text-gray-200
        mt-6
        max-w-2xl"
      >

        Inspired by pirates,
        powered by creativity,
        built for beautiful QR codes.

      </motion.p>

    </section>

  );
}