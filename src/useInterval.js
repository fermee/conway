import React, { useState, useEffect, useRef } from 'react';

export function useInterval(callback, delay) {
  const savedCallback = useRef();

  console.log(savedCallback);
  
  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      console.log("in useInterval");
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

