import React from "react";
import Image from "next/image";

type ImageButtonProps = {
    onClick: () => void;
    imageSrc?: string;
    imageAlt?: string;
    className?: string;
};

const ImageButton: React.FC<ImageButtonProps> = (
    { onClick, imageSrc, imageAlt = "Button Image", className = "" },
) => {
    return (
        <button
            onClick={onClick}
            className={className}
        >
            {imageSrc && (
                <Image
                    src={imageSrc}
                    alt={imageAlt}
                    width={20}
                    height={20}
                    className="opacity-70 focus:outline-none"
                />
            )}
        </button>
    );
};

export default ImageButton;
