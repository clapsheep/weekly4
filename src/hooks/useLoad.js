import { useState, useEffect } from 'react';

export default function useLoad() {
  const [main, setMain] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setMain(false);
    }, 2000);
  }, []);
  return main;
}
