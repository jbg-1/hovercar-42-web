import { useState } from "react";
import CubeMode from "./CubeMode.jsx";

const CubeWindow = () => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <>
      <div
        className={`${open && "w-full "} ${
          open ? "bg-black/100" : "transparent"
        } absolute duration-300 top-0 h-full right-0 opacity-99 flex items-end `}
      >
        <button onClick={() => setOpen(!open)} className="pr-3 pb-3">
          {open ? (
            <svg
              className="fixed bottom-0"
              width="63"
              height="101"
              viewBox="0 0 63 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M56.3185 51.2339L21.4293 83.5271C20.789 84.1197 19.75 83.6656 19.75 82.7932L19.75 18.2068C19.75 17.3344 20.789 16.8803 21.4293 17.4729L56.3185 49.7661C56.7461 50.1619 56.7461 50.8381 56.3185 51.2339Z"
                fill="white"
                stroke="white"
                strokeWidth="8"
              />
            </svg>
          ) : (
            <svg
              className="fixed bottom-3 right-3"
              width="46"
              height="75"
              viewBox="0 0 46 75"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4.68149 36.7661L39.5707 4.47288C40.211 3.88028 41.25 4.33436 41.25 5.20676L41.25 69.7932C41.25 70.6656 40.211 71.1197 39.5707 70.5271L4.68149 38.2339C4.25386 37.8381 4.25386 37.1619 4.68149 36.7661Z"
                fill="black"
                stroke="black"
                strokeWidth="8"
              />
            </svg>
          )}
        </button>
        {open && <CubeMode />}
      </div>
    </>
  );
};

export default CubeWindow;
