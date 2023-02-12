import puppeteer from 'puppeteer'

export default class Launcher {
  static async build(viewport) {
    const launchOptions = {
      headless: false,
      slowMo: 0,
      args: [
        '--no-sandbox',
        '--disable-setui-sandbox',
        '--disable-web-security',
      ],
    }

    const browser = await puppeteer.launch(launchOptions)
    const page = await browser.newPage()
    const extendedPage = new Launcher(page)
    page.setDefaultTimeout(10000)

    switch (viewport) {
      case 'Mobile':
        const mobileViewport = puppeteer.devices['iPhone X']
        await page.emulate(mobileViewport)
        break
      case 'Tablet':
        const tabletViewport = puppeteer.devices['iPad landscape']
        await page.emulate(tabletViewport)
        break
      case 'Desktop':
        await page.setViewport({ width: 1024, height: 768 })
        break
      default:
        throw new Error('Supported devices are only MOBILE | TABLET | DESKTOP')
    }

    return new Proxy(extendedPage, {
      get: function (_target, property) {
        return extendedPage[property] || browser[property] || page[property]
      },
    })
  }

  constructor(page) {
    this.page = page;

    this.helpers = {
        centerOf: async (element) => {
            const box = await element.boundingBox();
    
            const boxXCenter = box.x + box.width / 2;
            const boxYCenter = box.y + box.height / 2;
            return {x: boxXCenter, y: boxYCenter};
        },
        delay: async(milliseconds) => {
            return await new Promise((resolve) => setTimeout(resolve, milliseconds));
        }
    }
  }
 

  async waitAndClick(selector) {
    await this.page.waitForSelector(selector)
    await this.page.click(selector)
  }

  async clickButtonContainingText (buttonText) {
 
     const [button] = await this.page.$x(`//button[contains(., '${buttonText}')]`);
        if (button) {
            await button.click();
        }
 
}

async clickTagWithAttrValue (htmlTag, attribute, value) {

        const element = await this.page.$x(`//${htmlTag}[@${attribute}="${value}"]`);
        if (element.length > 0) {
            await element[0].click();
        }
        else {
            console.error("element not found")
        }
    }

  
  async drag(selector, distance, direction){
    await this.page.waitForSelector(selector); // wait for selector is important, it checks whether the selector is visible
            const element = await this.page.$(selector);
            const center = await this.helpers.centerOf(element);

            await this.page.mouse.move(center.x, center.y); // click center
            await this.page.mouse.down();

            if (direction === "right") {
                await this.page.mouse.move(center.x + distance, center.y) // move right
            }
            else if (direction === "top") {
                await this.page.mouse.move(center.x, center.y - distance) // move top
            }
            else if (direction === "bottom") {

                await this.page.mouse.move(center.x, center.y + distance) // move bottom
            } else if (direction === "left") {
                await this.page.mouse.move(center.x - distance, center.y) // move left
            }
            await this.helpers.delay(5000);
            await this.page.mouse.up();
  }



  async getPositionBySelector(selector) {
    await this.page.waitForSelector(selector); // wait for selector is important, it checks whether the selector is visible
    const element = await this.page.$(selector);
    const center = await this.helpers.centerOf(element);
    return center;
  }

  async getPositionByElement(element) {
    const center = await this.helpers.centerOf(element);
    return center;
  }

 async getPositionByTagWithAttrValue ( htmlTag, attribute, value) {

        const element = await this.page.$x(`//${htmlTag}[@${attribute}="${value}"]`);
        const center = await this.helpers.centerOf(element[0]);
        return center;
 }

  async clickButtonContainingText(buttonText) {
    const [button] = await this.page.$x(`//button[contains(., '${buttonText}')]`);
    if (button) {
        await button.click();
    }
  }

  async waitAndType(selector, text) {
    await this.page.waitForSelector(selector)
    await this.page.type(selector, text)
  }


  async getText(selector) {
    await this.page.waitForSelector(selector)
    return this.page.$eval(selector, e => e.innerHTML)
  }

  async getCount(selector) {
    await this.page.waitForSelector(selector)
    return this.page.$$eval(selector, items => items.length)
  }

  async waitForText(selector, text) {
    await this.page.waitForSelector(selector)
    try {
      await this.page.waitForFunction(
        (selector, text) =>
          document
            .querySelector(selector)

            .innerText.replace(/\s/g, '')
            .toLowerCase()
            .includes(text.replace(/\s/g, '').toLowerCase()),
        {},
        selector,
        text
      )
    } catch (error) {
      if (error instanceof puppeteer.errors.TimeoutError) {
        throw new Error(`Text "${text}" not found for selector "${selector}"`)
      }
      throw new Error(error)
    }
  }

  async waitForXPathAndClick(xpath) {
    await this.page.waitForXPath(xpath)
    const elements = await this.page.$x(xpath)
    if (elements.length > 1) {
      console.warn('waitForXPathAndClick returned more than one result')
    }
    await elements[0].click()
  }

  async isElementVisible(selector) {
    let visible = true
    await this.page
      .waitForSelector(selector, { visible: true, timeout: 10000 })
      .catch(() => {
        visible = false
      })
    return visible
  }

  async isXPathVisible(selector) {
    let visible = true
    await this.page
      .waitForXPath(selector, { visible: true, timeout: 10000 })
      .catch(() => {
        visible = false
      })
    return visible
  }

  async autoScrollToBottomOfPage() {
    await this.page.evaluate(async () => {
      await new Promise(resolve => {
        let totalHeight = 0
        const distance = 100
        const timer = setInterval(() => {
          const scrollHeight = document.body.scrollHeight
          window.scrollBy(0, distance)
          totalHeight += distance
          if (totalHeight >= scrollHeight) {
            clearInterval(timer)
            resolve()
          }
        }, 200)
      })
    })
  }
}
