// controllers/restaurantsController.js
"use strict";

/**
 * Listing 18.9 (p. 268-269)
 * Listing 18.11 (p. 271)
 * restaurantsController.js에서 인덱스 액션 생성과 index 액션의 재방문
 */
const Restaurant = require("../models/Restaurant"), // 사용자 모델 요청
  User = require("../models/User"), // @TODO: Lesson 27.3
  httpStatus = require("http-status-codes"); // @TODO: Lesson 27 HTTP 상태 코드 요청

module.exports = {

  respondJSON: (req, res) => {
    res.json({
      status: httpStatus.OK,
      data: res.locals,
    }); // 로컬 데이터를 JSON 포맷으로 응답
  },

  // JSON 포맷으로 500 상태 코드와 에러 메시지 응답
  errorJSON: (error, req, res, next) => {
    let errorObject;

    if (error) {
      errorObject = {
        status: httpStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
      };
    } else {
      errorObject = {
        status: httpStatus.INTERNAL_SERVER_ERROR,
        message: "Unknown Error.",
      };
    }

    res.json(errorObject);
  },

 
  join: (req, res, next) => {
    let restaurantId = req.params.id, // 요청으로부터 강좌 ID 수집
      currentUser = req.user; // 요청으로부터 현재 사용자 수집

    if (currentUser) {
      // 사용자가 로그인 중인지 확인
      User.findByIdAndUpdate(currentUser, {
        $addToSet: {
            restaurants: restaurantId, // 사용자의 강좌 배열에 강좌 ID 추가
        },
      }) // 사용자의 강좌 배열에 강좌 ID 추가
        .then(() => {
          res.locals.success = true;
          next();
        })
        .catch((error) => {
          next(error);
        });
    } else {
      next(new Error("User must log in."));
    }
  },


  filterUserRestaurants: (req, res, next) => {
    let currentUser = req.user; // 요청으로부터 현재 사용자 수집

    if (currentUser) {
      // 사용자가 로그인 중인지 확인
      let mappedRestaurants = res.locals.restaurants.map((restaurant) => {
        // 강좌 배열을 푸프로 돌며
        let userJoined = currentUser.restaurants.some((userRestaurant) => {
          return userRestaurant.equals(restaurant._id); // 사용자가 강좌에 참여했는지 확인
        });

        return Object.assign(restaurant.toObject(), { joined: userJoined });
      });

      res.locals.restaurants = mappedRestaurants;
      next();
    } else {
      next();
    }
  },

  index: (req, res, next) => {
    Restaurant.find() // index 액션에서만 퀴리 실행
      .then((restaurants) => {
        // 사용자 배열로 index 페이지 렌더링
        res.locals.restaurants = restaurants; // 응답상에서 사용자 데이터를 저장하고 다음 미들웨어 함수 호출
        next();
      })
      .catch((error) => {
        // 로그 메시지를 출력하고 홈페이지로 리디렉션
        console.log(`Error fetching restaurants: ${error.message}`);
        next(error); // 에러를 캐치하고 다음 미들웨어로 전달
      });
  },
  indexView: (req, res) => {
    /*
     * Listing 26.3 (p. 384)
     * @TODO: userController.js에서 쿼리 매개변수가 존재할 때 JSON으로 응답하기
     */
    if (req.query.format === "json") {
      res.json(res.locals.users);
    } else {
      res.render("restaurants/index", {
        page: "restaurants",
        title: "All Restaurants",
      }); // 분리된 액션으로 뷰 렌더링
    }
  },

  /**
   * 노트: 구독자 컨트롤러에서 index 액션이 getAllSubscribers를 대체한다. main.js에서 액션 관련
   * 라우트 index를 가리키도록 수정하고 subscribers.ejs를 index.ejs로 변경된 점을 기억하자. 이
   * 뷰는 views 폴더 아래 subscribers 폴더에 있어야 한다.
   */

 
  // 폼의 렌더링을 위한 새로운 액션 추가
  new: (req, res) => {
    res.render("restaurants/new", {
      page: "new-restaurant",
      title: "New Restaurant",
    });
  },

  // 사용자를 데이터베이스에 저장하기 위한 create 액션 추가
  create: (req, res, next) => {
    let restaurantParams = {
      title: req.body.title,
      description: req.body.description,
      maxStudents: req.body.maxStudents,
      cost: req.body.cost,
    };
    // 폼 파라미터로 사용자 생성
    Restaurant.create(restaurantParams)
      .then((restaurant) => {
        res.locals.redirect = "/restaurants";
        res.locals.restaurant = restaurant;
        next();
      })
      .catch((error) => {
        console.log(`Error saving restaurant: ${error.message}`);
        next(error);
      });
  },

  // 분리된 redirectView 액션에서 뷰 렌더링
  redirectView: (req, res, next) => {
    let redirectPath = res.locals.redirect;
    if (redirectPath) res.redirect(redirectPath);
    else next();
  },

  /**
   * 노트: 구독자 컨트롤러에 new와 create 액션을 추가하는 것은 새로운 CRUD 액션을 맞춰
   * getAllSubscribers와 saveSubscriber 액션을 삭제할 수 있다는 의미다. 게다가 홈
   * 컨트롤러에서 할 것은 홈페이지인 index.ejs 제공밖에 없다.
   */

 
  show: (req, res, next) => {
    let restaurantId = req.params.id; // request params로부터 사용자 ID 수집
    Restaurant.findById(crestaurantId) // ID로 사용자 찾기
      .then((restaurant) => {
        res.locals.restaurant = restaurant; // 응답 객체를 통해 다음 믿들웨어 함수로 사용자 전달
        next();
      })
      .catch((error) => {
        console.log(`Error fetching restaurant by ID: ${error.message}`);
        next(error); // 에러를 로깅하고 다음 함수로 전달
      });
  },

  // show 뷰의 렌더링
  showView: (req, res) => {
    res.render("restaurants/show", {
      page: "restaurant-details",
      title: "Restaurant Details",
    });
  },

  /**
   * Listing 20.6 (p. 294)
   * edit와 update 액션 추가
   */
  // edit 액션 추가
  edit: (req, res, next) => {
    let restaurantId = req.params.id;
    Restaurant.findById(restaurantId) // ID로 데이터베이스에서 사용자를 찾기 위한 findById 사용
      .then((restaurant) => {
        res.render("restaurants/edit", {
          restaurant: restaurant,
          page: "edit-restaurant",
          title: "Edit Restaurant",
        }); // 데이터베이스에서 내 특정 사용자를 위한 편집 페이지 렌더링
      })
      .catch((error) => {
        console.log(`Error fetching restaurant by ID: ${error.message}`);
        next(error);
      });
  },

  // update 액션 추가
  update: (req, res, next) => {
    let restaurantId = req.params.id,
        restaurantParams = {
        title: req.body.title,
        description: req.body.description,
        maxStudents: req.body.maxStudents,
        cost: req.body.cost,
      }; // 요청으로부터 사용자 파라미터 취득

    Restaurant.findByIdAndUpdate(restaurantId, {
      $set: restaurantParams,
    }) //ID로 사용자를 찾아 단일 명령으로 레코드를 수정하기 위한 findByIdAndUpdate의 사용
      .then((restaurant) => {
        res.locals.redirect = `/restaurants/${restaurantId}`;
        res.locals.restaurant = restaurant;
        next(); // 지역 변수로서 응답하기 위해 사용자를 추가하고 다음 미들웨어 함수 호출
      })
      .catch((error) => {
        console.log(`Error updating restaurant by ID: ${error.message}`);
        next(error);
      });
  },

  /**
   * Listing 20.9 (p. 298)
   * delete 액션의 추가
   */
  delete: (req, res, next) => {
    let restaurantId = req.params.id;
    Restaurant.findByIdAndRemove(restaurantId) // findByIdAndRemove 메소드를 이용한 사용자 삭제
      .then(() => {
        res.locals.redirect = "/restaurants";
        next();
      })
      .catch((error) => {
        console.log(`Error deleting restaurant by ID: ${error.message}`);
        next();
      });
  },
};
