import React from 'react';
import "./HomeFront.css";
import Typewriter from "typewriter-effect";

const HomeFront = () => {
    return (
        <div className="HomeFront">
            <div className="Content">
                <div className='Ai'>Emotion Detection AI:</div>
                <div className='Motto'>
                    <h1>
                        <Typewriter
                            options={{
                                strings: ['The Analyzing', "&", 'Interpreting', 'Emotions', 'AI'],
                                autoStart: true,
                                loop: true,
                            }}
                            typeSpeed={40}
                            backSpeed={60}
                            loop
                        />

                    </h1>
                </div>
                <div>
                </div>
            </div>
        </div>
    );
};

export default HomeFront;
