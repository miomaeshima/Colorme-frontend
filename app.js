import ColorThief from "./node_modules/colorthief/dist/color-thief.mjs";
const colorThief = new ColorThief();

//rgbをもとにバックエンドのpythonにリクエストを投げて、一番近い色の名前をとってくる関数
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
//さらに上記の関数を使って一番近い色を返す。画像のeventListnerに入れる関数。
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

//各画像がクリックされたときgetRgbという関数が走るように仕込む。
let picArray = document.getElementsByTagName("img");

for (let i = 0; i < picArray.length; i++) {
  picArray[i].addEventListener("click", getRgb);
}

//デバイス中の画像を選んで表示する。
//画像を表示するハコをpreviewPicBackという変数にしておく。
const previewPicBack = document.getElementById("previewPicBack");

//画像を選ぶinputをinputという変数にしておく。
const input = document.getElementById("input");

//inputで画像が選ばれる＝changeがあるとdisplayPic(画像を表示する関数）が走るようにしておく。
input.addEventListener("change", displayPic);

//previewPicを定義する
function displayPic(event) {
  //まずevent.target(=input)が読み込んだデータは配列なので一つ選んで変数にする。
  let file = event.target.files[0];

  //次に、inputが読み込んだ時点で、FileReaderのインスタンスができるようにする。
  //let reader = new FileReader()だけでは空っぽだが、
  //reader.readAsDataURL(file)が走ることでreaderの中にfileの情報が入る。
  let reader = new FileReader();
  reader.readAsDataURL(file);

  //readerの読み込みが完了（onload)したときに、
  //読み込まれたファイルをsrcにもつimg要素ができて、previewにつく関数を定義する。
  //ちなみに、ここでのevent.targetはreader、eventはonload。
  //これで選ばれたファイルが表示されるようになる。
  reader.onload = function (event) {
    let previewPic = document.createElement("img");
    previewPic.src = reader.result;
    previewPic.id = "previewPic";
    let previewPicName = document.createElement("div");
    previewPicName.id = "previewPicName";
    previewPicName.class = "namebox";
    //clickすると色の名前が返っておくようにgetRgbも仕込んでおく。
    previewPic.addEventListener("click", getRgb);
    previewPicBack.append(previewPic, previewPicName);
  };
}
