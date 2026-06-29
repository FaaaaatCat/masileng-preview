"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

const WEATHER_LABEL = {
  sunny: "맑음",
  cloudy: "약간 흐림",
  rainy: "높은 비",
  overcast: "구름 많음",
  storm: "폭풍우",
  foggy: "안개",
  hot: "더움",
  cold: "추움",
  snowy: "눈",
};
const SITUATION_LABEL = {
  party: "파티",
  anniversary: "기념일",
  formal: "격식있게",
  bright_date: "밝은 데이트",
  night_date: "심야 데이트",
  nightout: "밤밖에 말까",
  deep_talk: "진중한 대화",
  alone: "혼자의 휴일",
  whatever: "상관 없음",
};
const LOCATION_LABEL = { indoor: "집에서", outdoor: "밖에서" };

export default function RecommendResultPage() {
  const params = useParams();
  const slug = params.result ?? "";
  const parts = slug.split("-");
  const weather = parts[0] ?? "";
  const location = parts[parts.length - 1] ?? "";
  const situation = parts.slice(1, -1).join("_");

  const weatherLabel = WEATHER_LABEL[weather] ?? weather;
  const situationLabel = SITUATION_LABEL[situation] ?? situation;
  const locationLabel = LOCATION_LABEL[location] ?? location;

  const imgSrc =
    "https://www.thecocktaildb.com/images/media/drink/metwgh1606770327.jpg";

  return (
    <div
      className="common-card"
      style={{
        width: 480,
        background: "var(--dark-2)",
        border: "1.5px solid var(--dark-2)",
        boxShadow: "0 24px 60px rgba(0,0,0,0.5)",
        overflow: "hidden",
        padding: 0,
      }}
    >
      {/* 상단 히어로 이미지 */}
      <div style={{ position: "relative", width: "100%", height: 400 }}>
        <img
          src={imgSrc}
          alt="애플 모히토"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
          onError={(e) => {
            e.target.style.display = "none";
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to bottom, transparent -50%, var(--dark-2) 100%)",
          }}
        />
        <div
          className="flex flex-col items-center gap-4"
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
          }}
        >
          <p className="common-title-lg" style={{color:"white"}}>추천 결과</p>

          <div
            style={{
              width: 160,
              height: 160,
              borderRadius: "var(--r-md)",
              overflow: "hidden",
              flexShrink: 0,
              boxShadow:"0 24px 60px rgba(0,0,0,0.3)"
            }}
          >
            <img
              src={imgSrc}
              alt="애플 모히토"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
              }}
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
          </div>
        </div>
      </div>

      <div
        className="common-card-inner items-center"
        style={{ gap: 32, paddingTop: 0 }}
      >
        <div
          className="flex flex-col gap-3 items-center"
          style={{ marginTop: 40 }}
        >
          <p
            className="common-title-sm"
            style={{ color: "var(--dark-8)", letterSpacing: "0.08em" }}
          >
            Apple Mojito
          </p>
          <h2
            className="common-title-lg"
            style={{ fontSize: 34, color: "var(--dark-10)" }}
          >
            애플 모히토
          </h2>
          <p
            className="common-body-lg-light"
            style={{
              color: "var(--dark-7)",
              lineHeight: 1.75,
              textAlign: "center",
            }}
          >
            오늘 분위기에 딱 맞는 칵테일을 찾았어요!{" "}
            <span className="font-bold" style={{ color: "var(--coral)" }}>
              #애플모히토
            </span>
            를 추천드려요!
            <br />
            신선한 민트와 사과 향이 어우러진 상큼하고 예쁜 칵테일이 단숨에
            기분을 끌어올려 줄 거예요.
          </p>
        </div>

        {(weatherLabel || situationLabel || locationLabel) && (
          <div className="flex gap-2 flex-wrap justify-center">
            {[weatherLabel, situationLabel, locationLabel]
              .filter(Boolean)
              .map((label) => (
                <span
                  key={label}
                  className="common-list-item-tag"
                  style={{
                    background: "var(--dark-3)",
                    border: "1px solid var(--dark-6)",
                    color: "var(--dark-8)",
                  }}
                >
                  #{label}
                </span>
              ))}
          </div>
        )}

        <div className="flex gap-3 w-full">
          <Link
            href="/recommend/form"
            className="btn btn-lined btn-dark btn-xl flex flex-1"
          >
            다시 추천받기
          </Link>
          <Link
            href="/cocktail/1"
            className="btn btn-filled btn-brand btn-xl flex flex-1"
          >
            '애플 모히토' 레시피 보기
          </Link>
        </div>
      </div>
    </div>
  );
}
