import { addDays, formatDistance } from "date-fns";
import moment from "moment";
import { useEffect, useState } from "react";
import { Loading } from "~/components/ui/loading";
import {
  IndicitiveQuoteResult,
  SkyscannerDateTimeObject,
} from "~/helpers/sdk/indicative/indicative-response";
import { getPlaceFromEntityId } from "~/helpers/sdk/place";
import { getSearchWithCreateAndPoll } from "~/helpers/sdk/query";
import { skyscanner } from "~/helpers/sdk/skyscannerSDK";
import { getRandomNumber } from "~/helpers/utils";

type Answers = "higher" | "lower" | "same";

export const GameJackpot = ({ apiUrl }: { apiUrl: string }) => {
  const [score, setScore] = useState<number>(0);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [answer, setAnswer] = useState<Answers>("same");
  const [yourSelection, setYourSelection] = useState<Answers>("same");
  const [mode, setMode] = useState<
    "starting" | "loading" | "result" | "choose"
  >("starting");
  const [liveSelected, setLiveSelected] = useState<string>("");
  const [cachedSelected, setCachedSelected] = useState<IndicitiveQuoteResult>();

  useEffect(() => {
    runCachedPrices({ start: true });
  }, []);

  const getDateDisplay = (
    dateTime: SkyscannerDateTimeObject,
    display?: string
  ) => {
    return moment(`${dateTime.year}-${dateTime.month}-${dateTime.day}`).format(
      display || "MMM Do"
    );
  };

  const getPlaceDisplay = (entityId: string) => {
    const place = getPlaceFromEntityId(entityId);
    return place ? place.name : "";
  };

  const getSelectionDisplay = (selection: Answers) => {
    return yourSelection === "same"
      ? "Same"
      : yourSelection === "higher"
      ? "Higher"
      : yourSelection === "lower"
      ? "Lower"
      : yourSelection;
  };

  const getNextXMonthsStartDayAndEndDay = (months: number) => {
    let n = 0;
    let arRet = [];

    for (; n < months; n++) {
      const month = moment().startOf("month").add(n, "months");
      const monthFirstDay = month;
      const monthLastDay = month.endOf("month");
      arRet.push({
        displayMonthText: month.format("MMMM YYYY"),
        firstDay: monthFirstDay.format("YYYY-MM-DD"),
        lastDay: monthLastDay.format("YYYY-MM-DD"),
        year: monthLastDay.format("YYYY"),
      });
    }

    return arRet;
  };

  const getTripDays = (departDate: string, returnDate: string) => {
    const departDateObject = new Date(departDate);
    const returnDateObject = addDays(new Date(returnDate), 1);

    return formatDistance(departDateObject, returnDateObject, {});
  };

  const getLink = (quote: IndicitiveQuoteResult) => {
    const from = getPlaceFromEntityId(quote.outboundLeg.originPlaceId);
    const to = getPlaceFromEntityId(quote.inboundLeg.originPlaceId);
    if (!from || !to) return;
    return `/search/${from.iata}/${to.iata}/${getDateDisplay(
      quote.outboundLeg.departureDateTime,
      "YYYY-MM-DD"
    )}/${getDateDisplay(quote.inboundLeg.departureDateTime, "YYYY-MM-DD")}`;
  };

  const runCachedPrices = async ({ start }: { start?: boolean }) => {
    const destinationLocations = [
      "95673529",
      "95673383",
      "27537542",
      "27539733",
      "95565055",
    ];
    const dateArray = getNextXMonthsStartDayAndEndDay(10);
    const date =
      dateArray[getRandomNumber(destinationLocations.length - 1)].firstDay;

    const cachedResponse = await skyscanner().indicative({
      apiUrl,
      query: {
        from: "95565050",
        to: destinationLocations[
          getRandomNumber(destinationLocations.length - 1)
        ],
        depart: moment(date).startOf("month").format("YYYY-MM-DD"),
        return: moment(date).endOf("month").format("YYYY-MM-DD"),
        tripType: "return",
      },
      month: Number(moment(date).format("MM")),
      year: Number(moment(date).format("YYYY")),
      groupType: "date",
    });

    if ("error" in cachedResponse.search) return;

    const randomItemNumber = getRandomNumber(
      Object.keys(cachedResponse.search.content.results.quotes).length - 1
    );
    const randomItemKey = Object.keys(
      cachedResponse.search.content.results.quotes
    )[randomItemNumber];

    setCachedSelected(
      cachedResponse.search.content.results.quotes[randomItemKey]
    );
    setMode("choose");
  };

  const runLiveCheck = async (selected: Answers) => {
    if (!cachedSelected) return;

    setYourSelection(selected);

    const liveResponse = await getSearchWithCreateAndPoll(
      {
        from: cachedSelected.outboundLeg.originPlaceId,
        to: cachedSelected.outboundLeg.destinationPlaceId,
        depart: getDateDisplay(
          cachedSelected.outboundLeg.departureDateTime,
          "YYYY-MM-DD"
        ),
        return: getDateDisplay(
          cachedSelected.inboundLeg.departureDateTime,
          "YYYY-MM-DD"
        ),
      },
      {
        apiUrl,
      }
    );
    if (!liveResponse) return;

    const price = liveResponse.split(".")[0];
    const beforePrice = Number(cachedSelected.minPrice.amount.replace("£", ""));
    const afterPrice = Number(price.replace("£", ""));
    const isChoiceCorrect =
      selected === "same"
        ? beforePrice === afterPrice
        : selected === "higher"
        ? beforePrice < afterPrice
        : selected === "lower"
        ? beforePrice > afterPrice
        : false;
    const correctAnswer =
      beforePrice === afterPrice
        ? "same"
        : beforePrice < afterPrice
        ? "higher"
        : beforePrice > afterPrice
        ? "lower"
        : "same";
    setLiveSelected(price);
    if (isChoiceCorrect) setScore(score + 1);
    setIsCorrect(isChoiceCorrect);
    setAnswer(correctAnswer);
  };

  const handleHigherLowerButton = async ({
    selected,
  }: {
    selected: Answers;
  }) => {
    setMode("loading");
    await runLiveCheck(selected);
    setMode("result");
  };
  const handleTryAgainButton = async () => {
    runCachedPrices({});
  };

  return (
    <>
      <div className="relative z-10 py-16 px-4 mx-auto max-w-screen-xl lg:py-20 lg:px-12 text-center">
        <div className="mb-8 text-2xl font-bold tracking-tight leading-none text-gray-800 md:text-2xl lg:text-3xl dark:text-white">
          <div className="inline-block border-4 p-5 px-10 rounded-2xl mb-5 border-slate-700">
            Your Score: {score}
          </div>
          {cachedSelected ? (
            <div>
              <div className="border-4 p-5 px-10 rounded-2xl mb-5 border-slate-700">
                <div className="text-4xl mb-3">
                  {getPlaceDisplay(cachedSelected.outboundLeg.originPlaceId)} to{" "}
                  {getPlaceDisplay(
                    cachedSelected.outboundLeg.destinationPlaceId
                  )}
                </div>
                <div className="mt-2 text-slate-400">
                  {getDateDisplay(cachedSelected.outboundLeg.departureDateTime)}{" "}
                  to{" "}
                  {getDateDisplay(cachedSelected.inboundLeg.departureDateTime)}
                </div>
                <div className="mt-2 text-slate-400">
                  Trip is{" "}
                  {getTripDays(
                    getDateDisplay(
                      cachedSelected.outboundLeg.departureDateTime,
                      "YYYY-MM-DD"
                    ),
                    getDateDisplay(
                      cachedSelected.inboundLeg.departureDateTime,
                      "YYYY-MM-DD"
                    )
                  )}
                </div>
                <div className="text-5xl mt-2">
                  £{cachedSelected.minPrice.amount}
                </div>
              </div>
              {mode === "loading" ? (
                <div className="mt-5">
                  <div>
                    <Loading />
                  </div>
                  <div
                    className={`inline-block flex-1 p-5 m-5 px-10 bg-blue-700 rounded-2xl`}
                  >
                    Your Selection: {getSelectionDisplay(yourSelection)}
                  </div>
                </div>
              ) : (
                ""
              )}
              {mode === "result" ? (
                <div className="border-4 p-5 px-10 rounded-2xl mb-5 border-slate-700">
                  <div
                    className={`
                    ${isCorrect ? `text-green-700` : `text-red-700`}`}
                  >
                    <div className="mt-5">
                      {isCorrect
                        ? `Your Correct 🥳`
                        : `Better Luck Next Time 😔`}
                    </div>
                    <div className="mt-5">
                      {answer === "same" ? `Its the Same Price 🧑‍🤝‍🧑` : ``}
                      {answer === "higher" ? `Its a Higher Price 📈` : ``}
                      {answer === "lower" ? `Its a Lower Price 📉` : ``}
                    </div>
                    <div className="text-5xl mt-5">{liveSelected}</div>
                  </div>
                  <div>
                    <a
                      className="underline text-blue-600"
                      target="_blank"
                      href={getLink(cachedSelected)}
                    >
                      See Flight{" "}
                      <svg
                        width="13.5"
                        height="13.5"
                        aria-hidden="true"
                        viewBox="0 0 24 24"
                        className="ml-1 inline-block"
                      >
                        <path
                          fill="currentColor"
                          d="M21 13v10h-21v-19h12v2h-10v15h17v-8h2zm3-12h-10.988l4.035 4-6.977 7.07 2.828 2.828 6.977-7.07 4.125 4.172v-11z"
                        ></path>
                      </svg>
                    </a>
                  </div>
                  <div
                    className={`inline-block p-5 m-5 ${
                      isCorrect ? `bg-green-700` : `bg-red-700`
                    } rounded-2xl`}
                  >
                    Your Selection: {getSelectionDisplay(yourSelection)}
                  </div>
                </div>
              ) : (
                ""
              )}
              {mode === "result" ? (
                <div>
                  <div
                    onClick={handleTryAgainButton}
                    className="inline-block p-5 m-5 px-10 bg-slate-600 rounded-2xl cursor-pointer"
                  >
                    Try Again
                  </div>
                </div>
              ) : (
                ""
              )}
              {mode === "choose" ? (
                <div className="flex mb:mt-5">
                  <div
                    onClick={() =>
                      handleHigherLowerButton({ selected: "lower" })
                    }
                    className="flex-1 p-5 m-1 mt-5 md:m-5 bg-slate-600 hover:bg-slate-500 rounded-2xl cursor-pointer"
                  >
                    Lower
                  </div>
                  <div
                    onClick={() =>
                      handleHigherLowerButton({ selected: "same" })
                    }
                    className="flex-1 p-5 m-1 mt-5 md:m-5 bg-slate-600 hover:bg-slate-500 rounded-2xl cursor-pointer"
                  >
                    Same
                  </div>
                  <div
                    onClick={() =>
                      handleHigherLowerButton({ selected: "higher" })
                    }
                    className="flex-1 p-5 m-1 mt-5 md:m-5 bg-slate-600 hover:bg-slate-500 rounded-2xl cursor-pointer"
                  >
                    Higher
                  </div>
                </div>
              ) : (
                ""
              )}
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
    </>
  );
};
