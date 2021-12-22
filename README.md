# spreadsheet-to-md
JS script that reads selected spreadsheet page and exports a markdown table in a markdown file

Mockup [sheet](https://docs.google.com/spreadsheets/d/1N4kcF0TiMmDlKE4K5TLT7jw48h1-nEgDelSIexT93EA/edit#gid=1845449681)

## Run
- Create your `OAuth 2.0` credentials from your google account that holds the spreadsheet. Download it into a `credentials.json` file and add it to the project. 
- Create a mongoDB database and add its key in `.env`. The `env` file should have this key   `CONNECTION_STRING`=`<YOUR_KEY>`
- Add Spreadsheet details in `auth.js`
    - spreadsheet id
    - range

Run:
- Require node ^14
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