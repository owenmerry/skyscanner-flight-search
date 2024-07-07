import { Box, Skeleton } from "@mui/material";

export const FlightResultsSkeleton = ({
  numberOfResultsToShow = 10,
  headerSticky = true,
}: {
  numberOfResultsToShow?: number;
  headerSticky: boolean;
}) => {
  return (
    <Box>
      <div className="relative">
        <div
          className={`${
            headerSticky ? "sticky flex top-0" : ""
          } flex z-10 gap-2 border-2 dark:bg-gray-900 bg-white border-slate-100 py-4 px-4 rounded-lg mb-2 dark:text-white dark:border-gray-800 drop-shadow-sm`}
        >
          <Skeleton
            width="20%"
            variant="text"
            className="mb-2 dark:bg-slate-700 bg-gray-200"
            sx={{ fontSize: "1rem" }}
          />
          <Skeleton
            width="20%"
            variant="text"
            className="mb-2 dark:bg-slate-700 bg-gray-200"
            sx={{ fontSize: "1rem" }}
          />
        </div>
        {Array.from(Array(numberOfResultsToShow)).map((e, k) => (
          <div
            key={`skeleton-flight-${k}`}
            className="mb-2 flex items-center gap-2 border-2 border-slate-100 py-4 px-4 rounded-lg dark:border-gray-700 dark:bg-gray-800 bg-white drop-shadow-sm"
          >
            <div className="flex-1">
              <div className="flex gap-2">
                <Skeleton
                  width="10%"
                  variant="text"
                  className="mb-2 dark:bg-slate-700 bg-gray-200"
                  sx={{ fontSize: "1rem" }}
                />
                <Skeleton
                  width="30%"
                  variant="text"
                  className="mb-2 dark:bg-slate-700 bg-gray-200"
                  sx={{ fontSize: "1rem" }}
                />
                <Skeleton
                  width="20%"
                  variant="text"
                  className="mb-2 dark:bg-slate-700 bg-gray-200"
                  sx={{ fontSize: "1rem" }}
                />
              </div>
              {Array.from(Array(2)).map((e, k) => (
                <div
                  className="flex gap-2 py-2"
                  key={`skeleton-flight-leg-${k}`}
                >
                  <div className="flex flex-1 align-middle self-center">
                    <Skeleton
                      className=" dark:bg-slate-700 bg-gray-200"
                      variant="circular"
                      width={60}
                      height={60}
                      sx={{ fontSize: "1rem" }}
                    />
                  </div>
                  <div className="flex gap-2 flex-1 items-center">
                    <Skeleton
                      width="50%"
                      variant="text"
                      height={40}
                      className=" dark:bg-slate-700 bg-gray-200"
                      sx={{ fontSize: "1rem" }}
                    />
                    <Skeleton
                      width="50%"
                      variant="text"
                      height={40}
                      className=" dark:bg-slate-700 bg-gray-200"
                      sx={{ fontSize: "1rem" }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="w-1/3 text-right">
              <div>
                <div className="inline-block">
                  <Skeleton
                    className="mb-2 dark:bg-slate-700 bg-gray-200"
                    variant="text"
                    width={100}
                    height={50}
                    sx={{ fontSize: "1rem" }}
                  />
                </div>
              </div>
              <div>
                <div className="inline-block">
                  <Skeleton
                    className="mb-2 dark:bg-slate-700 bg-gray-200"
                    variant="text"
                    width={100}
                    height={50}
                    sx={{ fontSize: "1rem" }}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Box>
  );
};
