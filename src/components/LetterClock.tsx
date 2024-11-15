import React, { useState, useEffect } from 'react';

const BOARD_LETTERS = [
  "T","W","E","N","T","Y","T","E","N",
  "S","Q","U","A","R","T","E","R","Y",
  "F","I","V","E","R","T","O","N","E",
  "H","A","L","F","U","P","A","S","T",
  "T","W","E","L","V","E","S","I","X",
  "T","W","O","N","E","I","G","H","T",
  "T","H","R","E","E","F","I","V","E",
  "N","I","N","E","L","E","V","E","N",
  "F","O","U","R","S","E","V","E","N"
];

const HOURS = "48,49,50|46,47,48|55,56,57,58,59|73,74,75,76|60,61,62,63|43,44,45|77,78,79,80,81|50,51,52,53,54|64,65,66,67|54,63,72|67,68,69,70,71,72|37,38,39,40,41,42".split('|').map(h => h.split(',').map(Number));
const MINUTES = "19,20,21,22|7,8,9|11,12,13,14,15,16,17|1,2,3,4,5,6|1,2,3,4,5,6,19,20,21,22|28,29,30,31".split('|').map(m => m.split(',').map(Number));
const CONNECTORS = "24,25|33,34,35,36".split('|').map(c => c.split(',').map(Number));

const LetterClock: React.FC = () => {
  const [highlightedIndices, setHighlightedIndices] = useState<number[]>([]);

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const hours = now.getHours() % 12 || 12;
      const minutes = now.getMinutes();
      const roundedMinutes = Math.round(minutes / 5) * 5;

      let indices: number[] = [];

      // Hour
      const hourIndex = (hours - 1 + (minutes > 32 ? 1 : 0)) % 12;
      indices = indices.concat(HOURS[hourIndex]);

      // Minute
      if (roundedMinutes > 0 && roundedMinutes < 60) {
        let minuteIndex: number;
        if (roundedMinutes <= 30) {
          minuteIndex = Math.floor(roundedMinutes / 5) - 1;
        } else {
          minuteIndex = Math.floor((60 - roundedMinutes) / 5) - 1;
        }
        if (minuteIndex >= 0 && minuteIndex < MINUTES.length) {
          indices = indices.concat(MINUTES[minuteIndex]);
        }

        // Connector (only if not a whole hour)
        if (roundedMinutes !== 0) {
          // Use the second connector ("PAST") for minutes 5 to 30, and the first connector ("TO") for minutes 35 to 55
          indices = indices.concat(CONNECTORS[roundedMinutes > 30 ? 0 : 1]);
        }
      }

      setHighlightedIndices(indices);
    };

    updateClock();
    const interval = setInterval(updateClock, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid grid-cols-9 gap-1 bg-black p-4 rounded-lg">
      {BOARD_LETTERS.map((letter, index) => (
        <div
          key={index}
          className={`w-10 h-10 flex items-center justify-center text-2xl font-bold rounded ${
            highlightedIndices.includes(index + 1) ? 'bg-yellow-400 text-black' : 'bg-gray-800 text-gray-400'
          }`}
        >
          {letter}
        </div>
      ))}
    </div>
  );
};

export default LetterClock;