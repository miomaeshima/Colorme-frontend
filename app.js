import ColorThief from "./node_modules/colorthief/dist/color-thief.mjs";

const colorThief = new ColorThief();

//画像を変数に入れる。
// const tsubaki = document.getElementById("tsubaki");
// const fuji = document.getElementById("fuji");
// const cherry = document.getElementById("cherry");
// const christmascc = document.getElementById("christmascc");
// const fujisan = document.getElementById("fujisan");
// const maple = document.getElementById("maple");
// const rice = document.getElementById("rice");
// const yoron = document.getElementById("yoron");
// const christmas = document.getElementById("christmas");

//rgbをもとにpythonにリクエストを投げて、一番近い色の名前をとってくる関数
const getName = async (value) => {
  const body = value;
  const response = await fetch("http://localhost:5000/getclosestcolor", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const jsonData = await response.json();
  return jsonData;
};

//ライブラリcolorthiefを使って画像のメインカラーを調べ、
//さらに上記の関数を使って一番近い色を返す。画像のeventListnerに入れる。
const getRgb = (e) => {
  let pic = e.target;
  if (pic.complete) {
    let result = colorThief.getColor(pic);
    let valueSent = { r: result[0], g: result[1], b: result[2] };
    console.log(valueSent);
    let back = document.getElementById(`${pic.id}Back`);
    let name = document.getElementById(`${pic.id}Name`);
    const promise = getName(valueSent);
    promise
      .then((color) => {
        back.style.background = `rgb(${color.r}, ${color.g}, ${color.b})`;
        console.log(name.id);
        console.log(color.name);
        name.innerText = color.name;
      })
      .catch((e) => console.error(e));
  } else {
    image.addEventListener("load", function () {
      let result = colorThief.getColor(pic);
      let valueSent = { r: result[0], g: result[1], b: result[2] };
      getName(valueSent);
    });
  }
};


let picArray = document.getElementsByTagName("img");

for (let i = 0; i < picArray.length; i++) {
  picArray[i].addEventListener("click", getRgb);
}


fetch("http://localhost:5000/getname")
  .then((res) => res.json())
  .then((data) => console.log(data));
