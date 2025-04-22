"use client";

import { FC, useEffect } from 'react';

export const BackForwardCache: FC = () => {
  useEffect(() => {
    // Empêcher la mise en cache des pages qui nécessitent une mise à jour en temps réel
    const handleBeforeUnload = () => {
      // Nettoyer les ressources si nécessaire
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  return null;
}; 