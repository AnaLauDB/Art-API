/**
 * Componente de imagen optimizada con soporte para Intersection Observer
 * Permite lazy loading mejorado para imágenes fuera del viewport
 * 
 * Uso:
 * <OptimizedImage 
 *   src="https://example.com/image.jpg"
 *   alt="Descripción"
 *   className="my-image"
 * />
 */

import { useEffect, useRef, useState } from "react";
import { generateSrcSet, generateSizes } from "../services/imageServices";

export default function OptimizedImage({
    src,
    alt,
    className = "",
    onLoad = null,
    onError = null,
}) {
    const imgRef = useRef(null);
    const [isIntersecting, setIsIntersecting] = useState(false);

    useEffect(() => {
        if (!imgRef.current) return;

        // Usar Intersection Observer para lazy loading avanzado
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setIsIntersecting(true);
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                rootMargin: "50px", // Cargar 50px antes de que entre en viewport
            }
        );

        observer.observe(imgRef.current);

        return () => {
            if (imgRef.current) {
                observer.unobserve(imgRef.current);
            }
        };
    }, []);

    const srcSet = generateSrcSet(src);
    const sizes = generateSizes();

    return (
        <img
            ref={imgRef}
            src={isIntersecting ? src : "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1 1'%3E%3C/svg%3E"}
            srcSet={isIntersecting ? srcSet : ""}
            sizes={sizes}
            alt={alt}
            className={className}
            loading="lazy"
            decoding="async"
            onLoad={onLoad}
            onError={onError}
        />
    );
}
