import Navbar from "../components/Navbar/Navbar";
import Hero from "../components/Hero/Hero";

import Ocean from "../components/Background/Ocean";
import Waves from "../components/Background/Waves";
import Clouds from "../components/Background/Clouds";

import Sparkles from "../components/Effects/Sparkles";

import Sun from "../components/Adventure/Sun";
import Ship from "../components/Adventure/Ship";
import Island from "../components/Adventure/Island";
import Birds from "../components/Adventure/Birds";
import CompassBackground from "../components/Adventure/Compass";

export default function Home() {

     return (

        <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-sky-500 via-sky-400 to-blue-300">

            <Sun/>

            <Clouds/>

            <Birds/>

            <CompassBackground/>

            <Island/>

            <Ship/>

            <Sparkles/>

            <Navbar/>

            <Hero/>

            <Ocean/>

            <Waves/>

        </div>

    );

}