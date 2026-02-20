import { useState, useEffect } from 'react';

const ONBOARDING_KEY = 'hasSeenOnboarding';

export function useOnboardingModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check if user has seen the onboarding modal
    const hasSeenOnboarding = localStorage.getItem(ONBOARDING_KEY);
    if (!hasSeenOnboarding) {
      setIsOpen(true);
    }
  }, []);

  const dismiss = () => {
    localStorage.setItem(ONBOARDING_KEY, 'true');
    setIsOpen(false);
  };

  return {
    isOpen,
    dismiss,
  };
}
