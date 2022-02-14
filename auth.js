import fs from 'fs';
import util from 'util';
import readline from 'readline';
import { google } from 'googleapis';
const fsPromises = fs.promises;



// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'token.json';

// console.log(await getSheetData())

export async function getSheetData() {
    const credentials = await getCredentials();
    const auth = await authorize(credentials);
    return await fetchData(auth)
}


async function authorize(credentials) {
    const { client_secret, client_id, redirect_uris } = credentials.installed;
    const oauth2Client = new google.auth.OAuth2(
        client_id, client_secret, redirect_uris[0]);

    // const getToken = promisify(oauth2Client.getToken, oauth2Client)

    let token = {}

    // Check if we have previously stored a token.
    try {
        token = JSON.parse(await fsPromises.readFile(TOKEN_PATH, 'utf-8'))
    } catch (err) {
        const authUrl = oauth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: SCOPES
        })
        const code = await getNewCode(authUrl)
        try {
            let fetchedTokens = await oauth2Client.getToken(code)
            token = fetchedTokens.tokens
            await storeToken(token)
            // oauth2Client.credentials = token
        } catch (err) {
            console.log('Error while trying to retrieve access token')
            throw err
        }
    }
    oauth2Client.setCredentials(token);
    return oauth2Client
}

async function getCredentials() {
    const credentials = await fsPromises.readFile('./credentials.json', 'utf-8');
    return JSON.parse(credentials);
}

async function getNewCode(authUrl) {
    console.log(`Authorize this app by visiting this url: ${authUrl}`);
    try {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        })
        // const code = await rl.question('Enter the code from that page here: ')
        const question = util.promisify(rl.question).bind(rl)
        const code = await question('Enter code from that page here: ');
        rl.close()
        return code
    } catch (error) {
        console.error('Question Rejected', error);
    }

}

async function storeToken(token) {
    await fsPromises.writeFile(TOKEN_PATH, JSON.stringify(token))
    console.log(`Token stored to ${TOKEN_PATH}`)
}

async function fetchData(auth) {
    try {
        const pattern = /\/spreadsheets\/d\/([^\/]+)\/edit[^#]*(?:#gid=([0-9]+))?/gm
        let link = 'https://docs.google.com/spreadsheets/d/1N4kcF0TiMmDlKE4K5TLT7jw48h1-nEgDelSIexT93EA/edit#gid=1845449681';
        let result = pattern.exec(link)
        
        const sheets = google.sheets('v4');
        const spreadsheetId = result[1]
        // Getting Sheet Name
        const sheetNameResponse = await sheets.spreadsheets.get({ auth, spreadsheetId });
        const sheetData = sheetNameResponse.data.sheets.filter(item => {
            if (item.properties.sheetId == Number(result[2]))
                return item.properties.title
        })
        const sheetName = sheetData[0].properties.title;

        // Getting Soreadsheet data
        const range = `${sheetName}`
        const response = await sheets.spreadsheets.values.get({ auth, spreadsheetId, range })
        const rows = response.data.values
        if (rows.length == 0) {
            console.log('No data found.')
            return
        }
        return rows;

    } catch (err) {
        console.log(`The API returned an error: ${err}`)
        return
    }
}
