import { useState, useEffect } from 'react';
import * as React from 'react';

import { Switch } from '@mui/material';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import 'bootstrap/dist/css/bootstrap.css';

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
    if (typeof window !== 'undefined') {
      setInitCost(window.localStorage.getItem('cost'));
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
      createData('September', 213, 1971),
      createData('October - 80% rise', 384, 3549),
      createData('November', 384, 3549),
      createData('December', 384, 3549),
      createData('January - 52% rise', 582, 5389),
      createData('Febuary', 582, 5389),
      createData('March', 582, 5389),
      createData('April', 715, 6616),
      createData('May', 715, 6616),
      createData('June', 715, 6616),
      createData('July - 11% drop', 637, 5897),
      createData('August', 637, 5897),
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
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('cost', cost as any);
    }
    setInitCost(cost);
  };
  const [moreDetails, setMoreDetails] = useState<boolean>(false);
  const toggleTableDepth = () => {
    setMoreDetails(!moreDetails);
  };
  return (
    <div className="App">
      <form className="d-flex flex-col align-items-center">
        <h1>What do you pay on average for Electricity + Gas per month?</h1>
        <span
          className="d-flex align-baseline items-center align-items-center
        "
        >
          <p className="m-0">£</p>
          <input
            className="w-50 p-2 m-2"
            type="number"
            value={initCost}
            onChange={(e) => handleChange(e.target.value as any)}
          ></input>
        </span>
        <span className="d-flex align-baseline items-center align-items-center align-items-center">
          <p className="m-0">Detailed Table</p>
          <Switch
            checked={moreDetails}
            onChange={toggleTableDepth}
            inputProps={{ 'aria-label': 'controlled' }}
          />
        </span>
      </form>
      <div className={'d-flex w-100 p-5'}>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Month</TableCell>
                {moreDetails && (
                  <>
                    <TableCell align="right">
                      Current Variable Tariff (Utility Warehouse Predictions)
                      per month
                    </TableCell>
                    <TableCell align="right">
                      OffGem Predictions per Month Rate
                    </TableCell>
                    <TableCell align="right">
                      Utility Warehouse fixed Month rate
                    </TableCell>
                    <TableCell align="right">
                      OffGem Predictions per Year Rate
                    </TableCell>
                    <TableCell align="right">
                      Utility Warehouse fixed Year rate
                    </TableCell>
                    <TableCell align="right">
                      Utility Warehouse Predicted rate Monthly Cost
                    </TableCell>{' '}
                  </>
                )}
                <TableCell align="right">
                  Offgem Predicted Price Cap Monthly Rate
                </TableCell>
                <TableCell align="right">
                  Utility Warehouse fixed Year rate Monthly Cost
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
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {row.month}
                      </TableCell>
                      {moreDetails && (
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
                          <TableCell align="right">£{row.priceCap}</TableCell>
                          <TableCell align="right">£{uWFixedRate}</TableCell>
                          <TableCell align="right">
                            £{Math.round(row.variableTarriffCosts)}
                          </TableCell>
                        </>
                      )}
                      <TableCell align="right">
                        £{Math.round(row.priceCapCosts)}
                      </TableCell>
                      <TableCell align="right">
                        £{Math.round(row.uWFixedRateCosts)}
                      </TableCell>
                      <TableCell align="right">
                        £{Math.round(row.profit)}
                      </TableCell>
                    </TableRow>
                  )
                )}
              <TableRow
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  Average
                </TableCell>
                {moreDetails && (
                  <>
                    <TableCell align="right">
                      £ {Math.round(totalVariableTarriff / rows.length)}
                    </TableCell>
                    <TableCell align="right">
                      £ {Math.round(totalPricecap / rows.length / rows.length)}
                    </TableCell>
                    <TableCell align="right">
                      £ {Math.round(uWFixedRate / 12)}
                    </TableCell>
                    <TableCell align="right">
                      £{Math.round(totalPricecap / rows.length)}
                    </TableCell>
                    <TableCell align="right">
                      £{Math.round(uWFixedRate)}
                    </TableCell>

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
                <TableCell align="right">
                  £{Math.round(savings / rows.length)}
                </TableCell>
              </TableRow>
              <TableRow
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                className="text-light"
              >
                <TableCell component="th" scope="row">
                  Total
                </TableCell>
                {moreDetails && (
                  <>
                    <TableCell align="right">£{totalVariableTarriff}</TableCell>
                    <TableCell align="right">
                      £{Math.round(totalPricecap / rows.length)}
                    </TableCell>
                    <TableCell align="right">
                      £{Math.round(uWFixedRate)}
                    </TableCell>
                    <TableCell align="right">{}</TableCell>
                    <TableCell align="right">{}</TableCell>

                    <TableCell align="right">
                      £{Math.round(totalVariableTarriffCosts)}
                    </TableCell>
                  </>
                )}
                <TableCell align="right">
                  £{Math.round(totalPricecapCosts)}
                </TableCell>
                <TableCell align="right">
                  £{Math.round(totalFixedCosts)}
                </TableCell>
                <TableCell align="right">£{Math.round(savings)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
};

export { InputTable };
