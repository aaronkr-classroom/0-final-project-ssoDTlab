// seedRestaurants.js
"use strict";

/**
 * Listing 15.9 (p. 224)
 */
const mongoose = require("mongoose"),
    Restaurant = require("../models/Restaurant");

// 데이터베이스 연결 설정
mongoose.connect("mongodb://127.0.0.1:27017/ut-nodejs", {
  useNewUrlParser: true,
});

mongoose.connection;

var restaurants = [
  {
    _id: "hoban101",
    title: "춘천호반 닭갈비&막국수",
    description: "순사 닭갈비에 치즈를 추가시켜 먹으면 매우 맛있습니다.",
    price: 12800
  },
  {
    _id: "hack101",
    title: "핵밥정식",
    description: "1인 가정식집. 음식 퀄리티가 좋습니다.",
    price: 12000
  },
  {
    _id: "kwon101",
    title: "권짬뽕",
    description: "짬뽕보다는 자장면이 더 맛있습니다.",
    price: 8000
  },
  {
    _id: "pizza101",
    title: "봉수아 피자",
    description: "개인적으로 하와이안 피자가 매우 맛있습니다.",
    price: 21200
  }
];

var commands = [];


Restaurant.deleteMany({})
  .exec()
  .then((result) => {
    console.log(`Deleted ${result.deletedCount} restaurant records!`);
  });

setTimeout(() => {
  // 프라미스 생성을 위한 구독자 객체 루프
  restaurants.forEach((c) => {
    commands.push(
    Restaurant.create({
        _id: c._id,
        title: c.title,
        description: c.description,
        price: c.price,
      }).then((restaurant) => {
        console.log(`Created restaurant: ${restaurant.title}`);
      })
    );
  });

  console.log(`${commands.length} commands created!`);

  Promise.all(commands)
    .then((r) => {
      console.log(JSON.stringify(r));
      mongoose.connection.close();
      console.log("Connection closed!");
    })
    .catch((error) => {
      console.log(`Error: ${error}`);
    });
}, 500);
