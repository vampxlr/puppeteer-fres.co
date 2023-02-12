export default class GuestLobbyPage {
    constructor(page) {
      this.page = page
    }
  
    async guestSetup() {
        
        await this.page.waitForSelector('.button--secondary');           
        await this.page.clickButtonContainingText("Skip");
        await this.page.clickButtonContainingText("Enter");
    }
  }
  