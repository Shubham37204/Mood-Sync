import React from 'react';
import logo1 from "../images/logo1.jpg";
import Angry from "../images/Angry.jpg";
import logo3 from "../images/logo3.jpg";
import logo4 from "../images/logo4.jpg";
import "./Mode.css"

const Mood = () => {
    const ImageBox = ({ src, alt, text }) => {
        return (
            <div className="image-box">
                <div className="image-container">
                    <img className="image" src={src} alt={alt} />
                    <div className="overlay">{text}</div>
                    <div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="mood-container">
            <div className="mood-title">
                <h1 id="h1">DIFFERENT MOODS</h1>
                <p>The AI DeepFace captures a myriad of emotions through facial expressions: melancholy shadows behind downturned lips, curiosity flickering in widened eyes, and a hint of apprehension in furrowed brows. Each pixel holds a story—joy, sorrow, anticipation—forming a mosaic of human sentiment, unveiling the complexity of the human experience</p>
            </div>
            <div className="images">
                <ImageBox src={logo1} alt="Image 1" text="Confused" />
                <ImageBox src={Angry} alt="Image 2" text="Angry" />
                <ImageBox src={logo3} alt="Image 3" text="Happy" />
                <ImageBox src={logo4} alt="Image 4" text="surprised" />
            </div>
        </div>
    );
};

export default Mood;

