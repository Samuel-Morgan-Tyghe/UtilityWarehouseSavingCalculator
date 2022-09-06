import { useState, useEffect } from 'react';
import * as React from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import 'bootstrap/dist/css/bootstrap.css';
import CountUp from 'react-countup';

const InputTable = () => {
  const [width, setWidth] = useState<number>(0);
  const updateDimensions = () => {
    setWidth(window.innerWidth);
  };
  useEffect(() => {
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

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
  const [moreDetails, setMoreDetails] = useState<boolean>(false);
  const [perMonth, setPerMonth] = useState<boolean>(true);
  const [useOffGem, setUseOffGem] = useState<boolean>(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setInitCost(window.localStorage.getItem('cost'));
    }
  }, []);

  const [rows, setRows] = useState<any>([]);
  function createData(
    month: string,
    variableTarriff: number,
    priceCap: number,
    auxPredictions: number
  ) {
    return {
      month,
      variableTarriff,
      priceCap,
      variableTarriffCosts: 0,
      priceCapCosts: 0,
      uWFixedRateCosts: 0,
      profit: 0,
      auxPredictions,
      increaseRate: 0,
    };
  }

  useEffect(() => {
    const initRows = [
      createData('September', 213, 1971, 1971),
      createData('October', 384, 3549, 3550),
      createData('November', 384, 3549, 3550),
      createData('December', 384, 3549, 3550),
      createData('January', 582, 5389, 5405),
      createData('Febuary', 582, 5389, 5405),
      createData('March', 582, 5389, 5405),
      createData('April', 715, 6616, 7263),
      createData('May', 715, 6616, 7623),
      createData('June', 715, 6616, 7263),
      createData('July', 637, 5897, 6485),
      createData('August', 637, 5897, 6485),
    ];

    const vTDenominator = initRows[0]?.variableTarriff ?? 0;
    const auxDenominator = initRows[0]?.auxPredictions ?? 0;
    const pcDenominator = initRows[0]?.priceCap ?? 0;
    const updatedRows = initRows.map(
      (row: {
        variableTarriff: number;
        priceCap: number;
        auxPredictions: number;
      }) => ({
        ...row,
        auxPredictionsCosts: initCost * (row.auxPredictions / auxDenominator),
        variableTarriffCosts: initCost * (row.variableTarriff / vTDenominator),
        uWFixedRateCosts: initCost * (uWFixedRate / 12 / vTDenominator),
        priceCapCosts: initCost * (row.priceCap / pcDenominator),
        increaseRate: useOffGem
          ? row.variableTarriff / vTDenominator
          : row.auxPredictions / auxDenominator,
        profit:
          (useOffGem
            ? initCost * (row.variableTarriff / vTDenominator)
            : initCost * (row.auxPredictions / auxDenominator)) -
          initCost * (uWFixedRate / 12 / vTDenominator),
      })
    );

    setRows(updatedRows);
  }, [initCost, useOffGem]);

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
  // const totalVariableTarriffCosts = rows.reduce(function (
  //   acc: any,
  //   obj: { variableTarriffCosts: any }
  // ) {
  //   return acc + obj.variableTarriffCosts;
  // },
  // 0);
  const totalAuxCosts = rows.reduce(function (
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
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('cost', cost as any);
    }
    setInitCost(cost);
  };

  // const toggleTableDepth = () => {
  //   setMoreDetails(!moreDetails);
  // };
  return (
    <div className="App">
      <Box
        sx={{
          height: '100vh',
          display: 'flex',
          justifyContent: 'center',
          background:
            'linear-gradient(150deg, rgba(171,171,252,1) 0%, rgba(182,218,232,1) 100%)',
        }}
        className="d-flex flex-col align-items-center bg-blue-600 text-white"
      >
        <Box
          sx={{
            background:
              'linear-gradient(292deg, rgba(171,171,252,1) 0%, rgba(105,164,187,1) 100%)',
            boxShadow: ' rgba(149, 157, 165, 0.2) 0px 8px 24px;',
          }}
          className="rounded p-12"
        >
          <h1>What do you pay on average for Electricity + Gas per month?</h1>
          <p>What did you Pay for the month of August?</p>
          <span
            className="d-flex align-baseline items-center align-items-center
        "
          >
            <p className="m-0">£</p>
            <input
              className="w-100 p-2 m-2 outline-none text-black
              "
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
        </Box>
      </Box>

      <Box
        sx={{}}
        className={`d-flex flex-col w-100 px-6 my-12 ${
          width > 400 ? 'px-12' : ''
        }`}
      >
        <div className="d-flex flex-row w-100 gap-8 ">
          <span className="d-flex flex-row py-4">
            <p
              className={`m-0 cursor-pointer px-2 py-1  slate-900 	border-blue-600 border-y-2 border-l-2  rounded-l ${
                moreDetails ? '' : 'bg-blue-600 text-white'
              }`}
              onClick={() => setMoreDetails(false)}
            >
              Simplified Table
            </p>
            {/* <Switch
              checked={moreDetails}
              onChange={toggleTableDepth}
              inputProps={{ "aria-label": "controlled" }}
            />{" "} */}
            <p
              className={`m-0 cursor-pointer  px-2 py-1  slate-900 	border-blue-600 border-y-2 border-r-2   rounded-r ${
                !moreDetails ? '' : 'bg-blue-600 text-white'
              }`}
              onClick={() => setMoreDetails(true)}
            >
              Detailed Table
            </p>
          </span>
          {moreDetails && (
            <span className="d-flex align-baseline items-center align-items-center align-items-center ">
              <p
                className={`m-0 cursor-pointer px-2 py-1  slate-900 	border-blue-600 border-y-2 border-l-2  rounded-l ${
                  perMonth ? '' : 'bg-blue-600 text-white'
                }`}
                onClick={() => setPerMonth(false)}
              >
                Per year
              </p>
              {/* <Switch
                checked={perMonth}
                onChange={() => setPerMonth(!perMonth)}
                inputProps={{ "aria-label": "controlled" }}
              />{" "} */}
              <p
                className={`m-0 cursor-pointer  px-2 py-1  slate-900 	border-blue-600 border-y-2 border-r-2   rounded-r ${
                  !perMonth ? '' : 'bg-blue-600 text-white'
                }`}
                onClick={() => setPerMonth(true)}
              >
                Per Month
              </p>
            </span>
          )}
          <span className="d-flex align-baseline items-center align-items-center align-items-center ">
            <p
              className={`m-0 cursor-pointer px-2 py-1  slate-900 	border-blue-600 border-y-2 border-l-2  rounded-l ${
                useOffGem ? '' : 'bg-blue-600 text-white'
              }`}
              onClick={() => setUseOffGem(false)}
            >
              Use Auxilione Predictions
            </p>
            {/* <Switch
                checked={perMonth}
                onChange={() => setPerMonth(!perMonth)}
                inputProps={{ "aria-label": "controlled" }}
              />{" "} */}
            <p
              className={`m-0 cursor-pointer  px-2 py-1  slate-900 	border-blue-600 border-y-2 border-r-2   rounded-r ${
                !useOffGem ? '' : 'bg-blue-600 text-white'
              }`}
              onClick={() => setUseOffGem(true)}
            >
              Use Offgem Predictions
            </p>
          </span>
          <Box
            sx={{ alignItems: 'center', maxWidth: '450px' }}
            className="d-flex flex col px-4  gap-4 ml-auto  "
          >
            <span className="d-flex flex col border-blue-600 border-2 rounded p-2 bg-white">
              £
              <input
                className="w-100 border-0 outline-0"
                type="number"
                value={initCost}
                placeholder="Calculations start at August
          Rate"
                onChange={(e) =>
                  handleChange((e.target.value as any) > 0 && e.target.value)
                }
              ></input>
            </span>
          </Box>
        </div>
        <TableContainer sx={{}} component={Paper} className="mb-12 mt-2">
          <Table
            sx={{
              minWidth: 650,
            }}
            aria-label="simple table"
          >
            <TableHead>
              <TableRow
                sx={{
                  '&:last-child td, &:last-child th': {
                    backgroundColor: 'ghostwhite',
                  },
                }}
              >
                <TableCell sx={{ backgroundColor: 'ghostwhite' }}>
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
                  </>
                )}
                {useOffGem ? (
                  <TableCell align="right">
                    Offgem Predicted Price Cap Monthly Rate *
                  </TableCell>
                ) : (
                  <TableCell align="right">
                    Auxilione Predicted rate Monthly Cost *
                  </TableCell>
                )}
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
                      increaseRate: number;
                      variableTarriff: any;
                      priceCap: number;
                      variableTarriffCosts: number;
                      priceCapCosts: number;
                      uWFixedRateCosts: number;
                      profit: number;
                      auxPredictionsCosts: number;
                    },
                    _undefined: any,
                    array: string | any[]
                  ) => (
                    <TableRow
                      key={row.name}
                      sx={{
                        '&:last-child td, &:last-child th': { border: 0 },
                      }}
                    >
                      <TableCell
                        sx={{
                          backgroundColor: 'ghostwhite',
                          borderRight: 'solid grey 5px',
                        }}
                        component="th"
                        scope="row"
                      >
                        {row.month}
                        {row.increaseRate > 0 &&
                          ` + ${Math.round(row.increaseRate * 100 - 100)}%`}
                        {row.increaseRate < 0 &&
                          ` - ${Math.round(row.increaseRate * 100 - 100)}%`}
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
                                £{uWFixedRate}
                              </TableCell>
                            </>
                          )}
                        </>
                      )}
                      {useOffGem ? (
                        <TableCell align="right">
                          £
                          <CountUp
                            end={Math.round(row.priceCapCosts)}
                            duration={0.33}
                          />{' '}
                        </TableCell>
                      ) : (
                        <TableCell align="right">
                          £
                          <CountUp
                            end={Math.round(row.auxPredictionsCosts)}
                            duration={0.33}
                          />
                        </TableCell>
                      )}

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
                              ? "#6abc85"
                              : row.profit === 0
                              ? ""
                              : "#ec7979",
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
                  '&:last-child td, &:last-child th': { border: 0 },
                  'th,td:not(:last-child)': {
                    color: 'white',
                    fontWeight: 'bold',

                    backgroundColor: '#f2b74c',
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
                          £{' '}
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
                  </>
                )}

                {useOffGem ? (
                  <TableCell align="right">
                    £{Math.round(totalPricecapCosts / rows.length)}
                  </TableCell>
                ) : (
                  <TableCell align="right">
                    £{Math.round(totalAuxCosts / rows.length)}
                  </TableCell>
                )}
                <TableCell align="right">
                  £{Math.round(totalFixedCosts / rows.length)}
                </TableCell>
                <TableCell
                  /* eslint-disable */
                  sx={{
                    backgroundColor:
                      savings / rows.length >= 0
                        ? savings / rows.length !== 0
                          ? "#6abc85"
                          : "#f2b74c"
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
                  '&:last-child td, &:last-child th': { border: 0 },
                  'th,td:not(:last-child)': {
                    color: 'white',
                    backgroundColor: '#ec7979',
                    fontWeight: 'bold',
                  },
                }}
                className="text-light text-red-500-contras"
              >
                <TableCell
                  sx={{ color: '#ec7979' }}
                  className=""
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
                  </>
                )}
                {useOffGem ? (
                  <TableCell align="right">
                    £
                    <CountUp
                      end={Math.round(totalPricecapCosts)}
                      duration={0.33}
                    />
                  </TableCell>
                ) : (
                  <TableCell align="right">
                    £
                    <CountUp end={Math.round(totalAuxCosts)} duration={0.33} />
                  </TableCell>
                )}
                <TableCell align="right">
                  £<CountUp end={Math.round(totalFixedCosts)} duration={0.33} />
                </TableCell>
                <TableCell
                  sx={{
                    backgroundColor: savings > 0 ? '#6abc85' : '#ec7979',
                    color: 'white',
                    fontWeight: 'bold',
                  }}
                  align="right"
                >
                  £<CountUp end={Math.round(savings)} duration={0.33} />
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      <Box
        sx={{
          height: '100vh',
          background:
            'linear-gradient(292deg, rgba(171,171,252,1) 0%, rgba(105,164,187,1) 100%)',
          boxShadow: ' rgba(149, 157, 165, 0.2) 0px 8px 24px;',
        }}
        className="d-flex align-items-center justify-center"
      >
        <a
          href="https://uw.partners/samuel.morgan1/join"
          target="_blank"
          rel="noopener noreferrer"
          className="text-decoration-none  text-white"
        >
          <Box
            sx={{
              // boxShadow: " rgba(149, 157, 165, 0.2) 0px 8px 24px;",
              boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;',
            }}
            className="  d-flex flex-col align-items-center padding  rounded-lg  p-4 m-12"
          >
            <article className=" text-center text-decoration-none">
              <h2 className="text-decoration-none">
                You could save
                <span className="bold"> £ {Math.round(savings)}</span>
              </h2>
              <h3 className="text-decoration-none">
                Join the Utility Warehouse
              </h3>
              <p className="text-decoration-none">
                3 service subscriptions required for the 12 month Fixed Tarriff
              </p>
              <p>
                Use my referral code 8436166 when you sign up to help keep my
                energy bills low
              </p>
              <Box
                sx={{
                  '& button': { m: 2 },
                }}
              >
                <Button
                  variant="outlined"
                  size="large"
                  className="text-white border-white"
                  sx={{
                    boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;',
                  }}
                >
                  Join Here
                </Button>
              </Box>
            </article>
          </Box>
        </a>
      </Box>
    </div>
  );
};

export { InputTable };
