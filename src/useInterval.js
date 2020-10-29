import React, { useState, useEffect, useRef } from 'react';


// Dan Abramov's take on an Interval Hook...
// See https://overreacted.io/making-setinterval-declarative-with-react-hooks/
// the point is that the callback(ref) is modifiable whereas the effect is static

export function useInterval(callback, delay) {
  const savedCallback = useRef();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

