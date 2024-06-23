"use strict";


const router = require("express").Router(),
    restaurantsController = require("../controllers/restaurantsController");

router.get("/", restaurantsController.index, restaurantsController.indexView); // index 라우트 생성
router.get("/new", restaurantsController.new); // 생성 폼을 보기 위한 요청 처리
router.post(
  "/create",
  restaurantsController.create,
  restaurantsController.redirectView
); // 생성 폼에서 받아온 데이터의 처리와 결과를 사용자 보기 페이지에 보여주기
router.get("/:id", restaurantsController.show, restaurantsController.showView);
router.get("/:id/edit", restaurantsController.edit); // viewing을 처리하기 위한 라우트 추가
router.put(
  "/:id/update",
  restaurantsController.update,
  restaurantsController.redirectView
); // 편집 폼에서 받아온 데이터의 처리와 결과를 사용자 보기 페이지에 보여주기
router.delete(
  "/:id/delete",
  restaurantsController.delete,
  restaurantsController.redirectView
);

module.exports = router;
