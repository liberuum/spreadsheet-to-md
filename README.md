# spreadsheet-to-md
JS script that reads selected spreadsheet page and exports a markdown table in a markdown file

Mockup [sheet](https://docs.google.com/spreadsheets/d/1N4kcF0TiMmDlKE4K5TLT7jw48h1-nEgDelSIexT93EA/edit#gid=1845449681)

## Install
- Create your [OAuth 2.0](https://support.google.com/cloud/answer/6158849?hl=en) credentials from your google account that holds the spreadsheet. Download it into a `credentials.json` file and add it to the project. 
- Create an `.env` file where you will add credentials from mongodb and your google spreadsheet.
    - The `.env` file should have:
    ```
    CONNECTION_STRING=<MongoDB connection string with password>
    SPREADSHEET_ID=<Google Spreadsheet Id>
    SPREADSHEET_RANGE=<Your sheet name and range>
    ```

## Run:
- Requires `node ^14`
- `npm i`
- `npm run start`

## Example
The script outputs the below table in the `actuals.md` file with the numbers fetched from the spreadsheet. 


| Budget Category               | Forecast           | Actuals            | Difference          | Payments       |
| ---------------------------   | -----------------: | -----------------: | ------------------: | -------------: |
|                               | -                  | -                  | -                   |                |
|Contributor Compensation| 85000.00 | 86009.56 | 1009.56 | 86009.56 |
|Payment Services| 5000.00 | 5505.24 | 505.24 | 5505.24 |
|Gas Fees| 500.00 | 3000.00 | 2500.00 | 3000.00 |
|IT, Infrastructure & Services| 6500.00 | 3857.46 | -2642.54 | 3857.46 |
|Legal Services| 5000.00 | 0.00 | -5000.00 | 0.00 |
|Travel & Conferences| 0.00 | 2561.00 | 2561.00 | 2561.00 |
|One Time Costs| 500.00 | 10427.14 | 9927.14 | 7766.74 |
|Contractor Services| 0.00 | 0.00 | 0.00 | 0.00 |
| **Total** | 102500.00 | 111360.40 | 8860.40 | 108700.00 |

The script is adjusted to the mockup sheet table structure. The script is reading from this range: `Payment Forecast!A11:X38`. 

Each row marked with the value `1` in column `A` is being parsed by the script. The script then parses the data in a `key` `value` pair and uploads it to the database. Below is an example of the `key` `value` pair data: 

```Javascript
{
    itemName: 'Contributor E',
    budgetOwner: 'Core Unit Expenses',
    projectName: 'Permanent Team',
    expenseTag: 'Contributor Compensation',
    comment: 'H1 Payment',
    approved: false,
    paid: '',
    variable: 'Fixed',
    forecast: 10000,
    currency: 'DAI',
    exchangeRate: 1,
    forecast2: 10000,
    estimate: 10000,
    actual: 10000,
    difference: 0,
    allowedDifference: 500,
    owed: 0,
    payment: 10000,
    account: 'AccountAble',
    subAccount: 'Contributor D',
    reportingNote: '',
    auditorNote: '',
    reportingMonth: 'November 2021'
}
```

This data can then be further parsed into an actuals data object that will be used in created the above actuals table. The below data object is summing the values of each expense tag by budget actual (forecast, actual, difference and payment)

```Javascript

[
  {
    type: 'forecast2',
    'Contributor Compensation': 85000,
    'Payment Services': 5000,
    'Gas Fees': 500,
    'IT, Infrastructure & Services': 6500,
    'Legal Services': 5000,
    'Travel & Conferences': 0,
    'One Time Costs': 500,
    'Contractor Services': 0,
    total: 102500
  },
  {
    type: 'actual',
    'Contributor Compensation': 86009.56,
    'Payment Services': 5505.24,
    'Gas Fees': 3000,
    'IT, Infrastructure & Services': 3857.46,
    'Legal Services': 0,
    'Travel & Conferences': 2561,
    'One Time Costs': 10427.14,
    'Contractor Services': 0,
    total: 111360.4
  },
  {
    type: 'difference',
    'Contributor Compensation': 1009.56,
    'Payment Services': 505.24,
    'Gas Fees': 2500,
    'IT, Infrastructure & Services': -2642.54,
    'Legal Services': -5000,
    'Travel & Conferences': 2561,
    'One Time Costs': 9927.14,
    'Contractor Services': 0,
    total: 8860.4
  },
  {
    type: 'payment',
    'Contributor Compensation': 86009.56,
    'Payment Services': 5505.24,
    'Gas Fees': 3000,
    'IT, Infrastructure & Services': 3857.46,
    'Legal Services': 0,
    'Travel & Conferences': 2561,
    'One Time Costs': 7766.74,
    'Contractor Services': 0,
    total: 108700
  }
]
```

Above data objects are stored in the databse that can be fetched and used for a different format than the markdwon file. 