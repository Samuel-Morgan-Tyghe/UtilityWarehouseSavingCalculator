import { useState, useEffect } from "react";
import * as React from "react";

import { Switch } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import "bootstrap/dist/css/bootstrap.css";
import CountUp from "react-countup";

const InputTable = () => {
  const uWFixedRate = 3650;

  // uWFixedRate = 4212;
  // Unit Rate
  // 69.697 pence per kWh
  // Standing Charge
  // 39.664 pence per day
  // const uWFixedRateElec = { unitRate: 69.697, standingCharge: 39.664 };

  // Unit Rate
  // 16.627 pence per kWh
  // Standing Charge
  // 17.360 pence per day
  // const uWFixedRateGas = { unitRate: 16.627, standingCharge: 17.36 };

  const [initCost, setInitCost] = useState<any>(0);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setInitCost(window.localStorage.getItem("cost"));
    }
  }, []);

  const [rows, setRows] = useState<any>([]);
  function createData(
    month: string,
    variableTarriff: number,
    priceCap: number
  ) {
    return {
      month,
      variableTarriff,
      priceCap,
      variableTarriffCosts: 0,
      priceCapCosts: 0,
      uWFixedRateCosts: 0,
      profit: 0,
    };
  }

  useEffect(() => {
    const initRows = [
      createData("September", 213, 1971),
      createData("October - 80% rise", 384, 3549),
      createData("November", 384, 3549),
      createData("December", 384, 3549),
      createData("January - 52% rise", 582, 5389),
      createData("Febuary", 582, 5389),
      createData("March", 582, 5389),
      createData("April", 715, 6616),
      createData("May", 715, 6616),
      createData("June", 715, 6616),
      createData("July - 11% drop", 637, 5897),
      createData("August", 637, 5897),
    ];

    const vTDenominator = initRows[0]?.variableTarriff ?? 0;
    const pcDenominator = initRows[0]?.priceCap ?? 0;
    const updatedRows = initRows.map(
      (row: { variableTarriff: number; priceCap: number }) => ({
        ...row,
        variableTarriffCosts: initCost * (row.variableTarriff / vTDenominator),
        uWFixedRateCosts: initCost * (uWFixedRate / 12 / vTDenominator),
        priceCapCosts: initCost * (row.priceCap / pcDenominator),
        profit:
          initCost * (row.variableTarriff / vTDenominator) -
          initCost * (uWFixedRate / 12 / vTDenominator),
      })
    );

    setRows(updatedRows);
  }, [initCost]);

  const totalVariableTarriff = rows.reduce(function (
    acc: any,
    obj: { variableTarriff: any }
  ) {
    return acc + obj.variableTarriff;
  },
  0);
  const totalPricecap = rows.reduce(function (
    acc: any,
    obj: { priceCap: any }
  ) {
    return acc + obj.priceCap;
  },
  0);
  const totalPricecapCosts = rows.reduce(function (
    acc: any,
    obj: { priceCapCosts: any }
  ) {
    return acc + obj.priceCapCosts;
  },
  0);
  const totalVariableTarriffCosts = rows.reduce(function (
    acc: any,
    obj: { variableTarriffCosts: any }
  ) {
    return acc + obj.variableTarriffCosts;
  },
  0);
  const totalFixedCosts = rows.reduce(function (
    acc: any,
    obj: { uWFixedRateCosts: any }
  ) {
    return acc + obj.uWFixedRateCosts;
  },
  0);
  const savings = rows.reduce(function (acc: any, obj: { profit: any }) {
    return acc + obj.profit;
  }, 0);

  const handleChange = (cost: any) => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("cost", cost as any);
    }
    setInitCost(cost);
  };
  const [moreDetails, setMoreDetails] = useState<boolean>(false);
  const [perMonth, setPerMonth] = useState<boolean>(true);
  const toggleTableDepth = () => {
    setMoreDetails(!moreDetails);
  };
  return (
    <div className="App">
      <form className="d-flex flex-col align-items-center">
        <h1>What do you pay on average for Electricity + Gas per month?</h1>
        <p>What did you Pay for the month of August?</p>
        <span
          className="d-flex align-baseline items-center align-items-center
        "
        >
          <p className="m-0">£</p>
          <input
            className="w-100 p-2 m-2"
            type="number"
            value={initCost}
            placeholder="Calculations start at August
            Rate"
            onChange={(e) =>
              handleChange((e.target.value as any) > 0 && e.target.value)
            }
          ></input>
        </span>
        <p>Calculations start at August Rate and assume consistent usage</p>
        <p>* Note: Prices will fluctuate depending on how much you use *</p>

        <span className="d-flex align-baseline items-center align-items-center align-items-center">
          <p className="m-0">
            {moreDetails ? "Detailed Table" : "Simplified Table"}
          </p>
          <Switch
            checked={moreDetails}
            onChange={toggleTableDepth}
            inputProps={{ "aria-label": "controlled" }}
          />
        </span>
        {moreDetails && (
          <span className="d-flex align-baseline items-center align-items-center align-items-center">
            <p className="m-0">{perMonth ? "Per Month" : "Per Year"}</p>
            <Switch
              checked={perMonth}
              onChange={() => setPerMonth(!perMonth)}
              inputProps={{ "aria-label": "controlled" }}
            />
          </span>
        )}
      </form>
      <div className={"d-flex w-100 "}>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow
                sx={{
                  "&:last-child td, &:last-child th": {
                    backgroundColor: "ghostwhite",
                  },
                }}
              >
                <TableCell sx={{ backgroundColor: "ghostwhite" }}>
                  Month
                </TableCell>
                {moreDetails && (
                  <>
                    {perMonth ? (
                      <>
                        <TableCell align="right">
                          Current Variable Tariff (Utility Warehouse
                          Predictions) per month
                        </TableCell>
                        <TableCell align="right">
                          OffGem Predictions per Month Rate
                        </TableCell>
                        <TableCell align="right">
                          Utility Warehouse fixed Month rate
                        </TableCell>
                      </>
                    ) : (
                      <>
                        <TableCell align="right">
                          OffGem Predictions per Year Rate
                        </TableCell>
                        <TableCell align="right">
                          Utility Warehouse fixed Year rate
                        </TableCell>
                      </>
                    )}
                    <TableCell align="right">
                      Utility Warehouse Predicted rate Monthly Cost *
                    </TableCell>
                  </>
                )}
                <TableCell align="right">
                  Offgem Predicted Price Cap Monthly Rate *
                </TableCell>
                <TableCell align="right">
                  Utility Warehouse fixed Year rate Monthly Cost *
                </TableCell>
                <TableCell align="right">Savings</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows &&
                rows.map(
                  (
                    row: {
                      name: any;
                      month: any;
                      variableTarriff: any;
                      priceCap: number;
                      variableTarriffCosts: number;
                      priceCapCosts: number;
                      uWFixedRateCosts: number;
                      profit: number;
                    },
                    _undefined: any,
                    array: string | any[]
                  ) => (
                    <TableRow
                      key={row.name}
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                      }}
                    >
                      <TableCell
                        sx={{
                          backgroundColor: "ghostwhite",
                          borderRight: "solid grey 5px",
                        }}
                        component="th"
                        scope="row"
                      >
                        {row.month}
                      </TableCell>
                      {moreDetails && (
                        <>
                          {perMonth ? (
                            <>
                              <TableCell align="right">
                                £{row.variableTarriff}
                              </TableCell>
                              <TableCell align="right">
                                £ {Math.round(row.priceCap / array.length)}
                              </TableCell>
                              <TableCell align="right">
                                £ {Math.round(uWFixedRate / 12)}
                              </TableCell>
                            </>
                          ) : (
                            <>
                              <TableCell align="right">
                                £{row.priceCap}
                              </TableCell>
                              <TableCell align="right">
                                £
                                <CountUp end={uWFixedRate} duration={0.33} />
                              </TableCell>
                            </>
                          )}
                          <TableCell align="right">
                            £
                            <CountUp
                              end={Math.round(row.variableTarriffCosts)}
                              duration={0.33}
                            />
                          </TableCell>
                        </>
                      )}
                      <TableCell align="right">
                        £
                        <CountUp
                          end={Math.round(row.priceCapCosts)}
                          duration={0.33}
                        />
                      </TableCell>
                      <TableCell align="right">
                        £
                        <CountUp
                          end={Math.round(row.uWFixedRateCosts)}
                          duration={0.33}
                        />
                      </TableCell>
                      <TableCell
                        /* eslint-disable */
                        sx={{
                          backgroundColor:
                            row.profit > 0
                              ? "green"
                              : row.profit === 0
                              ? ""
                              : "red",
                          color: row.profit !== 0 ? "white" : "",
                          fontWeight: "bold",
                        }}
                        /* eslint-enable */
                        align="right"
                      >
                        £
                        <CountUp end={Math.round(row.profit)} duration={0.33} />
                      </TableCell>
                    </TableRow>
                  )
                )}
              <TableRow
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                  "th,td:not(:last-child)": {
                    color: "white",
                    fontWeight: "bold",

                    backgroundColor: "orange",
                  },
                }}
              >
                <TableCell component="th" scope="row">
                  Average
                </TableCell>
                {moreDetails && (
                  <>
                    {perMonth ? (
                      <>
                        <TableCell align="right">
                          £ {Math.round(totalVariableTarriff / rows.length)}
                        </TableCell>
                        <TableCell align="right">
                          £{" "}
                          {Math.round(
                            totalPricecap / rows.length / rows.length
                          )}
                        </TableCell>
                        <TableCell align="right">
                          £ {Math.round(uWFixedRate / 12)}
                        </TableCell>
                      </>
                    ) : (
                      <>
                        <TableCell align="right">
                          £{Math.round(totalPricecap / rows.length)}
                        </TableCell>
                        <TableCell align="right">
                          £{Math.round(uWFixedRate)}
                        </TableCell>
                      </>
                    )}
                    <TableCell align="right">
                      £{Math.round(totalVariableTarriffCosts / rows.length)}
                    </TableCell>
                  </>
                )}

                <TableCell align="right">
                  £{Math.round(totalPricecapCosts / rows.length)}
                </TableCell>
                <TableCell align="right">
                  £{Math.round(totalFixedCosts / rows.length)}
                </TableCell>
                <TableCell
                  /* eslint-disable */
                  sx={{
                    backgroundColor:
                      savings / rows.length >= 0
                        ? savings / rows.length !== 0
                          ? "green"
                          : "orange"
                        : "red",
                    color: "white",
                    fontWeight: "bold",
                  }}
                  /* eslint-enable */

                  align="right"
                >
                  £{Math.round(savings / rows.length)}
                </TableCell>
              </TableRow>
              <TableRow
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                  "th,td:not(:last-child)": {
                    color: "white",
                    backgroundColor: "red",
                    fontWeight: "bold",
                  },
                }}
                className="text-light text-red-500-contras"
              >
                <TableCell
                  className="text-red-500-contras"
                  component="th"
                  scope="row"
                >
                  Total
                </TableCell>
                {moreDetails && (
                  <>
                    {perMonth ? (
                      <>
                        <TableCell align="right">
                          £{totalVariableTarriff}
                        </TableCell>
                        <TableCell align="right">
                          £{Math.round(totalPricecap / rows.length)}
                        </TableCell>
                        <TableCell align="right">
                          £{Math.round(uWFixedRate)}
                        </TableCell>
                      </>
                    ) : (
                      <>
                        <TableCell align="right">{}</TableCell>
                        <TableCell align="right">{}</TableCell>
                      </>
                    )}
                    <TableCell align="right">
                      £
                      <CountUp
                        end={Math.round(totalVariableTarriffCosts)}
                        duration={0.33}
                      />
                    </TableCell>
                  </>
                )}
                <TableCell align="right">
                  £
                  <CountUp
                    end={Math.round(totalPricecapCosts)}
                    duration={0.33}
                  />
                </TableCell>
                <TableCell align="right">
                  £<CountUp end={Math.round(totalFixedCosts)} duration={0.33} />
                </TableCell>
                <TableCell
                  sx={{
                    backgroundColor: savings > 0 ? "green" : "red",
                    color: "white",
                    fontWeight: "bold",
                  }}
                  align="right"
                >
                  £<CountUp end={Math.round(savings)} duration={0.33} />
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      <a
        href="https://uw.partners/samuel.morgan1/join"
        target="_blank"
        rel="noopener noreferrer"
        className="text-decoration-none bg-white text-slate-600"
      >
        <section className="  d-flex flex-col align-items-center padding bg-primary-200 rounded rounded-lg p-4 m-4">
          <article className=" text-center text-decoration-none">
            <h2 className="text-decoration-none">
              You could save
              <span className="bold"> £ {Math.round(savings)}</span>
            </h2>
            <h3 className="text-decoration-none">Join the Utility Warehouse</h3>
            <p className="text-decoration-none">
              3 service subscriptions required for the 12 month Fixed Tarriff
            </p>
            <p>
              Use my referral code 8436166 when you sign up to help keep my
              energy bills low
            </p>
            <Box sx={{ "& button": { m: 2 } }}>
              <Button variant="outlined" size="large">
                Join Here
              </Button>
            </Box>
          </article>
        </section>
      </a>
    </div>
  );
};

export { InputTable };
