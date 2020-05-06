import puppeteer from 'puppeteer'

const url = 'https://www.nhk.or.jp/school/himeclip/'

const main = async () => {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.goto(url, { waitUntil: ['networkidle0'] })

    const items = await page.$$('.main table tbody tr')

    const values: {date: string, title: string, description: string}[] = []

    for(const item of items) {
        const date = await (await (await item.$('th'))?.getProperty('textContent'))?.jsonValue() as string ?? null
        const title = await (await ( await item.$('td.affair strong'))?.getProperty('textContent'))?.jsonValue() as string ?? null
        const description = await (await (await item.$('td.affair .description'))?.getProperty('textContent'))?.jsonValue() as string ?? null

        values.push({
            date,
            title,
            description
        })
    }

    console.log(JSON.stringify(values))

    await page.close()
    await browser.close()
}

(async () => await main())()
