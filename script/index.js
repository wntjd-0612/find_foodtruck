var greyArea = document.getElementById("grey-area");
var upArrow = document.getElementById("up-arrow");

upArrow.addEventListener("click", function () {
  var isExpanded = greyArea.classList.contains("expanded");

  if (isExpanded) {
    greyArea.classList.remove("expanded");
    upArrow.classList.remove("up");
    upArrow.classList.add("down");
  } else {
    greyArea.classList.add("expanded");
    upArrow.classList.remove("down");
    upArrow.classList.add("up");
  }
});

var container = document.getElementById("map");
var options = {
  center: new kakao.maps.LatLng(33.450701, 126.570667),
  level: 3,
};

var map = new kakao.maps.Map(container, options);
var mapContainer = document.getElementById("map"), // 지도를 표시할 div
  mapOption = {
    center: new kakao.maps.LatLng(33.450701, 126.570667), // 지도의 중심좌표
    level: 10, // 지도의 확대 레벨
  };

var map = new kakao.maps.Map(mapContainer, mapOption); // 지도를 생성합니다

// HTML5의 geolocation으로 사용할 수 있는지 확인합니다
if (navigator.geolocation) {
  // GeoLocation을 이용해서 접속 위치를 얻어옵니다
  navigator.geolocation.getCurrentPosition(function (position) {
    var lat = position.coords.latitude, // 위도
      lon = position.coords.longitude; // 경도

    var locPosition = new kakao.maps.LatLng(lat, lon), // 마커가 표시될 위치를 geolocation으로 얻어온 좌표로 생성합니다
      message = '<div style="padding:5px;">여기에 계신가요?!</div>'; // 인포윈도우에 표시될 내용입니다

    // 마커와 인포윈도우를 표시합니다
    displayMarker(locPosition, message);
  });
} else {
  // HTML5의 GeoLocation을 사용할 수 없을때 마커 표시 위치와 인포윈도우 내용을 설정합니다

  var locPosition = new kakao.maps.LatLng(33.450701, 126.570667),
    message = "geolocation을 사용할수 없어요..";

  displayMarker(locPosition, message);
}

// 지도에 마커와 인포윈도우를 표시하는 함수입니다
function displayMarker(locPosition, message) {
  // 마커를 생성합니다
  var marker = new kakao.maps.Marker({
    map: map,
    position: locPosition,
  });

  var iwContent = message, // 인포윈도우에 표시할 내용
    iwRemoveable = true;

  // 인포윈도우를 생성합니다
  var infowindow = new kakao.maps.InfoWindow({
    content: iwContent,
    removable: iwRemoveable,
  });

  // 인포윈도우를 마커위에 표시합니다
  infowindow.open(map, marker);

  // 지도 중심좌표를 접속위치로 변경합니다
  map.setCenter(locPosition);
}
function maker(data) {
  // 주소-좌표 변환 객체를 생성합니다
  var geocoder = new kakao.maps.services.Geocoder();
  // 마커 이미지의 이미지 주소입니다
  var imageSrc =
    "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png";

  for (let i = 0; i < data.length; i++) {
    geocoder.addressSearch(data[i].address, function (result, status) {
      // 정상적으로 검색이 완료됐으면
      if (status === kakao.maps.services.Status.OK) {
        var coords = new kakao.maps.LatLng(result[0].y, result[0].x);

        // 마커 이미지의 이미지 크기 입니다
        var imageSize = new kakao.maps.Size(24, 35);

        // 마커 이미지를 생성합니다
        var markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize);

        // 마커를 생성합니다
        var marker = new kakao.maps.Marker({
          map: map, // 마커를 표시할 지도
          position: coords, // 마커를 표시할 위치
          title: data[i].placename, // 마커의 타이틀, 마커에 마우스를 올리면 타이틀이 표시됩니다
          image: markerImage, // 마커 이미지
        });
      }
    });
  }
}
// 모달을 가져옵니다
var modal = document.getElementById("modal");

// + 버튼을 가져옵니다
var btn = document.getElementById("plus-sign");

// 모달을 여는 함수
btn.onclick = function () {
  modal.style.display = "block";
};

// 모달 내부의 등록 버튼을 가져옵니다
var submitButton = document.getElementById("submit-button");

submitButton.onclick = function (event) {
  event.preventDefault(); // 페이지 새로고침 방지
  var address = document.getElementById("address").value;
  var place_name = document.getElementById("place_name").value;
  var place_kind = document.getElementById("place_kind").value;
  var data = {
    address: address,
    place_name: place_name,
    place_kind: place_kind,
  };
  fetch("/api/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      console.log(response);
      if (response.ok) {
        alert("등록되었습니다.");
        modal.style.display = "none";
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
};
window.onload = function () {
  //서버에서 보낸 데이터를 가져온다.
  fetch("/api/data")
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      maker(data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
};
// 윈도우에서 클릭 이벤트가 발생했을 때 모달 외부를 클릭하면 모달을 닫습니다
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};