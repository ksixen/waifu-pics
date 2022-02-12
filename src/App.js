import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import useKeypress from "react-use-keypress";

const App = () => {
  const [state, setState] = useState([]);
  const [bigPic, setBigPic] = useState();
  const [category, setCategory] = useState("sfw/waifu");
  const ScrollToEnd = useRef();
  const BigPicRef = useRef();

  // ON NEXT BTN CLICK
  const onClickBtn = (value) => {
    const copyState = Array.from(state);
    const getLength = copyState.length;

    if (value === "next") {
      if (bigPic.id === copyState.length - 1) {
        axios.get(`https://api.waifu.pics/${category}`).then((res) => {
          const newState = [
            ...copyState,
            { id: getLength, content: res.data.url },
          ];
          setBigPic(undefined);
          setBigPic({ id: getLength, content: res.data.url });
          setState(newState);
          ScrollToEnd.current.scrollIntoView();
        });
      } else if (bigPic.id < getLength - 1) {
        const findImage = copyState.find((res) => res.id === bigPic.id + 1);
        setBigPic(findImage);
      }
    }
    if (value === "prev") {
      const getId = bigPic.id - 1;
      const findImage = copyState.find((res) => res.id === getId);
      if (findImage === undefined) {
        return;
      }
      setBigPic(findImage);
    }
  };

  // CHANGE BIG-PIC TO SELECTED
  const changeBigPic = (elId) => {
    const copyState = Array.from(state);
    const findImg = copyState.find((res) => res.id === elId);
    setBigPic(findImg);
  };

  // CHECK THE STATE FOR IMAGES
  useEffect(() => {
    if (state.length === 0) {
      axios.get(`https://api.waifu.pics/sfw/waifu`).then((res) => {
        setState([{ id: 0, content: res.data.url }]);
        setBigPic({ id: 0, content: res.data.url });
      });
    }
  }, [state.length, state]);

  useKeypress(["ArrowLeft", "ArrowRight"], (event) => {
    if (event.key === "ArrowLeft") {
      onClickBtn("prev");
    } else {
      onClickBtn("next");
    }
  });

  return (
    <div className="container">
      <h3>
        <a href="https://waifu.pics/" rel="no-refer">
          waifu.pics
        </a>
      </h3>
      <div className="btn-group" role="group">
        <button
          className={
            category === "sfw/waifu" ? "btn btn-primary" : "btn btn-secondary"
          }
          onClick={() => setCategory("sfw/waifu")}
        >
          SFW/WAIFU
        </button>

        <button
          className={
            category === "sfw/neko" ? "btn btn-primary" : "btn btn-secondary"
          }
          onClick={() => setCategory("sfw/neko")}
        >
          SFW/NEKO
        </button>
      </div>

      <div className="big-pic">
        {bigPic ? (
          <img src={bigPic.content} className="images" ref={BigPicRef} />
        ) : (
          ""
        )}
      </div>

      <ul className="images-list">
        {state.map((el) => (
          <li key={el.id} onClick={() => changeBigPic(el.id)}>
            <img className="images" src={el.content} />
          </li>
        ))}
        <span ref={ScrollToEnd}></span>
      </ul>
      <div className="btn-group" role="group" aria-label="Basic example">
        <button
          className="btn btn-secondary"
          onClick={() => onClickBtn("prev")}
          title="Click Arrow Left to change picture"
        >
          Prev
        </button>
        <button
          className="btn btn-primary"
          title="Click Arrow Right to change picture"
          onClick={() => onClickBtn("next")}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default App;
