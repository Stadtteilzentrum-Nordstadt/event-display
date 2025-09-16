"use client";

import { useEffect, useState } from "react";

export default function ScaleController({ children }: { children: React.ReactNode }) {
    const [scale, setScale] = useState(1);

    useEffect(() => {
        const updateScale = () => {
            // Nur URL-Parameter verwenden, keine automatische Erkennung
            const urlParams = new URLSearchParams(window.location.search);
            const scaleParam = urlParams.get('scale');

            if (scaleParam) {
                const parsedScale = parseFloat(scaleParam);
                if (!isNaN(parsedScale)) {
                    setScale(Math.max(0.5, Math.min(3, parsedScale)));
                }
            } else {
                setScale(1); // Standard-Skalierung
            }
        };

        updateScale();
        // Aktualisiere bei URL-Änderungen (falls Navigation ohne Reload)
        window.addEventListener('popstate', updateScale);

        return () => window.removeEventListener('popstate', updateScale);
    }, []);

    return (
        <div className="contents" style={{ fontSize: `${scale * 100}%` }}>
            {children}
        </div>
    );
}
